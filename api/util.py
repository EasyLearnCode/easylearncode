__author__ = 'nampnq'
import os
import json
import functools
import re
import cgi

from google.appengine import api
from google.appengine.ext import ndb
import webapp2

from application.config import config


HAS_PIL = True
try:
    import PIL
    from google.appengine.api.images import delete_serving_url
    from google.appengine.api.images import get_serving_url_async
except:
    HAS_PIL = False

DEBUG = os.environ.get("SERVER_SOFTWARE", "").startswith("Dev")
re_image = re.compile(r"image/(png|jpeg|jpg|webp|gif|bmp|tiff|ico)", re.IGNORECASE)


def json_extras(obj):
    """Extended json processing of types."""
    if hasattr(obj, "get_result"):  # RPC
        return obj.get_result()
    if hasattr(obj, "strftime"):  # datetime
        return obj.strftime("%Y-%m-%dT%H:%M:%S.") + str(obj.microsecond / 1000) + "Z"
    if isinstance(obj, ndb.GeoPt):
        return {"lat": obj.lat, "lon": obj.lon}
    if isinstance(obj, ndb.Key):
        r = webapp2.get_request()
        if r.get("recurse", default_value=False):
            item = obj.get()
            if item is None:
                return obj.urlsafe()
            item = item.to_dict()
            item["$class"] = obj.kind()
            return item
        return obj.urlsafe()
    if isinstance(obj, ndb.BlobProperty):
        d = {}
        for prop in ["content_type", "creation", "filename", "size"]:
            d[prop] = getattr(obj, prop)
        key = obj.key()
        if HAS_PIL and re_image.match(obj.content_type):
            d["image_url"] = get_serving_url_async(key)
        d["Id"] = str(key)
        return d
    return None


# Decorator to return the result of a function as json. It supports jsonp by default.
def as_json(func):
    """Returns json when callback in url"""

    @functools.wraps(func)
    def wrapper(self, *args, **kwargs):
        self.response.headers["Content-Type"] = "application/json"
        if DEBUG:
            self.response.headers["Access-Control-Allow-Origin"] = "*"
            self.response.headers["Access-Control-Allow-Methods"] = "POST,GET,PUT,PATCH,HEAD,OPTIONS"
            self.response.headers["Access-Control-Allow-Headers"] = "Content-Type"
        try:
            resp = func(self, *args, **kwargs)
            if resp is None:
                resp = {}
        except BreakError as e:
            return
        except LoginError as e:
            self.response.set_status(401)
            resp = {
                "error": e.__class__.__name__,
                "message": e.message,
            }
        except (AppError, api.datastore_errors.BadArgumentError,
                api.datastore_errors.BadRequestError) as e:
            self.response.set_status(400)
            resp = {"error": e.__class__.__name__, "message": e.message}
        if not isinstance(resp, str) and not isinstance(resp, unicode):
            resp = json.dumps(resp, default=json_extras)
        if config.get("JSONP", False):
            callback = self.request.get("callback")
            if callback:
                self.response.headers["Content-Type"] = "text/javascript"
                resp = "%s(%s);".format(callback, resp)
        if config.get("CORS", False):
            origin = self.request.headers.get("Origin")
            if not config['CORS_RESTRICTED_DOMAINS']:
                self.response.headers.add_header("Access-Control-Allow-Origin", "*")
            elif origin in config['CORS_RESTRICTED_DOMAINS']:
                self.response.headers.add_header("Access-Control-Allow-Origin", origin)
        self.response.out.write(resp)

    return wrapper


# Custom Exceptions
class AppError(Exception):
    pass


class BreakError(Exception):
    pass


class LoginError(Exception):
    pass


re_json = re.compile(r"^application/json", re.IGNORECASE)


def parse_body(self):
    if re_json.match(self.request.content_type):
        data = json.loads(self.request.body)
    else:
        data = {}
        for k, v in self.request.POST.items():
            if isinstance(v, cgi.FieldStorage):
                raise AppError("Files should be uploaded separately as their own form to /api/files/ and \
            then their ids should be uploaded and stored with the object.")
            if type(v) in [str, unicode]:
                try:
                    v = json.loads(v)
                except ValueError:
                    pass
            # TODO(doug): Bug when loading multiple json lists with same key
            # TODO(doug): Bug when loading a number that should be a string representation of said number
            if k in data:
                current = data[k]
                if isinstance(current, list):
                    current.append(v)
                else:
                    data[k] = [current, v]
            else:
                data[k] = v
    return data or {}
