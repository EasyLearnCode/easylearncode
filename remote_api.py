__author__ = 'nampnq'
from google.appengine.ext.remote_api import handler
from google.appengine.ext import webapp
import re

MY_SECRET_KEY = 'secret'
cookie_re = re.compile('^"?([^:]+):.*"?$')

class ApiCallHandler(handler.ApiCallHandler):
    def CheckIsAdmin(self):
        login_cookie = self.request.cookies.get('dev_appserver_login', '')
        match = cookie_re.search(login_cookie)
        if (match and match.group(1) == MY_SECRET_KEY
            and 'X-appcfg-api-version' in self.request.headers):
            return True
        else:
            self.redirect('/_ah/login')
            return False


app = webapp.WSGIApplication([('.*', ApiCallHandler)])
