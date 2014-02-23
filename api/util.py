__author__ = 'nampnq'
import os
import json
import functools
from application.config import config
from google.appengine import api
from google.appengine.ext import ndb

DEBUG = os.environ.get("SERVER_SOFTWARE", "").startswith("Dev")


def json_extras(obj):
    """Extended json processing of types."""
    if hasattr(obj, "get_result"):  # RPC
        return obj.get_result()
    if hasattr(obj, "strftime"):  # datetime
        return obj.strftime("%Y-%m-%dT%H:%M:%S.") + str(obj.microsecond / 1000) + "Z"
    if isinstance(obj, ndb.GeoPt):
        return {"lat": obj.lat, "lon": obj.lon}
    if isinstance(obj, ndb.Key):
        return obj.urlsafe()
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
        if config.get("CORS",False):
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