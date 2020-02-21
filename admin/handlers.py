__author__ = 'THANH-THAI'
from application.handlers import BaseHandler


class AdminQuizHandler(BaseHandler):
    def get(self):
        params = {}
        params['angular_app_name'] = "easylearncode.admin.quiz"
        return self.render_template("admin/weekly_quiz.html", **params)


class AdminCourseHandler(BaseHandler):
    def get(self):
        params = {}
        params.update({'angular_app_name': 'easylearncode.admin.course'})
        return self.render_template('/admin/course.html', **params)