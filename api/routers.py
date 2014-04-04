__author__ = 'nampnq'

from webapp2_extras.routes import RedirectRoute

import handlers
import restful
import files

PREFIX = "/api/"

_routes = [
    RedirectRoute('/api/runcode', handlers.RunCodeInHackerEarthHandle, name='run-code-in-hackerearth',
                  strict_slash=True),
    RedirectRoute('/api/contest', handlers.GetWeekContestHandler, name='get-thisweek-contest',
                  strict_slash=True),
    RedirectRoute('/api/contest/me', handlers.GetWeekContestInfoOfMeHandler, name='get-thisweek-contest',
                  strict_slash=True),
    RedirectRoute('/api/contest/submit', handlers.SubmitContestHandler, name='submit-contest', strict_slash=True),
    RedirectRoute('/api/files/<model>/<id>/<property>', handler=files.FileHandler, name='blog-upload-download', strict_slash=True),
    RedirectRoute(r"{}<model:[^/]+><:/?><id:(.*)>".format(PREFIX), handler=restful.RestfulHandler),
]


def get_routes():
    return _routes


def add_routes(app):
    for r in _routes:
        app.router.add(r)