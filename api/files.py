__author__ = 'nampnq'
import re

from google.appengine.ext.webapp import blobstore_handlers
from google.appengine.ext.ndb import blobstore
from google.appengine.ext import ndb

from application.handlers import BaseHandler, user_required
from util import as_json

HAS_PIL = True
try:
    import PIL
    from google.appengine.api.images import delete_serving_url
    from google.appengine.api.images import get_serving_url_async
except:
    HAS_PIL = False

re_image = re.compile(r"image/(png|jpeg|jpg|webp|gif|bmp|tiff|ico)", re.IGNORECASE)


def blob_info_to_dict(blob_info):
    d = {}
    for prop in ["content_type", "creation", "filename", "size"]:
        d[prop] = getattr(blob_info, prop)
    key = blob_info.key()
    print HAS_PIL, re_image.match(blob_info.content_type)
    if HAS_PIL and re_image.match(blob_info.content_type):
        d["image_url"] = get_serving_url_async(key)
    d["Id"] = str(key)
    return d


class FileHandler(blobstore_handlers.BlobstoreUploadHandler):
    @as_json
    def get(self, model, id, property):
        obj = ndb.Key(urlsafe=id).get()
        if not getattr(obj, property):
            return {'upload_url': blobstore.create_upload_url(self.request.url)}
        else:
            d = {'upload_url': blobstore.create_upload_url(self.request.url)}
            return dict(d,**(blob_info_to_dict(blobstore.BlobInfo.get(getattr(obj, property)))))

    @as_json
    def post(self, model, id, property):
        print model, id, property
        upload_files = self.get_uploads()
        blob_info = upload_files[0]
        obj = ndb.Key(urlsafe=id).get()
        if getattr(obj, property):
            # The property already has a previous value - delete the older blob
            blobstore.delete(getattr(obj, property))

        # Set the blob reference
        setattr(obj, property, blob_info.key())
        obj.put()
        return blob_info_to_dict(blob_info)