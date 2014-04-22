from webapp2_extras.appengine.auth.models import User
from google.appengine.ext import ndb


class UtilModel(object):
    def to_dict(self, *args, **kwargs):
        result = super(UtilModel, self).to_dict(*args, **kwargs)
        result['Id'] = self.key.urlsafe()
        result['key'] = self.key.id()
        return result


class User(User):
    """
    Universal user model. Can be used with App Engine's default users API,
    own auth or third party authentication methods (OpenID, OAuth etc).
    based on https://gist.github.com/kylefinley
    """

    #: Creation date.
    created = ndb.DateTimeProperty(auto_now_add=True)
    #: Modification date.
    updated = ndb.DateTimeProperty(auto_now=True)
    #: User defined unique name, also used as key_name.
    # Not used by OpenID
    username = ndb.StringProperty()
    #: User Name
    name = ndb.StringProperty()
    #: User Last Name
    last_name = ndb.StringProperty()
    #: User email
    email = ndb.StringProperty()
    #: Hashed password. Only set for own authentication.
    # Not required because third party authentication
    # doesn't use password.
    password = ndb.StringProperty()
    #: User Country
    country = ndb.StringProperty()
    #: User TimeZone
    tz = ndb.StringProperty()
    #: Account activation verifies email
    activated = ndb.BooleanProperty(default=False)
    #: Is teacher
    is_teacher = ndb.BooleanProperty(default=False)

    @property
    def avatar_url(self):
        import hashlib
        return "https://secure.gravatar.com/avatar/%s?d=mm" % (hashlib.md5(self.email).hexdigest())

    def to_dict(self, *args, **kwargs):
        from api.restful import current_user, _config, re_private
        from api.util import is_request_from_admin
        import webapp2
        import json

        result = super(User, self).to_dict(*args, **kwargs)
        u = current_user()
        if u and u.urlsafe() == self.key.urlsafe():
            result['_has_password'] = True if self.password else False
            r = webapp2.get_request()
            extras_request = r.GET.getall("extras")
            if 'providers_info' in extras_request:
                providers_info = self.get_social_providers_info()
                result['used_providers'] = providers_info['used']
                result['unused_providers'] = providers_info['unused']
            del result['password']
            _is_request_from_admin = is_request_from_admin()
            if not _is_request_from_admin:
                _course_user = CourseUser.get_by_user(self.key)
                if _course_user and 'current_courses' in extras_request:
                    result['_current_courses'] = [c.to_dict() for c in _course_user]
            admin = _config.is_current_user_admin()
            if admin:
                result["$admin"] = admin
        else:
            for k in result.keys():
                if re_private.match(k):
                    del result[k]
        result["Id"] = self.key.urlsafe()
        return result
        if self.is_teacher:
            result['$teacher'] = True
        del result['is_teacher']

    @classmethod
    def get_by_email(cls, email):
        """Returns a user object based on an email.

        :param email:
            String representing the user email. Examples:

        :returns:
            A user object.
        """
        return cls.query(cls.email == email).get()

    @classmethod
    def create_resend_token(cls, user_id):
        entity = cls.token_model.create(user_id, 'resend-activation-mail')
        return entity.token

    @classmethod
    def get_current_user(cls):
        from webapp2_extras import auth

        return auth.get_auth().get_user_by_session()

    @classmethod
    def validate_resend_token(cls, user_id, token):
        return cls.validate_token(user_id, 'resend-activation-mail', token)

    @classmethod
    def delete_resend_token(cls, user_id, token):
        cls.token_model.get_key(user_id, 'resend-activation-mail', token).delete()

    def get_social_providers_names(self):
        social_user_objects = SocialUser.get_by_user(self.key)
        result = []
        #        import logging
        for social_user_object in social_user_objects:
            #            logging.error(social_user_object.extra_data['screen_name'])
            result.append(social_user_object.provider)
        return result

    def get_social_providers_info(self):
        providers = self.get_social_providers_names()
        result = {'used': [], 'unused': []}
        for k, v in SocialUser.PROVIDERS_INFO.items():
            if k in providers:
                result['used'].append(v)
            else:
                result['unused'].append(v)
        return result

    def get_badges(self):
        badges = BadgeUser.get_by_user(self.key)
        result = []
        for badge in badges:
            result.append(badge.badge.get().to_dict().update({'earnday': badge.created}))
        return result


class LogVisit(UtilModel, ndb.Model):
    user = ndb.KeyProperty(kind=User)
    uastring = ndb.StringProperty()
    ip = ndb.StringProperty()
    timestamp = ndb.StringProperty()


class LogEmail(UtilModel, ndb.Model):
    sender = ndb.StringProperty(
        required=True)
    to = ndb.StringProperty(
        required=True)
    subject = ndb.StringProperty(
        required=True)
    body = ndb.TextProperty()
    when = ndb.DateTimeProperty()


class SocialUser(UtilModel, ndb.Model):
    PROVIDERS_INFO = {  # uri is for OpenID only (not OAuth)
                        'google': {'name': 'google', 'label': 'Google', 'uri': 'gmail.com'},
                        'github': {'name': 'github', 'label': 'Github', 'uri': ''},
                        'facebook': {'name': 'facebook', 'label': 'Facebook', 'uri': ''},
                        'linkedin': {'name': 'linkedin', 'label': 'LinkedIn', 'uri': ''},
                        'myopenid': {'name': 'myopenid', 'label': 'MyOpenid', 'uri': 'myopenid.com'},
                        'twitter': {'name': 'twitter', 'label': 'Twitter', 'uri': ''},
                        'yahoo': {'name': 'yahoo', 'label': 'Yahoo!', 'uri': 'yahoo.com'},
    }

    user = ndb.KeyProperty(kind=User)
    provider = ndb.StringProperty()
    uid = ndb.StringProperty()
    extra_data = ndb.JsonProperty()

    @classmethod
    def get_by_user(cls, user):
        return cls.query(cls.user == user).fetch()

    @classmethod
    def get_by_user_and_provider(cls, user, provider):
        return cls.query(cls.user == user, cls.provider == provider).get()

    @classmethod
    def get_by_provider_and_uid(cls, provider, uid):
        return cls.query(cls.provider == provider, cls.uid == uid).get()

    @classmethod
    def check_unique_uid(cls, provider, uid):
        # pair (provider, uid) should be unique
        test_unique_provider = cls.get_by_provider_and_uid(provider, uid)
        if test_unique_provider is not None:
            return False
        else:
            return True

    @classmethod
    def check_unique_user(cls, provider, user):
        # pair (user, provider) should be unique
        test_unique_user = cls.get_by_user_and_provider(user, provider)
        if test_unique_user is not None:
            return False
        else:
            return True

    @classmethod
    def check_unique(cls, user, provider, uid):
        # pair (provider, uid) should be unique and pair (user, provider) should be unique
        return cls.check_unique_uid(provider, uid) and cls.check_unique_user(provider, user)

    @staticmethod
    def open_id_providers():
        return [k for k, v in SocialUser.PROVIDERS_INFO.items() if v['uri']]


class ExerciseCheckpoint(UtilModel, ndb.Model):
    entry = ndb.StringProperty(required=True, indexed=False)
    hint = ndb.StringProperty(indexed=False)
    instruction = ndb.StringProperty(required=True, indexed=False)
    title = ndb.StringProperty()
    test_functions = ndb.TextProperty()
    index = ndb.FloatProperty()
    created = ndb.DateTimeProperty(auto_now_add=True)
    default_files = ndb.KeyProperty(kind="File", repeated=True)

    @property
    def entry_html(self):
        import markdown2
        return markdown2.markdown(self.entry)

    @property
    def hint_html(self):
        import markdown2
        return markdown2.markdown(self.hint)

    @property
    def instruction_html(self):
        import markdown2
        return markdown2.markdown(self.instruction)

    def to_dict(self, *args, **kwargs):
        from api.restful import current_user
        from api.util import is_request_from_admin
        result = super(ExerciseCheckpoint, self).to_dict(*args, **kwargs)
        result['_entry_html'] = self.entry_html
        result['_hint_html'] = self.hint_html
        result['_instruction_html'] = self.instruction_html
        _current_user = current_user()
        _is_request_from_admin = is_request_from_admin()
        if _current_user and not _is_request_from_admin:
            _exercise_item = ExerciseItem.get_by_checkpoint(self.key).key
            _exercise_item_user = ExerciseItemUser.get_by_user_and_exercise_item(_current_user, _exercise_item)
            if _exercise_item_user:
                result['_is_current_checkpoint'] = True if _exercise_item_user.current_checkpoint == self.key else False
                result['_is_passed_checkpoint'] = True if self.key in _exercise_item_user.passed_checkpoint else False
            else:
                result["_is_current_checkpoint"] = False
                result["_is_passed_checkpoint"] = False
        #TODO: Lastest files
        return result


class ExerciseProject(UtilModel, ndb.Model):
    title = ndb.StringProperty()
    checkpoints = ndb.KeyProperty(kind="ExerciseCheckpoint", repeated=True)
    index = ndb.FloatProperty()
    created = ndb.DateTimeProperty(auto_now_add=True)
    language = ndb.StringProperty()

    @property
    def checkpoints_count(self):
        return len(self.checkpoints)

    @classmethod
    def get_by_checkpoint(cls, checkpoint):
        return cls.query(cls.checkpoints == checkpoint).get()

    def to_dict(self, *args, **kwargs):
        result = super(ExerciseProject, self).to_dict(*args, **kwargs)
        from api.util import is_request_from_admin
        from api.restful import current_user
        _current_user = current_user()
        _is_request_from_admin = is_request_from_admin()
        if _current_user and not _is_request_from_admin:
            _exercise_item = ExerciseItem.get_by_project(self.key).key
            _exercise_item_user = ExerciseItemUser.get_by_user_and_exercise_item(_current_user,_exercise_item)
            if _exercise_item_user:
                result['_is_passed_project'] = True if set(self.checkpoints).issubset(set(_exercise_item_user.passed_checkpoint)) else False
        result['_checkpoints_count'] = self.checkpoints_count
        return result


class ExerciseItem(UtilModel, ndb.Model):
    title = ndb.StringProperty()
    created = ndb.DateTimeProperty(auto_now_add=True)
    index = ndb.FloatProperty()
    description = ndb.TextProperty()
    projects = ndb.KeyProperty(kind='ExerciseProject', repeated=True)
    success = ndb.StringProperty(indexed=False)

    @property
    def success_html(self):
        import markdown2
        return markdown2.markdown(self.success)

    @property
    def projects_count(self):
        return len(self.projects)

    @property
    def checkpoints_count(self):
        return sum([project.checkpoints_count for project in ndb.get_multi(self.projects)])

    def get_next_exercise_item(self):
        _exercise = Exercise.get_by_exercise_item(self.key)
        _next = [item for item in ndb.get_multi(_exercise.items) if item.index == self.index+1]
        if _next:
            return _next[0]
        else:
            _next_exercise = _exercise.get_next_exercise()
            if _next_exercise:
                _first_next_exercise_item = _next_exercise.get_first_exercise_item()
                if _first_next_exercise_item:
                    return _first_next_exercise_item
        return {'Id': 'Finish'}

    @classmethod
    def get_by_project(cls, project):
        return cls.query(cls.projects == project).get()

    @classmethod
    def get_by_checkpoint(cls, checkpoint):
        _project = ExerciseProject.get_by_checkpoint(checkpoint)
        return cls.get_by_project(_project.key)

    def to_dict(self, *args, **kwargs):
        result = super(ExerciseItem, self).to_dict(*args, **kwargs)
        from api.restful import current_user
        from api.util import is_request_from_admin
        _current_user = current_user()
        _is_request_from_admin = is_request_from_admin()
        if _current_user and not _is_request_from_admin :
            _exercise = Exercise.get_by_exercise_item(self.key).key
            _exercise_user = ExerciseUser.get_by_user_and_exercise(_current_user, _exercise)
            if _exercise_user:
                result['_is_current_item'] = True if _exercise_user.current_item == self.key else False
                result['_is_passed_item'] = True if self.key in _exercise_user.passed_item else False
            else:
                result['_is_current_item'] = False
                result['_is_passed_item'] = False
        result['_success_html'] = self.success_html
        result['_checkpoints_count'] = self.checkpoints_count
        result['_projects_count'] = self.projects_count
        return result


class Exercise(UtilModel, ndb.Model):
    author = ndb.KeyProperty(kind="User")
    title = ndb.StringProperty()
    description = ndb.TextProperty()
    index = ndb.FloatProperty()
    created = ndb.DateTimeProperty(auto_now_add=True)
    items = ndb.KeyProperty(kind='ExerciseItem', repeated=True)

    @property
    def items_count(self):
        return len(self.items)

    @property
    def projects_count(self):
        return sum([item.projects_count for item in ndb.get_multi(self.items)])

    @property
    def checkpoints_count(self):
        return sum([item.checkpoints_count for item in ndb.get_multi(self.items)])

    @classmethod
    def get_by_exercise_item(cls, exercise_item):
        return cls.query(cls.items == exercise_item).get()

    def get_next_exercise(self):
        _course = Course.get_by_exercise(self.key)
        _next = [item for item in ndb.get_multi(_course.exercise_keys) if item.index == self.index+1]
        return _next[0] if _next else None

    def get_first_exercise_item(self):
        _first = [item for item in ndb.get_multi(self.items) if item.index == 0]
        return _first[0] if _first else None



LEVELS = ('Beginning', 'Intermediate', 'Advanced', 'Other')


class Course(UtilModel, ndb.Model):
    created = ndb.DateTimeProperty(auto_now_add=True)
    updated = ndb.DateTimeProperty(auto_now=True)
    title = ndb.StringProperty(required=True)
    img = ndb.BlobKeyProperty()
    exercise_keys = ndb.KeyProperty(kind='Exercise', repeated=True)
    lesson_keys = ndb.KeyProperty('Lesson', repeated=True)
    author = ndb.KeyProperty(User)
    level = ndb.StringProperty(choices=LEVELS, required=True, default='Beginning')
    short_desc = ndb.StringProperty(required=True)
    long_desc = ndb.TextProperty(required=True)
    tags = ndb.StringProperty(repeated=True)
    is_available = ndb.BooleanProperty(default=False)
    is_new = ndb.BooleanProperty(default=True)

    @classmethod
    def get_by_exercise(cls, exercise):
        return cls.query(cls.exercise_keys==exercise).get()
    
    @classmethod
    def get_by_lesson(cls, lesson):
        return cls.query(cls.lesson_keys == lesson).get()


class WeeklyQuizTest(UtilModel, ndb.Model):
    input = ndb.StringProperty()
    output = ndb.StringProperty()


class WeeklyQuizLevel(UtilModel, ndb.Model):
    level = ndb.FloatProperty()
    description = ndb.StringProperty(indexed=False)
    limit_memory = ndb.FloatProperty(default=100)
    limit_time = ndb.FloatProperty(default=60)
    test_case = ndb.StructuredProperty(WeeklyQuizTest, repeated=True)
    score = ndb.FloatProperty()

    @property
    def description_html(self):
        import markdown2
        return markdown2.markdown(self.description)

    def to_dict(self, *args, **kwargs):
        result = super(WeeklyQuizLevel, self).to_dict(*args, **kwargs)
        result['description_html'] = self.description_html
        from api.restful import current_user
        from api.util import is_request_from_admin
        _current_user = current_user()
        if _current_user and not is_request_from_admin():
            weekly_quiz = WeeklyQuiz.query(WeeklyQuiz.level_keys == self.key).get().key
            weekly_quiz_current_user = WeeklyQuizUser.get_by_user_and_weekly_quiz(_current_user, weekly_quiz)
            if weekly_quiz_current_user:
                result['is_current_level'] = True if weekly_quiz_current_user.current_level == self.key else False
                result['is_passed_level'] = True if self.key in weekly_quiz_current_user.passed_level else False
            else:
                #TODO: Need better way if it smallest
                result['is_current_level'] = True if self.level == 1 else False
                result['is_passed_level'] = False
        return result


class WeeklyQuiz(UtilModel, ndb.Model):
    week = ndb.FloatProperty()
    start_date = ndb.DateProperty()
    created = ndb.DateTimeProperty(auto_now_add=True)
    level_keys = ndb.KeyProperty(WeeklyQuizLevel, repeated=True)


    @classmethod
    def get_current_week_contest(cls):
        from datetime import datetime, timedelta

        first_day_current_week = (datetime.now() + timedelta(0 - datetime.now().weekday())).date()
        last_day_current_week = (datetime.now() + timedelta(6 - datetime.now().weekday())).date()
        result = cls.query(cls.start_date >= first_day_current_week, cls.start_date <= last_day_current_week).get()
        return result

    def get_next_level(self, level):
        level_keys = sorted(ndb.get_multi(self.level_keys), key=lambda x: x.level)
        _index = [_level.key for _level in level_keys].index(level)
        if _index == len(level_keys) - 1:
            return level
        else:
            return level_keys[_index+1].key

    def to_dict(self, *args, **kwargs):
        result = super(WeeklyQuiz, self).to_dict(*args, **kwargs)
        result['top_player'] = WeeklyQuizUser.get_top_player_by_weekly_quiz(self.key)
        return result


class WeeklyQuizRunCodeResult(UtilModel, ndb.Model):
    level = ndb.KeyProperty(kind='WeeklyQuizLevel')
    user = ndb.KeyProperty(kind='User')
    created = ndb.DateTimeProperty(auto_now_add=True)
    result = ndb.BooleanProperty()
    time_used = ndb.FloatProperty()
    memory_used = ndb.FloatProperty()
    language = ndb.StringProperty(choices=('PYTHON', 'JAVA', 'CPP'))
    code = ndb.KeyProperty(kind='File')
    score = ndb.FloatProperty()

    @classmethod
    def get_by_user(cls, user):
        return cls.query(cls.user == user).fetch()

    @classmethod
    def get_by_user_and_level(cls, user, level):
        return cls.query(cls.user == user, cls.level == level).fetch()

    @classmethod
    def get_best_score_by_user_and_level(cls, user, level):
        return cls.query(cls.user == user, cls.level == level).order(-cls.score).get()

    @classmethod
    def get_top_user_by_level(cls, level, quantity=5):
        _lst_score = cls.query(cls.level == level).query()
        return dict((x.user, x) for x in sorted(_lst_score, key=lambda x: x.score)).values()[quantity]


class Lesson(UtilModel, ndb.Model):
    author = ndb.UserProperty()
    title = ndb.StringProperty()
    description = ndb.StringProperty()
    index = ndb.FloatProperty()
    language = ndb.StringProperty()
    created = ndb.DateTimeProperty(auto_now_add=True)
    lecture_keys = ndb.KeyProperty('Lecture', repeated=True)

    @property
    def lecture_count(self):
        return len(self.lecture_keys)
    
    @classmethod
    def get_by_lecture(cls, lecture):
        return cls.query(cls.lecture_keys == lecture).get()


class Lecture(UtilModel, ndb.Model):
    title = ndb.StringProperty(required=True)
    description = ndb.StringProperty()
    img = ndb.BlobKeyProperty()
    youtube_id = ndb.StringProperty()
    time = ndb.FloatProperty()
    index = ndb.FloatProperty()
    created = ndb.DateTimeProperty(auto_now_add=True)
    quiz_keys = ndb.KeyProperty('Quiz', repeated=True)
    test_keys = ndb.KeyProperty('Test', repeated=True)
    code_keys = ndb.KeyProperty('Code', repeated=True)
    level = ndb.FloatProperty()

    def to_dict(self, *args, **kwargs):
        result = super(Lecture, self).to_dict(*args, **kwargs)
        from api.restful import current_user
        _current_user = current_user()
        _lesson_user = False
        if _current_user:
            _lesson = Lesson.get_by_lecture(self.key)
            if _lesson:
                _lesson_user = LessonUser.get_by_user_and_lesson(_current_user, _lesson.key)
            if (_lesson_user):
                result['_is_current_lecture'] = True if _lesson_user.current_lecture == self.key else False
                result['_is_passed_lecture'] = True if self.key in _lesson_user.passed_lecture else False
            else:
                result['_is_current_lecture'] = False
                result['_is_passed_lecture'] = False
        else:
            result['_is_current_lecture'] = False
            result['_is_passed_lecture'] = False
        rates = Rate.get_by_lecture(self.key)
        rate = (sum(r.rate for r in rates))/(len(rates) or 1)
        result['rate'] = rate
        return result


class Rate(UtilModel, ndb.Model):
    user_key = ndb.KeyProperty('User', repeated=False)
    lecture_key = ndb.KeyProperty('Lecture', repeated=False)
    rate = ndb.FloatProperty()

    @classmethod
    def get_by_lecture(cls, lecture):
        return cls.query(cls.lecture_key == lecture).fetch()


class Code(UtilModel, ndb.Model):
    title = ndb.StringProperty()
    index = ndb.FloatProperty()
    description = ndb.StringProperty(indexed=False)
    content = ndb.StringProperty(indexed=False)
    time = ndb.FloatProperty()
    created = ndb.DateTimeProperty(auto_now_add=True)


class QuizAnswer(UtilModel, ndb.Model):
    title = ndb.StringProperty()
    is_true = ndb.BooleanProperty()


class Quiz(UtilModel, ndb.Model):
    title = ndb.StringProperty()
    question = ndb.StringProperty()
    answer_keys = ndb.KeyProperty('QuizAnswer', repeated=True)
    time = ndb.FloatProperty()
    created = ndb.DateTimeProperty(auto_now_add=True)
    score = ndb.FloatProperty()


class Test(UtilModel, ndb.Model):
    title = ndb.StringProperty()
    description = ndb.StringProperty(indexed=False)
    test_script = ndb.StringProperty(indexed=False)
    time = ndb.FloatProperty()
    created = ndb.DateTimeProperty(auto_now_add=True)
    score = ndb.FloatProperty()


class Badge(UtilModel, ndb.Model):
    icon = ndb.BlobKeyProperty()
    title = ndb.StringProperty()
    description = ndb.StringProperty()
    created = ndb.DateTimeProperty(auto_now_add=True)


class BadgeUser(UtilModel, ndb.Model):
    user = ndb.KeyProperty(kind="User")
    badge = ndb.KeyProperty(kind="Badge")
    earning_day = ndb.DateProperty(auto_now_add=True)

    @classmethod
    def get_by_user(cls, user):
        return cls.query(cls.user == user).fetch()


class File(UtilModel, ndb.Model):
    created = ndb.DateTimeProperty(auto_now_add=True)
    filename = ndb.StringProperty()
    content = ndb.StringProperty(indexed=False)


class CourseUser(UtilModel, ndb.Model):
    created = ndb.DateTimeProperty(auto_now_add=True)
    updated = ndb.DateTimeProperty(auto_now=True)
    user = ndb.KeyProperty(kind="User")
    course = ndb.KeyProperty(kind='Course')
    current_lesson = ndb.KeyProperty(Lesson)
    current_exercise = ndb.KeyProperty(Exercise)
    passed_lessons = ndb.KeyProperty(Lesson, repeated=True)
    passed_exercises = ndb.KeyProperty(Exercise, repeated=True)

    @property
    def percent_passed_exercise(self):
        _percent = 0
        _lst_exercise = self.course.get().exercise_keys
        if not _lst_exercise:
            return 0
        for exercise in _lst_exercise:
            _exercise_user = ExerciseUser.get_by_user_and_exercise(self.user, exercise)
            if _exercise_user:
                _percent += _exercise_user.percent_passed
        return float(_percent)/len(_lst_exercise)

    @property
    def percent_passed_lesson(self):
        _percent = 0
        _lst_lesson = self.course.get().lesson_keys
        if not _lst_lesson:
            return 0
        for lesson in _lst_lesson:
            _lesson_user = LessonUser.get_by_user_and_lesson(self.user, lesson)
            if _lesson_user:
                _percent += _lesson_user.percent_passed
        return float(_percent)/len(_lst_lesson)

    @classmethod
    def get_by_user(cls, user):
        return cls.query(cls.user == user).fetch()

    @classmethod
    def get_by_user_and_course(cls, user, course):
        return cls.query(cls.user == user, cls.course == course).get()

    def to_dict(self, *args, **kwargs):
        result = super(CourseUser, self).to_dict(*args, **kwargs)
        result['_percent_passed_exercise'] = self.percent_passed_exercise
        result['_percent_passed_lesson'] = self.percent_passed_lesson
        return result


class LessonUser(UtilModel, ndb.Model):
    user = ndb.KeyProperty(kind="User")
    lesson = ndb.KeyProperty(kind="Lesson")
    join_date = ndb.DateProperty(auto_now_add=True)
    updated = ndb.DateTimeProperty(auto_now=True)
    status = ndb.StringProperty(choices=('passed', 'learning'))
    current_lecture = ndb.KeyProperty(kind="Lecture")
    passed_lecture = ndb.KeyProperty(kind="Lecture", repeated=True)
    score = ndb.FloatProperty(default=0)

    @property
    def percent_passed(self):
        return float(len(self.passed_lecture))/self.lesson.get().lecture_count

    @classmethod
    def get_by_user(cls, user):
        return cls.query(cls.user == user).fetch()

    @classmethod
    def get_by_user_and_lesson(cls, user, lesson):
        return cls.query(cls.user == user, cls.lesson == lesson).get()


class LectureUser(UtilModel, ndb.Model):
    score = ndb.FloatProperty()
    lecture = ndb.KeyProperty(kind='Lecture')
    user = ndb.KeyProperty(kind='User')

    @classmethod
    def get_by_user(cls, user):
        return cls.query(cls.user == user).fetch()

    @classmethod
    def get_by_lecture(cls, lecture):
        return cls.query(cls.lecture == lecture).fetch()

    @classmethod
    def get_by_user_and_lecture(cls, user, lecture):
        return cls.query(cls.user == user, cls.lecture == lecture).get()


class ExerciseUser(UtilModel, ndb.Model):
    user = ndb.KeyProperty(kind="User")
    exercise = ndb.KeyProperty(kind="Exercise")
    join_date = ndb.DateProperty(auto_now_add=True)
    updated = ndb.DateTimeProperty(auto_now=True)
    status = ndb.StringProperty(choices=('passed', 'working', 'cancel'))
    current_item = ndb.KeyProperty(kind='ExerciseItem')
    passed_item = ndb.KeyProperty(kind="ExerciseItem", repeated=True)

    @property
    def percent_passed(self):
        _lst_item = self.exercise.get().items
        _percent = 0
        for item in _lst_item:
            _exercise_item_user = ExerciseItemUser.get_by_user_and_exercise_item(self.user, item)
            if _exercise_item_user:
                _percent += _exercise_item_user.percent_passed
        return _percent/len(_lst_item)

    @classmethod
    def get_by_user(cls, user):
        return cls.query(cls.user == user).fetch()

    @classmethod
    def get_by_user_and_exercise(cls, user, exercise):
        return cls.query(cls.user == user, cls.exercise == exercise).get()


class ExerciseItemUser(UtilModel, ndb.Model):
    user = ndb.KeyProperty(kind='User')
    exercise_item = ndb.KeyProperty(kind='ExerciseItem')
    join_date = ndb.DateProperty(auto_now_add=True)
    updated = ndb.DateTimeProperty(auto_now=True)
    current_checkpoint = ndb.KeyProperty(kind='ExerciseCheckpoint')
    passed_checkpoint = ndb.KeyProperty(kind='ExerciseCheckpoint', repeated=True)

    @property
    def percent_passed(self):
        return float(len(self.passed_checkpoint))/self.exercise_item.get().checkpoints_count

    @classmethod
    def get_by_user(cls, user):
        return cls.query(cls.user == user).fetch()

    @classmethod
    def get_by_user_and_exercise_item(cls, user, exercise_item):
        return cls.query(cls.user == user, cls.exercise_item == exercise_item).get()


class ExerciseCheckpointUser(UtilModel, ndb.Model):
    user = ndb.KeyProperty(kind='User')
    checkpoint = ndb.KeyProperty(kind='ExerciseCheckpoint')
    created = ndb.DateTimeProperty(auto_now_add=True)
    updated = ndb.DateTimeProperty(auto_now=True)
    files = ndb.KeyProperty(kind='File', repeated=True)

    @classmethod
    def get_by_user(cls, user):
        return cls.query(cls.user == user).fetch()

    @classmethod
    def get_by_user_and_checkpoint(cls, user, checkpoint):
        return cls.query(cls.user == user, cls.checkpoint == checkpoint).get()


class WeeklyQuizUser(UtilModel, ndb.Model):
    user = ndb.KeyProperty(kind='User')
    weekly_quiz = ndb.KeyProperty(kind='WeeklyQuiz')
    created = ndb.DateTimeProperty(auto_now_add=True)
    current_level = ndb.KeyProperty(kind='WeeklyQuizLevel')
    passed_level = ndb.KeyProperty(kind='WeeklyQuizLevel', repeated=True)
    rank = ndb.FloatProperty()
    score = ndb.FloatProperty()
    run_code_result = ndb.KeyProperty(kind='WeeklyQuizRunCodeResult', repeated=True)

    @classmethod
    def get_by_user(cls, user):
        return cls.query(cls.user == user).fetch()

    @classmethod
    def get_by_user_and_weekly_quiz(cls, user, weekly_quiz):
        return cls.query(cls.user == user, cls.weekly_quiz == weekly_quiz).get()

    @classmethod
    def create_new_by_user(cls, user):
        weekly_quiz = WeeklyQuiz.get_current_week_contest()
        weekly_week_current_user = WeeklyQuizUser()
        weekly_week_current_user.user = user
        weekly_week_current_user.weekly_quiz = weekly_quiz.key
        weekly_week_current_user.current_level = sorted(
            ndb.get_multi(weekly_quiz.level_keys), key=lambda x: x.level)[0].key
        weekly_week_current_user.rank = 0
        weekly_week_current_user.score = 0
        weekly_week_current_user.put()
        return weekly_week_current_user

    @classmethod
    def get_top_player_by_weekly_quiz(cls, weekly_quiz):
        return [
            {'user': obj.user, 'score': obj.score} for obj in cls.query(
                cls.weekly_quiz == weekly_quiz, cls.score > 0).order(-cls.score).fetch()
        ]

    def to_dict(self, *args, **kwargs):
        result = super(WeeklyQuizUser, self).to_dict(*args, **kwargs)
        from api.restful import current_user
        _current_user = current_user()
        if _current_user != self.user:
            del result['current_level']
            del result['passed_level']
        return result