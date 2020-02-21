import re
import datetime
import logging
import json
import counter

from google.appengine import api
from google.appengine.ext import ndb
from webapp2_extras import auth

from application.models import Course, Exercise, WeeklyQuiz, WeeklyQuizLevel, Lesson, Lecture, User, Code, Test, Quiz, \
    QuizAnswer, Rate, WeeklyQuizRunCodeResult, LessonUser
#import for module exercise
from application.models import Exercise, ExerciseItem, ExerciseProject, ExerciseCheckpoint, File
from util import AppError, LoginError, BreakError
from util import as_json, parse_body
from application.handlers import BaseHandler


class _ConfigDefaults(object):
    # store total model count in metadata field HEAD query
    METADATA = False
    # list of valid models, None means anything goes
    DEFINED_MODELS = {"courses": Course, "quizs": WeeklyQuiz, "levels": WeeklyQuizLevel,
                      "lessons": Lesson, "lectures": Lecture, "codes": Code, "tests": Test, "lecture_quizs": Quiz,
                      "answers": QuizAnswer, "users": User, "files": File, "quizresults": WeeklyQuizRunCodeResult,
                      "rates": Rate, 'lesson_users':LessonUser}
    #Update for module exercise
    DEFINED_MODELS.update({
        "exercises": Exercise,
        "exercise_items": ExerciseItem,
        "exercise_projects": ExerciseProject,
        "exercise_checkpoints": ExerciseCheckpoint
    })
    RESTRICT_TO_DEFINED_MODELS = True
    PROTECTED_MODEL_NAMES = ["(?i)(mesh|messages|files|events|admin|proxy)",
                             "(?i)tailbone.*"]
    post_put_hook = None

    def is_current_user_admin(*args, **kwargs):
        return api.users.is_current_user_admin(*args, **kwargs)

    def get_current_user(*args, **kwargs):
        #return api.users.get_current_user(*args, **kwargs)
        return auth.get_auth().get_user_by_session()
        # from application.models import User
        # return User.get_by_id(auth.get_auth().get_user_by_session()['user_id'])


_config = api.lib_config.register('tailboneRestful', _ConfigDefaults.__dict__)

re_public = re.compile(r"^[A-Z].*")
re_private = re.compile(r"(password|email)")
re_type = type(re_public)
re_admin = re.compile(r"^(A|a)dmin.*")
acl_attributes = [u"owners", u"viewers"]
ProtectedModelError = AppError("This is a protected Model.")
RestrictedModelError = AppError("Models are restricted.")


def validate_modelname(model):
    if [r for r in _config.PROTECTED_MODEL_NAMES if re.match(r, model)]:
        raise ProtectedModelError


def current_user(required=False):
    u = _config.get_current_user()
    if u:
        return ndb.Key("User", u['user_id'])
    if required:
        raise LoginError("User must be logged in.")
    return None


# Reflectively instantiate a class given some data parsed by the restful json POST. If the size of
# an object is larger than 500 characters it cannot be indexed. Otherwise everything else is. In the
# future there may be a way to express what should be indexed or searchable, but not yet.
_latlon = set(["lat", "lon"])
_reISO = re.compile("^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$")
_reKey = re.compile("^[a-zA-Z0-9_\-]{10,500}$")


def reflective_create(cls, data):
    m = cls()
    for k, v in data.iteritems():
        m._default_indexed = True
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
                    logging.info("{} key:'{}' value:{}".format(e, k, v))
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
                    #logging.error("{} key:'{}' value:{}".format(e, k, v))
                    pass
            if recurse:
                subcls = unicode.encode(k, "ascii", errors="ignore")
                v = reflective_create(type(subcls, (ndb.Expando,), {}), v)
        elif t == float:
            v = float(v)
        elif t == int:  # currently all numbers are floats for purpose of quering TODO find better solution
            v = float(v)
        if k == "adminKey":
            m.key = ndb.Key(m.__class__.__name__, v)
        else:
            setattr(m, k, v)
    return m


# Strips any disallowed names {id, _*, etc}.
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


# Parse the id either given or extracted from the data.
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


re_filter = re.compile(r"^([\w\-.]+)(!=|==|=|<=|>=|<|>)(.+)$")
re_composite_filter = re.compile(r"^(AND|OR)\((.*)\)$")
re_split = re.compile(r",\W*")


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


def convert_opsymbol(opsymbol):
    if opsymbol == "==":
        opsymbol = "="
    return opsymbol


# Construct an ndb filter from the query args. Example:
#
#    www.myurl.com?filter=name==other&filter=size<=5
def construct_filter(filter_str):
    m = re_composite_filter.match(filter_str)
    if m:
        filters = [construct_filter(f) for f in re_split.split(m.group(2))]
        if m.group(1) == "AND":
            return ndb.query.AND(*filters)
        else:
            return ndb.query.OR(*filters)
    m = re_filter.match(filter_str)
    if m:
        name, opsymbol, value = m.groups()
        return ndb.query.FilterNode(name, convert_opsymbol(opsymbol), convert_value(value))
    if re_split.match(filter_str):
        return construct_filter("AND({})".format(filter_str))
    raise AppError("Filter format is unsupported: {}".format(filter_str))


# Construct an ndb order from the query args.
def construct_order(cls, o):
    neg = True if o[0] == "-" else False
    o = o[1:] if neg else o
    if hasattr(cls, o):
        p = getattr(cls, o)
    else:
        p = ndb.GenericProperty(o)
    return -p if neg else p


# Construct the filter from a json object.
def construct_filter_json(f):
    t = type(f)
    if t == list:
        if f[0] == "AND":
            filters = [construct_filter_json(x) for x in f[1:]]
            return ndb.query.AND(*filters)
        elif f[0] == "OR":
            filters = [construct_filter_json(x) for x in f[1:]]
            return ndb.query.OR(*filters)
        else:
            name, opsymbol, value = f
            return ndb.query.FilterNode(name, convert_opsymbol(opsymbol), convert_value(value, parseFloat=False))
    else:
        return f


# Construct a query from a json object which includes the filter and order parameters
def construct_query_from_json(cls, filters, orders):
    q = cls.query()
    if filters:
        q = q.filter(construct_filter_json(filters))
    if orders:
        q = q.order(*[construct_order(cls, o) for o in orders])
    return q


# Construct a query from url args
def construct_query_from_url_args(cls, filters, orders):
    q = cls.query()
    q = q.filter(*[construct_filter(f) for f in filters])
    # TODO(doug) correctly auto append orders when necessary like on a multiselect/OR
    q = q.order(*[construct_order(cls, o) for oo in orders for o in re_split.split(oo)])
    return q


# Determine which kind of query parameters are passed in and construct the query.
# Includes paginated results in the response Headers for "More", "Next-Cursor", and "Reverse-Cursor"
def query(self, cls, *extra_filters):
    params = self.request.get("params")
    if params:
        params = json.loads(params)
        page_size = params.get("page_size", 100)
        cursor = params.get("cursor")
        filters = params.get("filter")
        orders = params.get("order")
        projection = params.get("projection") or None
        q = construct_query_from_json(cls, filters, orders)
    else:
        page_size = int(self.request.get("page_size", default_value=100))
        cursor = self.request.get("cursor")
        projection = self.request.get_all("projection")
        projection = [i for sublist in projection for i in sublist.split(",")] if projection else None
        filters = self.request.get_all("filter")
        orders = self.request.get_all("order")
        q = construct_query_from_url_args(cls, filters, orders)
    for f in extra_filters:
        q = f(q)
    cursor = ndb.Cursor.from_websafe_string(cursor) if cursor else None
    if projection:
        # if asking for private variables and not specifing owners and viewers append them
        private = [p for p in projection if not re_public.match(p)]
        if len(private) > 0:
            acl = [p for p in private if p in acl_attributes]
            if len(acl) == 0:
                raise AppError(
                    "Requesting projection of private properties, but did not specify 'owners' or 'viewers' to verify access.")
    results, cursor, more = q.fetch_page(page_size, start_cursor=cursor, projection=projection)
    self.response.headers["More"] = "true" if more else "false"
    if cursor:
        self.response.headers["Cursor"] = cursor.urlsafe()
        # The Reverse-Cursor is used if you construct a query in the opposite direction
        self.response.headers["Reverse-Cursor"] = cursor.reversed().urlsafe()
    return [m.to_dict() for m in results]


# Helper function to validate the date recursively if needed.
def _validate(validator, data, ignored=None):
    if isinstance(validator, re_type):
        if validator.pattern == "":
            return
        if type(data) not in [str, unicode]:
            data = json.dumps(data)
        if not validator.match(data):
            raise AppError("Validator '{}' does not match '{}'".format(validator.pattern, data))
    elif isinstance(validator, dict) and isinstance(data, dict):
        for name, val in data.iteritems():
            if name not in ignored:
                _validate(validator.get(name), val)
    else:
        raise AppError("Unsupported validator type {} : {}".format(validator, type(validator)))


# This validates the data see validation.template.json for an example.
# Must create a validation.json in the root of your application.
def validate(cls_name, data):
    # properties = data.keys()
    # confirm the format of any tailbone specific types
    for name in acl_attributes:
        val = data.get(name)
        if val:
            # TODO(doug): validate list, can't be empty list, must contain id like objects
            pass
        # run validation over remaining properties
    if _validation:
        validations = _validation.get(cls_name)
        if not validations:
            raise AppError("Validation requires all valid models to be listed, use empty quote to skip.")
        _validate(validations, data, acl_attributes)


# evaluate the attributes of your User Class for extra properties
def getAttributes(item, exclude=[]):
    attrs = {}
    d = {}
    d = dict(item.__class__.__dict__)
    d.update(item.__dict__)
    for name, attr in d.items():
        if not name.startswith("_") and \
                not type(attr) is staticmethod and \
                        name not in exclude:
            if callable(attr):
                try:
                    name = '$' + name
                    attrs[name] = attr(item)
                except:
                    pass
            else:
                attrs[name] = attr
    return attrs


# This does all the simple restful handling that you would expect. There is a special catch for
# /users/me which will look up your logged in id and return your information.
class RestfulHandler(BaseHandler):
    def _get(self, model, id, *extra_filters):
        model = model.lower()
        cls = None
        if _config.DEFINED_MODELS:
            cls = _config.DEFINED_MODELS.get(model)
            if not cls and _config.RESTRICT_TO_DEFINED_MODELS:
                raise RestrictedModelError
            if cls:
                model = cls.__name__
        if not cls:
            raise RestrictedModelError
        if id:
            me = False
            if model == "User":
                if id == "me":
                    me = True
                    id = current_user(required=True).urlsafe()
                    logging.info("users me %s" % current_user(required=True))
            if "," in id:
                ids = id.split(",")
                keys = [parse_id(i, model) for i in ids]
                results = ndb.get_multi(keys)
                return [m.to_dict() if m else m for m in results]
            key = parse_id(id, model)
            m = key.get()
            if not m:
                raise AppError("No {} with id {}.".format(model, id))
            if model == "users" and me:
                u = _config.get_current_user()
                if u:
                    for k, v in getAttributes(u).items():
                        if k.startswith("_"):
                            k = "$" + k[1:]
                        setattr(m, k, v)
            return m.to_dict()
        else:
            return query(self, cls, *extra_filters)

    def _delete(self, model, id):
        if not id:
            raise AppError("Must provide an id.")
        model = model.lower()
        if model != "users":
            if _config.DEFINED_MODELS:
                cls = _config.DEFINED_MODELS.get(model)
                if _config.RESTRICT_TO_DEFINED_MODELS and not cls:
                    raise RestrictedModelError
                if cls:
                    model = cls.__name__
            validate_modelname(model)
        u = current_user(required=True)
        if model == "users":
            if id != "me" and id != u:
                raise AppError("Id must be the current " +
                               "user_id or me. User {} tried to modify user {}.".format(u, id))
            id = u.urlsafe()
        key = parse_id(id, model)
        key.delete()

        return {}

    def set_or_create(self, model, id):
        model = model.lower()
        u = current_user(required=True)
        if model == "users":
            if not (id == "me" or id == "" or id == u.urlsafe()):
                raise AppError("Id must be the current " +
                               "user_id or me. User {} tried to modify user {}.".format(u, id))
            id = u.urlsafe()
            cls = User
            model = cls.__name__
        else:
            cls = None
            if _config.DEFINED_MODELS:
                cls = _config.DEFINED_MODELS.get(model)
                if not cls and _config.RESTRICT_TO_DEFINED_MODELS:
                    raise RestrictedModelError
                if cls:
                    model = cls.__name__
            if not cls:
                raise RestrictedModelError
        data = parse_body(self)
        key = parse_id(id, model, data.get("Id"))
        clean_data(data)
        validate(cls.__name__, data)

        m = reflective_create(cls, data)
        if key:
            _m = key.get()
            for k, _ in data.iteritems():
                setattr(_m, k, getattr(m, k))
            m = _m
        m.put()

        redirect = self.request.get("redirect")
        if redirect:
            self.redirect(redirect)
            # Raising break error to avoid header and body writes from @as_json decorator since we override as a redirect
            raise BreakError()
        if id:
            from google.appengine.api import memcache
            logging.info('delete cache model: %s with id: %s' % (model, id))
            cache_id = "to_dict_%s" % (id)
            memcache.delete(cache_id)

        return m.to_dict()

    # Metadata including the count in the response header
    def head(self, model, id):
        if _config.METADATA:
            model = model.lower()
            validate_modelname(model)
            metadata = {
                "total": counter.get_count(model)
            }
            self.response.headers["Metadata"] = json.dumps(metadata)

    @as_json
    def get(self, model, id):
        return self._get(model, id)

    @as_json
    def post(self, *args, **kwargs):
        return self.set_or_create(*args, **kwargs)

    @as_json
    def patch(self, *args, **kwargs):
        # TODO: implement this differently to do partial update
        return self.set_or_create(*args, **kwargs)

    @as_json
    def put(self, *args, **kwargs):
        return self.set_or_create(*args, **kwargs)

    @as_json
    def delete(self, *args, **kwargs):
        return self._delete(*args, **kwargs)


_validation = None