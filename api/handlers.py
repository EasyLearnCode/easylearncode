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
                        test_result['memory_used'] for test_result in test_results) /\
                        len(test_results)
                    result = all([test_result['result'] for test_result in test_results])
                    score = weekly_quiz_level.score
                    if not result or avg_memory > weekly_quiz_level.limit_memory \
                            or avg_time > weekly_quiz_level.limit_time:
                        score = 0
                    else:
                        score -= (avg_time*10 + avg_memory / 100)
                    code_file = File()
                    code_file.content = code
                    code_file.filename = 'script'
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
                    weekly_quiz_user = WeeklyQuizUser.get_by_user_and_weekly_quiz(user=user, weekly_quiz=weekly_quiz.key)
                    weekly_quiz_user.run_code_result.append(run_code_result.key)
                    if result:
                        weekly_quiz_user.passed_level.append(weekly_quiz_level.key)
                        weekly_quiz_user.current_level = weekly_quiz.get_next_level(weekly_quiz_level.key)
                    else:
                        weekly_quiz_user.current_level = weekly_quiz_level.key
                    weekly_quiz_user.score = sum(
                        getattr(WeeklyQuizRunCodeResult.get_best_score_by_user_and_level(
                            user=user,
                            level=level), 'score', 0) for level in weekly_quiz.level_keys)
                    weekly_quiz_user.put()
                    #TODO: Recalc rank of all user
                    channel.send_message(str(user.id()), json.dumps(dict(
                        {
                            'type': 'submit_sumary_result',
                            'result': result,
                            'time_used': avg_time,
                            'memory_used': avg_memory
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


class GetWeekContestInfoOfMeHandler(BaseHandler):
    @user_required
    @as_json
    def get(self):
        from application.models import WeeklyQuiz

        result_data = {}
        msg = ''
        status = 'ok'
        weekly_quiz_id = self.request.get('Id', None)
        if weekly_quiz_id:
            from google.appengine.ext import ndb
            weekly_quiz = ndb.Key(urlsafe=weekly_quiz_id).get()
        else:
            weekly_quiz = WeeklyQuiz.get_current_week_contest()
        result_data = {}
        msg = ''
        if weekly_quiz:
            from application.models import WeeklyQuizUser
            weekly_week_current_user = WeeklyQuizUser.get_by_user_and_weekly_quiz(self.user_key, weekly_quiz.key)
            if not weekly_week_current_user:
                result_data = WeeklyQuizUser.create_new_by_user(user=self.user_key).to_dict()
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
