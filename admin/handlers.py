__author__ = 'THANH-THAI'
from application.handlers import BaseHandler


class WeeklyQuizHandler(BaseHandler):
    def get(self):
        params = {}
        params['angular_app_name'] = "easylearncode.admin.weekly_quiz"
        return self.render_template("admin/weekly_quiz.html", **params)


class GetWeeklyQuizHandler(BaseHandler):
    def get(self):
        from application.models import WeeklyQuiz
        import json

        tests = WeeklyQuiz.get_weeklyquizs()
        tests_result = []
        for test in tests:
            test_key = test.key.id()
            test = test.to_dict()
            test.update({'publish_date': str(test['publish_date'])})
            test.update({'start_date': str(test['start_date'])})
            test.update({'test_key': test_key})
            test.update({'description':test['description'][:20]})
            tests_result.append(test)
        self.response.headers["Content-Type"] = "application/json"
        self.response.write(json.dumps(tests_result))


class AdminCourseHandler(BaseHandler):

    def get(self):
        params = {}
        params.update({'angular_app_name':'easylearncode.admin.course'})
        return self.render_template('/admin/course.html',**params)