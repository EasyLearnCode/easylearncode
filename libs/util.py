'''
Created on Feb 22, 2012

@author: daoxuandung
'''
"""
Utilities functions for Don't Repeat Yourself (DRY)
"""

import datetime
from google.appengine.ext import ndb
from google.appengine.ext.ndb import Key
from google.appengine.ext.blobstore import BlobKey
from google.appengine.ext.ndb import model
from webapp2_extras.appengine.auth.models import User
from webapp2_extras import auth
import time
from google.appengine.api import taskqueue

import logging


def is_ajax(request):
    """
    Determine if a request is AJAX or normal request
    """
    if 'X-Requested-With' in request.headers:
        if request.headers['X-Requested-With'] == 'XMLHttpRequest':
            return True
        
    # If X-Requested-With is not inside, it's not AJAX request    
    return False


def get_current_user_key():
    """
    Return key of current user based on the session
    Will retrieve user_id from session then construct Key without datastore read
    """
    user = auth.get_auth().get_user_by_session()
    if (user is None):
        return None
    return model.Key(User, user['user_id'])


@ndb.tasklet
def get_current_user():
    user = yield get_current_user_key().get_async()
    raise ndb.Return(user)


def ndb_projection(cls=None, exclude=[]):
    """
    Return list of properties to be retrieved 
    using projection query
    Exclude normally has the properties inside equality filter
    """
    properties = []
    for key in cls._properties:
        if exclude and key in exclude:
            continue
        
        properties.append(cls._properties[key])
    return properties


def ndb_to_dict(model, exclude=None):
    """
    Customization to default model.to_dict function
    Add id to a model dictionary
    Replace default Key of KeyProperty to id
    Remove class
    """
    default_exclude = ["class_", "password", "published", "privacy", "_is_new", "blob_key"]
    if exclude:
        default_exclude = default_exclude + exclude
        
    if isinstance(model, Key):
        dictionary = {}
        dictionary['id'] = str(model.id())
        return dictionary
    
    dictionary = model.to_dict(exclude=default_exclude)
    dictionary['id'] = str(model.key.id())
    
    for k in dictionary:
        value = dictionary[k]
        
        # If a value is Key, change to id so that serialize to client easier
        if isinstance(value, Key):
            dictionary[k] = str(dictionary[k].id())
        
        elif isinstance(value, BlobKey):
            dictionary[k] = str(dictionary[k])
            
        # If datetime
        elif isinstance(value, datetime.datetime):
            dictionary[k] = value.isoformat()
                    
        # If property is KeyProperty, repeated=True
        elif isinstance(value, list):
            id_list = []
            for key in value:
                # If the object in list is key, push the id 
                if isinstance(key, Key):
                    id_list.append(str(key.id()))
                else:
                    id_list.append(str(key))
            dictionary[k] = id_list
            
    return dictionary


def ndb_to_list(model_list, exclude=None):
    """ 
    Return a list of dictionaries 
    from the list of model object
    """
    dict_list = []
    if model_list is not None and len(model_list) > 0:
        for e in model_list:
            dict_list.append(ndb_to_dict(e, exclude=exclude)) 
    return dict_list

@ndb.tasklet
def ndb_to_dict_async(model, detail=[]):
    dictionary = model.to_dict()
    keys = []
    
    # Collect keys
    for k in detail:
        value = dictionary[k]
        if isinstance(value, Key):
            keys.append(value)
    
    # Do batch get
    yield ndb.get_multi_async(keys)
    
    # Parse detail to model dict
    model_dict = ndb_to_dict(model)
    for k in detail:
        entity = yield dictionary[k].get_async()
        model_dict[k] = ndb_to_dict(entity)
        
    raise ndb.Return(model_dict)


@ndb.tasklet
def ndb_to_list_async(model_list, detail=[]):
    """
    Return a list of dictionaries from model object
    Provide deeper level of detail, where the attribute is 
    KeyProperty
    detail=['key_property1', 'key_property2']
    """
    dict_list = []
    
    # keys to do batch retrieval
    keys = []
    
    # Collect keys
    for i in xrange(0, len(model_list)):
        model = model_list[i]
        if not model:
            break
        dictionary = model.to_dict()
        for k in detail:
            value = dictionary[k]
            if isinstance(value, Key):
                keys.append(value)
    
    # Batch retrieval and save to process cache and memcache
    yield ndb.get_multi_async(keys)
    
    # Parse
    for i in xrange(0, len(model_list)):
        model = model_list[i]
        if not model:
            break
        dictionary = model.to_dict()
        model_dict = ndb_to_dict(model)
        for k in detail:
            value = dictionary[k]
            if isinstance(value, Key):
                entity = yield value.get_async()
                if entity:
                    model_dict[k] = ndb_to_dict(entity)
        
        dict_list.append(model_dict)
    
    raise ndb.Return(dict_list)


@ndb.tasklet
def get_url_async(url):
    ctx = ndb.get_context()
    result = yield ctx.urlfetch(url)
    if result.status_code == 200:
        raise ndb.Return(result.content)

    
@ndb.tasklet
def post_url_async(url, body, headers):
    ctx = ndb.get_context()
    result = yield ctx.urlfetch(url, body, 'POST', headers)
    if result.status_code == 200:
        raise ndb.Return(result.content)
    

    
"""
Copied from http://blog.notdot.net/2010/05/App-Engine-Cookbook-On-demand-Cron-Jobs
This module update statistics for Article
"""
def get_interval_number(ts, duration):
    """
    Converting a timestamp to a unix time - 
    which is the number of seconds since the Unix Epoch - 
    and then dividing it by the duration, 
    giving us the number of 'intervals' since the epoch.
    Args:
    ts: The timestamp to convert
    duration: The length of the interval
    Returns:
    int: Interval number.
    """
    return int(time.mktime(ts.timetuple()) / duration)

def add_cron(path=None, name=None, interval=None, when=None, params=None):
    """
    Enqueues an on-demand-cron job.
    The job is only enqueued once during the interval

    Args:
        path: The path to the cron job handler
        name: The name of the cron job handler
        interval: How often the handler should run
        when: When to run the handler.
    """
    logging.info(path)
    interval_num = get_interval_number(when, interval)
    task_name = '-'.join([name, str(interval), str(interval_num)])
    try:
        task = taskqueue.Task(url=path, params=params, name=task_name, eta=when)
        task.add()
    except (taskqueue.TaskAlreadyExistsError, taskqueue.TombstonedTaskError):
        logging.info("TaskAlreadyExist")
        pass
