__author__ = 'nampnq'

from application.handlers import BaseHandler, user_required


class GetThisWeekResultHandler(BaseHandler):
    @user_required
    def get(self):
        from application.models import WeeklyQuiz
        import json

        test = WeeklyQuiz.get_this_week_contest()
        if test:
            top_player = test.get_top_player(100)
            test_key = test.key.urlsafe()
            test = test.to_dict()
            test.pop('start_date', None)
            test.pop('publish_date', None)
            test.update({'top_player': top_player})
            test.update({'test_key': test_key})
            self.response.headers["Content-Type"] = "application/json"
            self.response.write(json.dumps(test))
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

        weeklyquiz = ndb.Key(urlsafe=data['key']).get()
        deferred.defer(weeklyquiz.run_test_case, code=data['source'], lang=data['lang'], user_key=self.user_key)
        # quiz_key = weeklyQuiz.key
        # weeklyQuiz = weeklyQuiz.to_dict()
        # data.update({'client_secret': config.get("HACKEREARTH_CLIENT_SECRET")})
        # data.update({'async': 0})
        # for testcase in weeklyQuiz['test_case']:
        #     data.update({'input': testcase['input']})
        #     form_data = urllib.urlencode(data)
        #     result = urlfetch.fetch(url=config.get("HACKEREARTH_RUN_URL"),
        #                             payload=form_data,
        #                             method=urlfetch.POST)
        #     if result and result.content:
        #         compile_result = json.loads(result.content)
        #         testcase['time_used'] = float(compile_result['run_status']['time_used']) or None
        #         testcase['memory_used'] = int(compile_result['run_status']['memory_used']) or None
        #         if compile_result['run_status'] and compile_result['run_status']['output'].split()[0] == testcase[
        #             'output']:
        #             testcase['result'] = True
        #         else:
        #             testcase['result'] = False
        # avg_time = sum(
        #     test['time_used'] or weeklyQuiz['limit_time'] for test in weeklyQuiz['test_case']) / len(
        #     weeklyQuiz['test_case'])
        # avg_memory = sum(
        #     test['memory_used'] or weeklyQuiz['limit_memory'] for test in weeklyQuiz['test_case']) / len(
        #     weeklyQuiz['test_case'])
        # user_key = self.user_key
        # result = True
        # for test in weeklyQuiz['test_case']:
        #     result = result and test['result']
        # achievement = WeeklyQuizResult(user_key=user_key, test_key=quiz_key, result=result, time_used=avg_time,
        #                                memory_used=avg_memory, language=data['lang'], code=data['source'])
        # achievement.put()
        self.response.headers["Content-Type"] = "application/json"
        self.response.write(json.dumps({'status': 1}))


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


class GetThisweekContestHandler(BaseHandler):
    @user_required
    def get(self):
        from application.models import WeeklyQuiz
        import json

        test = WeeklyQuiz.get_this_week_contest()
        if test:
            top_player = test.get_top_player(5)
            test_key = test.key.urlsafe()
            test = test.to_dict()
            test.pop('start_date', None)
            test.pop('publish_date', None)
            test.update({'top_player': top_player})
            test.update({'test_key': test_key})
            self.response.headers["Content-Type"] = "application/json"
            self.response.write(json.dumps(test))
        else:
            self.response.headers["Content-Type"] = "application/json"
            self.response.write(json.dumps({'status': 1}))


