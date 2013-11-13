"""
models.py

App Engine datastore models

"""


from google.appengine.ext import ndb


class ExampleModel(ndb.Model):
    """Example Model"""
    example_name = ndb.StringProperty(required=True)
    example_description = ndb.TextProperty(required=True)
    added_by = ndb.UserProperty()
    timestamp = ndb.DateTimeProperty(auto_now_add=True)

class Feedback(ndb.Model):
    browser = ndb.JsonProperty()
    url = ndb.StringProperty()
    note = ndb.StringProperty()
    img = ndb.StringProperty(indexed=False)
    html = ndb.StringProperty(indexed=False)