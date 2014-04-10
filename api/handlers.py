# -*- coding: utf-8 -*-
__author__ = 'nampnq'

from application.handlers import BaseHandler, user_required
from util import as_json


class SubmitContestHandler(BaseHandler):
    @user_required
    @as_json
    def post(self):
        import json
        from google.appengine.ext import deferred

        status = 'ok'
        msg = ''
        body_data = json.loads(self.request.body)
        deferred.defer(
            run_test_case,
            weekly_quiz_level=body_data['weekly_quiz_level_key'],
            filename=body_data.get("filename", "Script"),
            code=unicode(body_data['source']).encode('utf-8'), lang=body_data['lang'],
            user=self.user_key, is_submit=True if body_data['type'].lower() == 'submit' else False
        )
        return {
            'status': status,
            'msg': msg,
            'data': {}
        }


def run_test_case(weekly_quiz_level, **kwargs):
    import urllib
    import logging
    import json
    from google.appengine.ext import ndb
    from google.appengine.api import urlfetch
    from application.config import config
    from application.models import WeeklyQuiz, WeeklyQuizRunCodeResult, File, WeeklyQuizUser
    from google.appengine.api import channel

    weekly_quiz_level = ndb.Key(urlsafe=weekly_quiz_level).get()
    weekly_quiz = WeeklyQuiz.query(WeeklyQuiz.level_keys == weekly_quiz_level.key).get()
    user = kwargs['user']
    is_submit = kwargs['is_submit']
    code = kwargs['code']
    lang = kwargs['lang']
    filename = kwargs['filename']
    test_results = []

    def handle_result(handle_result_rpc, **handle_result_kwargs):
        result = handle_result_rpc.get_result()
        if result and result.content:
            compile_result = json.loads(result.content)
            print compile_result
            compile_result_run_status = compile_result['run_status']
            testcase = {
                'time_used': float(compile_result_run_status.get('time_used', 0)),
                'memory_used': float(compile_result_run_status.get('memory_used', 0)),
                'error_html': compile_result_run_status['output_html'] if (
                    compile_result_run_status['status'] == 'RE') else
                compile_result_run_status['status_detail'] if (compile_result_run_status['status'] == 'CE')
                else 'OK'
            }
            if compile_result_run_status and \
                            compile_result_run_status['status'] not in ['CE', 'RE'] and \
                            compile_result_run_status['output'].strip() == handle_result_kwargs['output']:
                testcase['result'] = True
            else:
                testcase['result'] = False
            test_results.append(testcase)
            channel.send_message(str(user.id()), json.dumps(
                dict({
                         'type': 'run_code_result' if not is_submit else 'submit_code_result'}, **testcase)))
            if len(test_results) == len(weekly_quiz_level.test_case):
                channel.send_message(str(user.id()), json.dumps(
                    {
                        'type': 'notification',
                        'msg': 'compile done'
                    }
                ))
                if is_submit:
                    avg_time = sum(
                        test_result['time_used'] for test_result in test_results) / \
                               len(test_results)
                    avg_memory = sum(
                        test_result['memory_used'] for test_result in test_results) / \
                                 len(test_results)
                    result = all([test_result['result'] for test_result in test_results])
                    score = weekly_quiz_level.score
                    if not result or avg_memory > weekly_quiz_level.limit_memory \
                        or avg_time > weekly_quiz_level.limit_time:
                        score = 0
                    else:
                        score -= (avg_time * 10 + avg_memory / 100)
                    code_file = File()
                    code_file.content = code
                    code_file.filename = filename
                    code_file.put()
                    run_code_result = WeeklyQuizRunCodeResult()
                    run_code_result.level = weekly_quiz_level.key
                    run_code_result.user = user
                    run_code_result.code = code_file.key
                    run_code_result.result = result
                    run_code_result.time_used = avg_time
                    run_code_result.memory_used = avg_memory
                    run_code_result.language = lang
                    run_code_result.score = score
                    run_code_result.put()
                    weekly_quiz_user = WeeklyQuizUser.get_by_user_and_weekly_quiz(user=user,
                                                                                  weekly_quiz=weekly_quiz.key)
                    weekly_quiz_user.run_code_result.append(run_code_result.key)
                    _next_level_key = None
                    if result:
                        weekly_quiz_user.passed_level.append(weekly_quiz_level.key)
                        _next_level_key = weekly_quiz_user.current_level = weekly_quiz.get_next_level(
                            weekly_quiz_level.key)
                    else:
                        weekly_quiz_user.current_level = weekly_quiz_level.key

                    def get_best_score_by_user_and_level(_user, _level):
                        _best = WeeklyQuizRunCodeResult.get_best_score_by_user_and_level(
                            user=_user,
                            level=_level)
                        if _best:
                            return _best.score
                        else:
                            if _user == run_code_result.user and _level == run_code_result.level:
                                return run_code_result.score
                            else:
                                return 0

                    weekly_quiz_user.score = sum(
                        get_best_score_by_user_and_level(user, level) for level in weekly_quiz.level_keys)
                    print weekly_quiz_user.score
                    weekly_quiz_user.put()
                    #TODO: Recalc rank of all user
                    channel.send_message(str(user.id()), json.dumps(dict(
                        {
                            'type': 'submit_sumary_result',
                            'result': result,
                            'time_used': avg_time,
                            'memory_used': avg_memory,
                            'score': score,
                            'next_level_key': _next_level_key.urlsafe() if _next_level_key else 'You not passed current level'
                        })
                    ))
                    logging.debug("Finshed run test case")

    def create_callback(create_callback_rpc, **create_callback_kwargs):
        return lambda: handle_result(create_callback_rpc, **create_callback_kwargs)

    rpcs = []
    data = {
        'source': kwargs['code'],
        'lang': kwargs['lang']
    }
    data.update({'client_secret': config.get("HACKEREARTH_CLIENT_SECRET")})
    data.update({'async': 0})
    for test in weekly_quiz_level.test_case:
        rpc = urlfetch.create_rpc()
        rpc.callback = create_callback(rpc, output=test.output)
        data.update({'input': test.input})
        form_data = urllib.urlencode(data)
        urlfetch.make_fetch_call(rpc, url=config.get("HACKEREARTH_RUN_URL"), payload=form_data,
                                 method=urlfetch.POST)
        rpcs.append(rpc)

    for rpc in rpcs:
        rpc.wait()


class GetWeekContestHandler(BaseHandler):
    @user_required
    @as_json
    def get(self):
        from application.models import WeeklyQuiz

        result_data = {}
        msg = ''
        weekly_quiz_id = self.request.get('Id', None)
        if weekly_quiz_id:
            from google.appengine.ext import ndb

            weekly_quiz = ndb.Key(urlsafe=weekly_quiz_id).get()
        else:
            weekly_quiz = WeeklyQuiz.get_current_week_contest()
        if weekly_quiz:
            from application.models import WeeklyQuizUser

            weekly_week_current_user = WeeklyQuizUser.get_by_user(self.user_key)
            if not weekly_week_current_user:
                from google.appengine.ext import deferred

                deferred.defer(WeeklyQuizUser.create_new_by_user, user=self.user_key)
            result_data = weekly_quiz.to_dict()
        else:
            msg = 'No weekly quiz for current week'
        return {
            'status': 'ok',
            'data': result_data,
            'msg': msg
        }


class GetWeekContestInfoOfUserHandler(BaseHandler):
    @user_required
    @as_json
    def get(self):
        from application.models import WeeklyQuiz
        from google.appengine.ext import ndb

        result_data = {}
        msg = ''
        status = 'ok'
        weekly_quiz_id = self.request.get('Id', None)
        user_id = self.request.get('user_id', None)
        if weekly_quiz_id:
            weekly_quiz = ndb.Key(urlsafe=weekly_quiz_id).get()
        else:
            weekly_quiz = WeeklyQuiz.get_current_week_contest()
        if user_id == "me":
            user_key = self.user_key
        else:
            user_key = ndb.Key(urlsafe=user_id)

        result_data = {}
        msg = ''
        if weekly_quiz:
            from application.models import WeeklyQuizUser

            weekly_week_current_user = WeeklyQuizUser.get_by_user_and_weekly_quiz(user_key, weekly_quiz.key)
            if not weekly_week_current_user:
                result_data = WeeklyQuizUser.create_new_by_user(user=user_key).to_dict()
            else:
                result_data = weekly_week_current_user.to_dict()
        return {
            'status': status,
            'data': result_data,
            'msg': msg
        }


class RunCodeInHackerEarthHandle(BaseHandler):
    @user_required
    @as_json
    def post(self):
        import json
        import urllib
        from application.config import config
        from google.appengine.api import urlfetch
        body_data = json.loads(self.request.body)
        data = {
            'client_secret': config.get("HACKEREARTH_CLIENT_SECRET"),
            'async': 0,
            'source': body_data['source'],
            'lang': body_data['lang'],
            'time_limit': 5,
            'memory_limit': 262144,
        }
        result = urlfetch.fetch(url= config.get("HACKEREARTH_RUN_URL"), payload= urllib.urlencode(data), method=urlfetch.POST)
        return result.content


class SavePassedLecture(BaseHandler):
    #TODO kiểm tra tính đúng đắn của dữ liệu
    @user_required
    @as_json
    def post(self):
        import json
        from api.restful import current_user
        from application.models import LessonUser, Lesson
        from google.appengine.ext import ndb
        msg = ''
        status = 'ok'
        current_user = current_user()
        body_data = json.loads(self.request.body)
        lecture_id = ndb.Key(urlsafe=body_data['lecture_id'])
        lesson_id = Lesson.get_by_lecture(lecture_id).key
        lesson_user = LessonUser.get_by_user_and_lesson(current_user, lesson_id)
        if lesson_user:
            lesson_user.passed_lecture.append(lecture_id)
            lesson_user.put()
        else:
            msg = 'no Ok'
        return {
            'status': status,
            'msg': msg,
            'data': lesson_user
        }


class SaveCurrentLecture(BaseHandler):
    #TODO kiểm tra tính đúng đắn của dữ liệu
    @user_required
    @as_json
    def post(self):
        import json
        from api.restful import current_user
        from google.appengine.ext import ndb
        from application.models import LessonUser, Lesson, Course, CourseUser
        msg = ''
        status = 'ok'
        current_user = current_user()
        body_data = json.loads(self.request.body)
        lecture_id = ndb.Key(urlsafe=body_data['lecture_id'])
        lesson = Lesson.get_by_lecture(lecture_id)
        lesson_user = LessonUser.get_by_user_and_lesson(current_user, lesson.key)
        if lesson_user:
            if lecture_id not in lesson_user.passed_lecture:
                lesson_user.current_lecture = lecture_id
        else:
            lesson_user = LessonUser()
            lesson_user.user = current_user
            lesson_user.lesson = lesson.key
            lesson_user.status = 'learning'
            lesson_user.current_lecture = lecture_id
            course = Course.get_by_lesson(lesson.key)
            course_user = CourseUser.get_by_user_and_course(current_user, course.key)
            if course_user:
                lesson_passed = course_user.current_lesson
                course_user.current_lesson = lesson.key
                course_user.passed_lessons.append(lesson_passed)
                lesson_passed_user = LessonUser.get_by_user_and_lesson(current_user, lesson_passed)
                if lesson_passed_user:
                    lesson_passed_user.status = 'passed'
                    lesson_passed_user.put()
            else:
                course_user = CourseUser()
                course_user.user = current_user
                course_user.course = course.key
                course_user.current_lesson = lesson.key
            course_user.put()
        lesson_user.put()
        return {
            'status': status,
            'msg': msg,
            'data': lesson_user
        }


class SaveLectureUser(BaseHandler):
    @user_required
    @as_json
    def post(self):
        import json
        from api.restful import current_user
        from google.appengine.ext import ndb
        from application.models import LectureUser, LessonUser, Lesson
        msg = ''
        status = 'ok'
        current_user = current_user()
        body_data = json.loads(self.request.body)
        lecture_id = ndb.Key(urlsafe=body_data['lecture_id'])
        lecture_score = body_data['score']
        lecture_user = LectureUser.get_by_user_and_lecture(current_user, lecture_id)
        if lecture_user:
            if lecture_user.score < lecture_score:
                lecture_user.score = lecture_score
        else:
            lecture_user = LectureUser()
            lecture_user.user = current_user
            lecture_user.lecture = lecture_id
            lecture_user.score = lecture_score
        lecture_user.put()
        lesson = Lesson.get_by_lecture(lecture_id)
        lesson_user = LessonUser.get_by_user_and_lesson(current_user, lesson.key)
        sum = 0;
        for lecture in lesson.lecture_keys:
            _lecture_user = LectureUser.get_by_user_and_lecture(current_user, lecture)
            if _lecture_user:
                sum = sum + _lecture_user.score
        lesson_user.score = sum
        lesson_user.put()
        return {
            'status': status,
            'msg': msg,
            'data': lecture_user
        }


class CheckpointMeHandler(BaseHandler):
    @user_required
    @as_json
    def post(self):
        import json
        from application.models import File, ExerciseCheckpointUser, ExerciseItemUser, \
            ExerciseUser, CourseUser, ExerciseProject, ExerciseItem, Exercise, Course
        from api.restful import current_user
        from google.appengine.ext import ndb
        body_data = json.loads(self.request.body)
        _checkpoint_id = body_data.get("checkpoint_id", None)
        _next_item = None
        if _checkpoint_id:
            _status = body_data.get("status", None)
            _file = body_data.get("file", None)
            if _status == "passed":
                _current_user = current_user()
                _checkpoint = ndb.Key(urlsafe=_checkpoint_id).get()
                _exercise_checkpoint_user = ExerciseCheckpointUser.get_by_user_and_checkpoint(_current_user
                                                                                              , _checkpoint.key)
                if not _exercise_checkpoint_user:
                    _exercise_checkpoint_user = ExerciseCheckpointUser()
                    _exercise_checkpoint_user.user = _current_user
                    _exercise_checkpoint_user.checkpoint = _checkpoint.key
                if _file:
                    _file = File(content=_file, filename='script')
                    _file.put()
                    _exercise_checkpoint_user.files.append(_file.key)
                _exercise_checkpoint_user.put()
                _project = ExerciseProject.get_by_checkpoint(_checkpoint.key)
                _item = ExerciseItem.get_by_project(_project.key)
                _exercise = Exercise.get_by_exercise_item(_item.key)
                _course = Course.get_by_exercise(_exercise.key)
                _item_user = ExerciseItemUser.get_by_user_and_exercise_item(_current_user, _item.key)
                if not _item_user:
                    _item_user = ExerciseItemUser()
                    _item_user.user = _current_user
                    _item_user.exercise_item = _item.key
                _item_user.current_checkpoint = _checkpoint.key
                if _checkpoint.key not in _item_user.passed_checkpoint:
                    _item_user.passed_checkpoint.append(_checkpoint.key)
                _item_user.put()
                _exercise_user = ExerciseUser.get_by_user_and_exercise(_current_user,_exercise.key)
                if not _exercise_user:
                    _exercise_user = ExerciseUser()
                    _exercise_user.user = _current_user
                    _exercise_user.exercise = _exercise.key
                _exercise_user.current_item = _item.key
                if _item.checkpoints_count == len(_item_user.passed_checkpoint) and _item.key not in _exercise_user.passed_item:
                    _exercise_user.passed_item.append(_item.key)
                    _next_item = _item.get_next_exercise_item()
                _exercise_user.put()
                _course_user = CourseUser.get_by_user_and_course(_current_user, _course.key)
                if not _course_user:
                    _course_user = CourseUser()
                    _course_user.user = _current_user
                    _course_user.course = _course.key
                _course_user.current_exercise = _exercise.key
                if _exercise.items_count == len(_exercise_user.passed_item) and _exercise.key not in _course_user.passed_exercises:
                    _course_user.passed_exercises.append(_exercise.key)
                    _exercise_user.status = 'passed'
                else:
                    _exercise_user.status = 'working'
                _course_user.put()
        if _next_item:
            return {
                'next_item': _next_item.key
            }
        return {}


class GetTotalScoreCourse(BaseHandler):
    @user_required
    @as_json
    def get(self):
        import json
        from application.models import LessonUser, Lesson, Course
        from api.restful import current_user
        from google.appengine.ext import ndb
        total = 0
        msg = ''
        status = 'ok'
        _current_user = current_user()
        _lecture_Id = ndb.Key(urlsafe=self.request.get('lecture_id'))
        _lesson_id = Lesson.get_by_lecture(_lecture_Id).key
        _course = Course.get_by_lesson(_lesson_id)
        for lid in _course.lesson_keys:
            lesson_user = LessonUser.get_by_user_and_lesson(_current_user, lid)
            total = total + lesson_user.score
        return {
            'msg': msg,
            'data': total,
            'status': status
        }