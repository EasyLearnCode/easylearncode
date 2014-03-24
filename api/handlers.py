__author__ = 'nampnq'

from application.handlers import BaseHandler, user_required


class GetWeekResultHandler(BaseHandler):
    @user_required
    def get(self, week_id):
        from application.models import WeeklyQuiz, WeeklyQuizResult
        import json
        if week_id == "current":
            test = WeeklyQuiz.get_this_week_contest()
        else:
            from google.appengine.ext import ndb
            test = ndb.Key(urlsafe=week_id).get()
        if test:
            test_key = test.key
            top_player = WeeklyQuizResult.get_top_player(test_key, 100)
            self.response.headers["Content-Type"] = "application/json"
            self.response.write(json.dumps(top_player))
        else:
            self.response.headers["Content-Type"] = "application/json"
            self.response.write(json.dumps({'status': 1}))


class SubmitContestHandler(BaseHandler):
    @user_required
    def post(self):
        import json
        from google.appengine.ext import ndb
        from google.appengine.ext import deferred

        data = json.loads(self.request.body)
        weeklyquizlevel = ndb.Key(urlsafe=data['key']).get()
        deferred.defer(run_test_case, level_key=data['key'], code=data['source'], lang=data['lang'],
                       user_key=self.user_key)
        self.response.headers["Content-Type"] = "application/json"
        self.response.write(json.dumps({'status': 1}))


def run_test_case(level_key, **kwargs):
    import urllib
    import logging
    import json
    from google.appengine.ext import ndb
    from google.appengine.api import urlfetch
    from application.config import config
    from application.models import WeeklyQuizResult, WeeklyQuiz

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
            self.response.write(result.content)
        else:
            self.response.write("{status:'Server die!'}")


def json_extras(obj):
    from google.appengine.ext import ndb

    if isinstance(obj, ndb.Key):
        return obj.urlsafe()


class GetThisweekContestHandler(BaseHandler):
    @user_required
    def get(self, level_id):
        from application.models import WeeklyQuiz, WeeklyQuizResult
        import json

        test = WeeklyQuiz.get_this_week_contest()
        if test:
            test_key = test.key
            top_player = WeeklyQuizResult.get_top_player(test_key, 5)

            this_quiz_levels = test.get_this_contest_level(self.user_key)
            this_quiz_level = this_quiz_levels[0]
            level_current = this_quiz_levels[0]
            rank = test.get_rank_user(self.user_key)
            if level_id != "current":
                from google.appengine.ext import ndb

                this_quiz_level = ndb.Key(urlsafe=level_id).get()
            test = test.to_dict()
            test.pop('start_date', None)
            test.pop('publish_date', None)
            test.update({'top_player': top_player})

            test.update({'test_key': test_key.urlsafe()})
            test.update({'user_key': self.user_key})
            test.update({'rank': rank})
            test.update({'this_quiz_level': this_quiz_level.to_dict()})
            test['this_quiz_level'].update({'description_html': this_quiz_level.description_html})
            test['this_quiz_level'].update({'quiz_level_key': this_quiz_level.key.urlsafe()})
            test['this_quiz_level'].update({'level': level_current.level})
            self.response.headers["Content-Type"] = "application/json"
            print test
            self.response.write(json.dumps(test, default=json_extras))
        else:
            self.response.headers["Content-Type"] = "application/json"
            self.response.write(json.dumps({'status': 1}))
