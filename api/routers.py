__author__ = 'nampnq'

from webapp2_extras.routes import RedirectRoute

import handlers
import restful
import files

PREFIX = "/api/"

_routes = [
    RedirectRoute('/api/users/me/checkpoints', handlers.CheckpointMeHandler, name='checkpoint-submit',
                  strict_slash=True),
    RedirectRoute('/api/runcode', handlers.RunCodeInHackerEarthHandle, name='run-code-in-hackerearth',
                  strict_slash=True),
    RedirectRoute('/api/contest', handlers.GetWeekContestHandler, name='get-thisweek-contest',
                  strict_slash=True),
    RedirectRoute('/api/contest/info', handlers.GetWeekContestInfoOfUserHandler, name='get-thisweek-contest',
                  strict_slash=True),
    RedirectRoute('/api/contest/submit', handlers.SubmitContestHandler, name='submit-contest', strict_slash=True),
    RedirectRoute('/api/users/me/learn/change_mode', handlers.UserChangeLearnMode, name='change-learn-mode', strict_slash=True),
    RedirectRoute('/api/users/me/passedLecture', handlers.SavePassedLecture, name='passed-lecture', strict_slash=True),
    RedirectRoute('/api/users/me/saveLectureUser', handlers.SaveLectureUser, name='lecture-user', strict_slash=True),
    RedirectRoute('/api/users/me/getTotalScoreCourse', handlers.GetTotalScoreCourse, name='get-total-score-course', strict_slash=True),
    RedirectRoute('/api/users/me/currentLecture', handlers.SaveCurrentLecture, name='passed-lecture', strict_slash=True),
    RedirectRoute('/api/courses/<course_id>/exercises', handlers.ExerciseInfo, name='passed-lecture', strict_slash=True),
    RedirectRoute('/api/files/<model>/<id>/<property>', handler=files.FileHandler, name='blog-upload-download', strict_slash=True),
    RedirectRoute(r"{}<model:[^/]+><:/?><id:(.*)>".format(PREFIX), handler=restful.RestfulHandler),
]


def get_routes():
    return _routes


def add_routes(app):
    for r in _routes:
        app.router.add(r)