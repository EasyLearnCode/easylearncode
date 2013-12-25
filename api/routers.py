__author__ = 'nampnq'

from webapp2_extras.routes import RedirectRoute

from grest import CreateHandler, ReadHandler, UpdateHandler, DeleteHandler
import handlers


_routes = [
    RedirectRoute('/contest/get_thisweek_result', handlers.GetThisWeekResultHandler, name='get-thisweek-result',
                  strict_slash=True),
    RedirectRoute('/run_code', handlers.RunCodeHandler, name='run-code', strict_slash=True),
    RedirectRoute('/contest/get_thisweek_contest', handlers.GetThisweekContestHandler, name='get-thisweek-contest',
                  strict_slash=True),
    RedirectRoute('/contest/submit', handlers.SubmitContestHandler, name='submit-contest', strict_slash=True),
    RedirectRoute('/contest/get_lastweek_result', handlers.GetLastWeekResultHandler, name='get-lastweek-result',
                  strict_slash=True),
    RedirectRoute('/api/<model>/create/',
                  handler=CreateHandler, name="model-create", strict_slash=True),
    RedirectRoute('/api/<model>/read/<model_id:\d+>/',
                  handler=ReadHandler, name="model-read", strict_slash=True),
    RedirectRoute('/api/<model>/update/<model_id:\d+>/',
                  handler=UpdateHandler, name="model-update", strict_slash=True),
    RedirectRoute('/api/<model>/delete/<model_id:\d+>/',
                  handler=DeleteHandler, name="model-delete", strict_slash=True),
]


def get_routes():
    return _routes


def add_routes(app):
    for r in _routes:
        app.router.add(r)