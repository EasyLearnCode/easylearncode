__author__ = 'nampnq'

from application.handlers import BaseHandler, user_required
from util import as_json
from restful import current_user


class GetWeekResultHandler(BaseHandler):
    @user_required
    @as_json
    def get(self, week_id):
        from application.models import WeeklyQuiz, WeeklyQuizResult

        if week_id == "current":
            test = WeeklyQuiz.get_this_week_contest()
        else:
            from google.appengine.ext import ndb
            test = ndb.Key(urlsafe=week_id).get()
        if test:
            test_key = test.key
            top_player = WeeklyQuizResult.get_top_player(test_key, 100)
            return top_player
        else:
            return {'status': 1}


class SubmitContestHandler(BaseHandler):
    @user_required
    @as_json
    def post(self):
        import json
        from google.appengine.ext import deferred

        data = json.loads(self.request.body)
        deferred.defer(run_test_case, level_key=data['key'], code=data['source'], lang=data['lang'],
                       user_key=self.user_key)
        return {'status': 'ok'}


def run_test_case(level_key, **kwargs):
    import urllib
    import logging
    import json
    from google.appengine.ext import ndb
    from google.appengine.api import urlfetch
    from application.config import config
    from application.models import WeeklyQuizResult, WeeklyQuiz
    from google.appengine.api import channel

    level = ndb.Key(urlsafe=level_key).get()
    test_result = []

    def handle_result(rpc, **kwargs):
        result = rpc.get_result()
        if result and result.content:
            compile_result = json.loads(result.content)
            print compile_result
            testcase = {'time_used': float(compile_result['run_status']['time_used']) or None,
                        'memory_used': int(compile_result['run_status']['memory_used']) or None}
            if compile_result['run_status'] and compile_result['run_status']['output'].strip() == kwargs[
                'test_output']:
                testcase['result'] = True
            else:
                testcase['result'] = False
            test_result.append(testcase)
            channel.send_message(current_user().id(), json.dumps(testcase))
            if len(test_result) == len(level.test_case):
                avg_time = sum(
                    test['time_used'] or level.limit_time for test in test_result) / len(
                    level.test_case)
                avg_memory = sum(
                    test['memory_used'] or level.limit_memory for test in test_result) / len(
                    level.test_case)
                result = True
                for test in test_result:
                    result = result and test['result']
                score = level.score
                if avg_memory > level.limit_memory or avg_time > level.limit_time or result == False:
                    score = 0
                else:
                    score -= (avg_time + avg_memory / 10)
                quiz_result = WeeklyQuizResult(user_key=kwargs['user_key'],
                                               level_key=level.key,
                                               result=result,
                                               time_used=avg_time,
                                               memory_used=avg_memory,
                                               language=kwargs['lang'],
                                               code=kwargs['code'],
                                               test_key=WeeklyQuiz.get_this_week_contest().key,
                                               score=score)
                quiz_result.put()
                logging.debug("Finshed run test case")

    def create_callback(rpc, **kwargs):
        return lambda: handle_result(rpc, **kwargs)

    rpcs = []
    data = {
        'source': kwargs['code'],
        'lang': kwargs['lang']
    }
    data.update({'client_secret': config.get("HACKEREARTH_CLIENT_SECRET")})
    data.update({'async': 0})
    print data
    for test in level.test_case:
        rpc = urlfetch.create_rpc()
        rpc.callback = create_callback(rpc, test_output=test.output, lang=kwargs['lang'], code=kwargs['code'],
                                       user_key=kwargs['user_key'])
        data.update({'input': test.input})
        form_data = urllib.urlencode(data)
        urlfetch.make_fetch_call(rpc, url=config.get("HACKEREARTH_RUN_URL"), payload=form_data,
                                 method=urlfetch.POST)
        rpcs.append(rpc)

    # ...

    # Finish all RPCs, and let callbacks process the results.
    for rpc in rpcs:
        rpc.wait()


class RunCodeHandler(BaseHandler):
    @user_required
    @as_json
    def post(self):
        import json
        import urllib
        from google.appengine.api import urlfetch
        from application.config import config

        data = json.loads(self.request.body)
        data.update({'client_secret': config.get("HACKEREARTH_CLIENT_SECRET")})
        data.update({'async': 0})
        data.update({'time_limmit': 2})
        form_data = urllib.urlencode(data)
        result = urlfetch.fetch(url=config.get("HACKEREARTH_RUN_URL"),
                                payload=form_data,
                                method=urlfetch.POST)
        self.response.headers['Content-Type'] = "application/json"
        if result:
            return result.content
        else:
            return {'status': 'Server die!'}


class GetCurrentWeekContestHandler(BaseHandler):
    @user_required
    @as_json
    def get(self):
        from application.models import WeeklyQuiz
        weekly_quiz = WeeklyQuiz.get_current_week_contest()
        if weekly_quiz:
            from application.models import WeeklyQuizUser
            weekly_week_current_user = WeeklyQuizUser.get_by_user(self.user_key)
            if not weekly_week_current_user:
                from google.appengine.ext import deferred
                deferred.defer(WeeklyQuizUser.create_new_by_user, user=self.user_key)
            return {
                "Id": weekly_quiz.key.urlsafe(),
            }
        else:
            return {'status': 1}
