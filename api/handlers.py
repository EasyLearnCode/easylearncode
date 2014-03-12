__author__ = 'nampnq'

from application.handlers import BaseHandler, user_required


class GetWeekResultHandler(BaseHandler):
    @user_required
    def get(self, week_id):
        from application.models import WeeklyQuiz
        import json
        if week_id == "current":
            test = WeeklyQuiz.get_this_week_contest()
        else:
            from google.appengine.ext import ndb
            test = ndb.Key(urlsafe=week_id).get()

        if test:
            quizs = WeeklyQuiz.get_quizs_last()
            top_player = test.get_players()
            test_key = test.key.urlsafe()
            levels = []
            for levelkey in test.level_keys:
                level = levelkey.get()
                level2 = level.to_dict()
                level2.pop("level_keys", None)
                level2.update({'description_html': level.description_html})
                levels.append(level2)

            test = test.to_dict()
            test.pop("level_keys", None)
            test.pop('start_date', None)
            test.pop('publish_date', None)
            test.update({'top_player': top_player})
            test.update({'test_key': test_key})
            test.update({'levels': levels})
            test.update({'quizs': quizs})
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

        weeklyquizlevel = ndb.Key(urlsafe=data['key']).get()
        deferred.defer(weeklyquizlevel.run_test_case, code=data['source'], lang=data['lang'], user_key=self.user_key)
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


def json_extras(obj):
    from google.appengine.ext import ndb

    if isinstance(obj, ndb.Key):
        return obj.urlsafe()


class GetThisweekContestHandler(BaseHandler):
    @user_required
    def get(self):
        from application.models import WeeklyQuiz, WeeklyQuizResult
        import json

        test = WeeklyQuiz.get_this_week_contest()
        if test:
            test_key = test.key
            top_player = WeeklyQuizResult.get_top_player(test_key)
            result_last_week = WeeklyQuizResult.get_result_last_week(self.user_key)
            this_quiz_level = test.get_this_contest_level(self.user_key)
            test = test.to_dict()
            test.pop('start_date', None)
            test.pop('publish_date', None)
            test.update({'top_player': top_player})
            test.update({'result_last_week': result_last_week})
            test.update({'test_key': test_key.urlsafe()})
            test.update({'this_quiz_level': this_quiz_level[0].to_dict()})
            test['this_quiz_level'].update({'description_html': this_quiz_level[0].description_html})
            test['this_quiz_level'].update({'quiz_level_key': this_quiz_level[0].key.urlsafe()})
            test['this_quiz_level'].update({'level': this_quiz_level[0].level})
            self.response.headers["Content-Type"] = "application/json"
            print test
            self.response.write(json.dumps(test, default=json_extras))
        else:
            self.response.headers["Content-Type"] = "application/json"
            self.response.write(json.dumps({'status': 1}))


