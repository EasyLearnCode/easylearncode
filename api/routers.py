__author__ = 'nampnq'

from webapp2_extras.routes import RedirectRoute

import handlers
import restful

PREFIX = "/api/"

_routes = [
    RedirectRoute('/api/contest/week_result/<week_id>', handlers.GetWeekResultHandler, name='get-thisweek-result',
                  strict_slash=True),
    RedirectRoute('/api/run_code', handlers.RunCodeHandler, name='run-code', strict_slash=True),
    RedirectRoute('/api/contest/get_thisweek_contest', handlers.GetThisweekContestHandler, name='get-thisweek-contest',
                  strict_slash=True),
    RedirectRoute('/api/contest/submit', handlers.SubmitContestHandler, name='submit-contest', strict_slash=True),
    RedirectRoute(r"{}<model>/<id>".format(PREFIX), handler=restful.RestfulHandler),

]


def get_routes():
    return _routes


def add_routes(app):
    for r in _routes:
        app.router.add(r)