'''
Created on Jan 14, 2013

@author: daoxuandung
'''
import json

from google.appengine.ext import ndb

from libs import util
from application.handlers import BaseHandler, user_required


entity_package = "application.models"

########################################################
## Basic functions
########################################################


def cls_from_str(model_name):
    """
    Return a Model class by a string, from entity package
    """

    # If the model name is long and separated by underscore
    # Process it to return equivalent class name in entity
    words = model_name.split("_")
    words = [x.capitalize() for x in words]
    model_name = "".join(words)

    # Import
    try:
        mod = __import__(entity_package, fromlist=[model_name])
        cls = getattr(mod, model_name)
        return cls

    except:
        return None


def __params_to_ndb_attrs(cls, params):
    prop_dict = cls._properties
    values = {}
    for key in prop_dict:
        # Retrieve val
        val = params.get(key)

        # Process for KeyProperty
        prop = prop_dict[key]

        # If property defined is KeyProperty
        if isinstance(prop, ndb.model.KeyProperty):
            # Process param keys
            words = key.split("_")
            last = words[-1]
            if "keys" == last:
                words[-1] = "ids"

            elif "key" == last:
                words[-1] = "id"

            param_key = "_".join(words)
            val = params.get(param_key)

        if val is None:
            continue # Parse for the next attribute

        if isinstance(prop, ndb.model.KeyProperty):
            # If KeyProperty is repeated
            if words[-1] == "ids" and prop._repeated is True:
                ids = json.loads(val)
                assert isinstance(ids, list)
                val = [ndb.Key(prop._kind, int(x)) for x in ids]


            elif words[-1] == "id" and prop._repeated is False:
                val = ndb.Key(prop._kind, int(val))


        # Process for StructuredProperty
        elif isinstance(prop, ndb.model.StructuredProperty):
            json_val = json.loads(val)
            if prop._repeated is True and isinstance(json_val, list):
                val = [__params_to_ndb_attrs(prop._modelclass, x) for x in json_val]

            else:
                val = __params_to_ndb_attrs(prop._modelclass, json_val)

        values[key] = val

    return values


def populate_obj(obj, params):
    """
    Populate ndb object from a dictionary params
    """

    values = __params_to_ndb_attrs(obj.__class__, params)
    obj.populate(**values)


def create(handler, model_name):
    # Get model class, if not found return error
    cls = cls_from_str(model_name)
    if not cls:
        handler.abort(401)

    # Init a class and populate_obj it with request data
    obj = cls()
    populate_obj(obj, handler.request.params)

    # Save to datastore
    obj.put()

    # Return json response
    handler.response.write(json.dumps(util.ndb_to_dict(obj)))


def read(handler, model_name, model_id):
    cls = cls_from_str(model_name)
    obj = cls.get_by_id(int(model_id))

    # Return json response
    if obj:
        handler.response.write(json.dumps(util.ndb_to_dict(obj)))


def update(handler, model_name, model_id):
    cls = cls_from_str(model_name)
    key = ndb.Key(cls, int(model_id))
    obj = key.get()

    # Return json response
    if obj:
        populate_obj(obj, handler)
        obj.put()
        handler.response.write(json.dumps(util.ndb_to_dict(obj)))


def delete(handler, model_name, model_id):
    cls = cls_from_str(model_name)
    key = ndb.Key(cls, int(model_id))
    key.delete()
    handler.response.write(json.dumps(util.ndb_to_dict(key)))


########################################################
## Handlers that invoke above functions
########################################################

class CreateHandler(BaseHandler):
    def post(self, model):
        create(self, model)


class ReadHandler(BaseHandler):
    def get(self, model, model_id):
        read(self, model, model_id)


class UpdateHandler(BaseHandler):
    @user_required
    def post(self, model, model_id):
        update(self, model, model_id)


class DeleteHandler(BaseHandler):
    @user_required
    def post(self, model, model_id):
        delete(self, model, model_id)

