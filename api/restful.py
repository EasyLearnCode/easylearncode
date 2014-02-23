import logging
import datetime
import re

from google.appengine import api

from google.appengine.ext import ndb

from application.handlers import BaseHandler
from application.models import User
from util import AppError, BreakError
from util import as_json


DEFINED_MODELS = None


def parse_body(self):
    import json

    return json.loads(self.request.body)


def parse_id(id, model, data_id=None):
    if data_id:
        if id:
            if data_id != id:
                raise AppError("Url id {%s} must match object id {%s}" % (id, data_id))
        else:
            id = data_id
    if id:
        try:
            key = ndb.Key(urlsafe=id)
        except:
            key = ndb.Key(model, id)
        if model != key.kind():
            raise AppError("Key kind must match id kind: {} != {}.".format(model, key.kind()))
        return key
    return None


_latlon = set(["lat", "lon"])
_reISO = re.compile("^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$")
_reKey = re.compile("^[a-zA-Z0-9\-]{10,500}$")


def reflective_create(cls, data):
    m = cls()
    for k, v in data.iteritems():
        m._default_indexed = True
        if hasattr(m, k):
            setattr(m, k, v)
        else:
            t = type(v)
            if t in [unicode, str]:
                if len(bytearray(v, encoding="utf8")) >= 500:
                    m._default_indexed = False
                elif _reISO.match(v):
                    try:
                        values = map(int, re.split('[^\d]', v)[:-1])
                        values[-1] *= 1000  # to account for python using microseconds vs js milliseconds
                        v = datetime.datetime(*values)
                    except ValueError as e:
                        # logging.info("{} key:'{}' value:{}".format(e, k, v))
                        pass
                elif _reKey.match(v):
                    try:
                        v = ndb.Key(urlsafe=v)
                    except Exception as e:
                        # logging.info("{} key:'{}' value:{}".format(e, k, v))
                        pass
            elif t == list:
                v = [convert_value(x, False) for x in v]
            elif t == dict:
                recurse = True
                if set(v.keys()) == _latlon:
                    try:
                        v = ndb.GeoPt(v["lat"], v["lon"])
                        recurse = False
                    except api.datastore_errors.BadValueError as e:
                        logging.error("{} key:'{}' value:{}".format(e, k, v))
                        pass
                if recurse:
                    subcls = unicode.encode(k, "ascii", errors="ignore")
                    v = reflective_create(type(subcls, (ndb.Expando,), {}), v)
            elif t == float:
                v = float(v)
            elif t == int:  # currently all numbers are floats for purpose of quering TODO find better solution
                v = float(v)
            setattr(m, k, v)
    return m


def convert_value(value, parseFloat=True):
    if type(value) not in [str, unicode]:
        return value
    if value == "true":
        value = True
    elif value == "false":
        value = False
    elif _reISO.match(value):
        try:
            values = map(int, re.split('[^\d]', value)[:-1])
            values[-1] *= 1000  # to account for python using microseconds vs js milliseconds
            value = datetime.datetime(*values)
        except ValueError as e:
            # logging.info("{} key:'{}' value:{}".format(e, k, v))
            pass
    elif _reKey.match(value):
        try:
            value = ndb.Key(urlsafe=value)
        except:
            pass
    elif parseFloat:
        try:
            value = float(value)
        except:
            pass
    return value


def clean_data(data):
    disallowed_names = ["Id", "id", "key"]
    disallowed_prefixes = ["_", "$"]
    exceptions = ["Id"]
    for key in data.keys():
        if key[0] in disallowed_prefixes or key in disallowed_names:
            if key not in exceptions:
                logging.warn("Disallowed key {%s} passed in object creation." % key)
            del data[key]
    return data


class User(User):
    def to_dict(self, *args, **kwargs):
        result = super(User, self).to_dict(*args, **kwargs)
        u = User.get_current_user()
        if u:
            from application import models
            u = models.User.get_by_id(long(u["user_id"]))
        if u and u.key.urlsafe() == self.key.urlsafe():
            pass
        result["Id"] = self.key.urlsafe()
        admin = False
        if admin:
            result["$admin"] = admin
        return result


class RestfulHandler(BaseHandler):
    def _get(self, model, id, *extra_filters):
        if model == "User":
            model = User.__name__
        if id:
            me = False
            if model == "User":
                if id == "me":
                    me = True
                    id = self.user_key.urlsafe()
            if "," in id:
                ids = id.split(",")
                keys = [parse_id(i, model) for i in ids]
                results = ndb.get_multi(keys)
                return [m.to_dict() for m in results]
            key = parse_id(id, model)
            m = key.get()
            if not m:
                if model == "User" and me:
                    m = User()
                    m.key = key
                    setattr(m, "$unsaved", True)
                    u = self.user_key.get()
                    if hasattr(u, "email"):
                        m.email = u.email()
                else:
                    raise AppError("No {} with id {}.".format(model, id))
            return m.to_dict()
            # else:
            #     return query(self, cls, *extra_filters)

    def _delete(self, model, id):
        if not id:
            raise AppError("Must provide an id.")
        u = self.user_key
        if model == "User":
            if id != "me" and id != u:
                raise AppError("Id must be the current " +
                               "user_id or me. User {} tried to modify user {}.".format(u, id))
            id = u.urlsafe()
        key = parse_id(id, model)
        key.delete()

        return {}

    def set_or_create(self, model, id):
        u = self.user_key
        if model == "User":
            if not (id == "me" or id == "" or id == u.urlsafe()):
                raise AppError("Id must be the current " +
                               "user_id or me. User {} tried to modify user {}.".format(u, id))
            id = u.urlsafe()
            cls = User
        data = parse_body(self)
        key = parse_id(id, model, data.get("Id"))
        clean_data(data)

        m = reflective_create(cls, data)
        if key:
            m.key = key

        m.put()

        redirect = self.request.get("redirect")
        if redirect:
            self.redirect(redirect)
            # Raising break error to avoid header and body writes from @as_json decorator since we override as a redirect
            raise BreakError()
        return m.to_dict()


    @as_json
    def get(self, model, id):
        import logging

        logging.info("model:" + model)
        return self._get(model, id)

    @as_json
    def post(self, *args):
        return self.set_or_create(*args)

    @as_json
    def patch(self, *args):
        # TODO: implement this differently to do partial update
        return self.set_or_create(*args)

    @as_json
    def put(self, *args):
        return self.set_or_create(*args)

    @as_json
    def delete(self, *args):
        return self._delete(*args)



