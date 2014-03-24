from webapp2_extras.appengine.auth.models import User
from google.appengine.ext import ndb


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


class LogVisit(ndb.Model):
    user = ndb.KeyProperty(kind=User)
    uastring = ndb.StringProperty()
    ip = ndb.StringProperty()
    timestamp = ndb.StringProperty()


class LogEmail(ndb.Model):
    sender = ndb.StringProperty(
        required=True)
    to = ndb.StringProperty(
        required=True)
    subject = ndb.StringProperty(
        required=True)
    body = ndb.TextProperty()
    when = ndb.DateTimeProperty()


class SocialUser(ndb.Model):
    PROVIDERS_INFO = {# uri is for OpenID only (not OAuth)
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


class ExerciseCheckpoint(ndb.Model):
    entry = ndb.StringProperty()
    entry_html = ndb.StringProperty()
    hint = ndb.StringProperty()
    hint_html = ndb.StringProperty()
    instruction = ndb.StringProperty()
    instruction_html = ndb.StringProperty()
    title = ndb.StringProperty()
    test_functions = ndb.StringProperty()
    index = ndb.FloatProperty()
    created = ndb.DateTimeProperty(auto_now_add=True)


class ExerciseProject(ndb.Model):
    title = ndb.StringProperty()
    checkpoints = ndb.StructuredProperty(ExerciseCheckpoint)
    index = ndb.FloatProperty()
    created = ndb.DateTimeProperty(auto_now_add=True)


class Exercise(ndb.Model):
    author = ndb.UserProperty()
    title = ndb.StringProperty()
    description = ndb.StringProperty()
    index = ndb.FloatProperty()
    created = ndb.DateTimeProperty(auto_now_add=True)


class Course(ndb.Model):
    created = ndb.DateTimeProperty(auto_now_add=True)
    updated = ndb.DateTimeProperty(auto_now=True)
    title = ndb.StringProperty()
    img = ndb.BlobKeyProperty()
    description = ndb.StringProperty(indexed=False)
    exercise_keys = ndb.KeyProperty(Exercise, repeated=True)
    lesson_keys = ndb.KeyProperty('Lesson', repeated=True)
    user_keys = ndb.KeyProperty(User, repeated=True)


class WeeklyQuizTest(ndb.Model):
    input = ndb.StringProperty()
    output = ndb.StringProperty()


class WeeklyQuizLevel(ndb.Model):
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


class RankWeeklyQuiz(ndb.Model):
    rank = ndb.FloatProperty()
    user_key = ndb.KeyProperty(User)


class WeeklyQuiz(ndb.Model):
    week = ndb.FloatProperty()
    start_date = ndb.DateProperty()
    publish_date = ndb.DateTimeProperty(auto_now_add=True)
    level_keys = ndb.KeyProperty(WeeklyQuizLevel, repeated=True)
    rank = ndb.StructuredProperty(RankWeeklyQuiz, repeated=True)


    def get_rank_user(self, user_key):
        rank = 0
        for i in self.rank:
            if i.user_key == user_key:
                rank = i.rank
        return rank

    @classmethod
    def get_this_week_contest(cls):
        from datetime import datetime, timedelta

        test = cls.query(cls.start_date >= (datetime.now() + timedelta(0 - datetime.now().weekday())).date(),
                         cls.start_date <= (datetime.now() + timedelta(
                             6 - datetime.now().weekday())).date()).get()
        return test

    def get_this_contest_level(self, user_key):
        result = WeeklyQuizResult.query(WeeklyQuizResult.user_key == user_key,
                                        WeeklyQuizResult.test_key == self.key, WeeklyQuizResult.result == True).get()
        if result:
            maxLevel = filter(lambda x: x.level == result.level_key.get().level + 1,
                              [level_key.get() for level_key in self.level_keys])
            print maxLevel
            if maxLevel:
                return maxLevel
            else:
                return filter(lambda x: x.level == result.level_key.get().level,
                              [level_key.get() for level_key in self.level_keys])
        else:
            return filter(lambda x: int(x.level or 1) == 1, [level_key.get() for level_key in self.level_keys])

    def get_players(self):
        top_player = WeeklyQuizResult.query(WeeklyQuizResult.test_key == self.key) \
            .order() \
            .fetch()
        top = []
        for player in top_player:
            username = player.user_key.get().email
            player = player.to_dict()
            player.update({'submit_time': str(player['submit_time'])})
            player.pop('test_key', None)
            player.pop('user_key', None)
            player.pop('level_key', None)
            player.pop('rank', None)
            player.update({'username': username})
            top.append(player)
        top_player = top
        return top_player


    @classmethod
    def get_quizs_last(cls):
        results = cls.query().fetch()
        quizs = []
        for result in results:
            quizs.append({'test_key': result.key.urlsafe(), 'week': result.week})
        return sorted(quizs, key=lambda k: k['week'], reverse=True)[:5]

    @classmethod
    def get_week_in_month(cls, month, year):
        results = cls.query(cls.start_date.mouth == month, cls.start_date.year == year).fetch()
        quizs = []
        for result in results:
            quizs.append({'test_key': result.key.urlsafe(), 'week': result.week})
        return sorted(quizs, key=lambda k: k['week'], reverse=True)


class WeeklyQuizResult(ndb.Model):
    test_key = ndb.KeyProperty(WeeklyQuiz)
    level_key = ndb.KeyProperty(WeeklyQuizLevel)
    user_key = ndb.KeyProperty(User)
    submit_time = ndb.DateTimeProperty(auto_now_add=True)
    result = ndb.BooleanProperty()
    time_used = ndb.FloatProperty()
    memory_used = ndb.FloatProperty()
    language = ndb.StringProperty()
    code = ndb.StringProperty(indexed=False)
    score = ndb.FloatProperty()

    @classmethod
    def get_top_player(cls, test_key, num):
        from itertools import groupby

        results = cls.query(cls.test_key == test_key).fetch()
        results2 = dict(((x.user_key, x.level_key), x) for x in sorted(results, key=lambda x: x.score)).values()
        scores = []
        for key, result in groupby(results2, lambda x: x.user_key):
            scores.append({'user_key': key.urlsafe(), 'username': key.get().email, 'test_key': test_key.urlsafe(),
                           'score': int(sum([x.score for x in result]))})
        if num == 5:
            return sorted(scores, key=lambda k: k['score'], reverse=True)[:5]
        else:
            return sorted(scores, key=lambda k: k['score'], reverse=True)


class Lesson(ndb.Model):
    author = ndb.UserProperty()
    title = ndb.StringProperty()
    description = ndb.StringProperty()
    index = ndb.FloatProperty()
    created = ndb.DateTimeProperty(auto_now_add=True)
    lecture_keys = ndb.KeyProperty('Lecture', repeated=True)


class Lecture(ndb.Model):
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
    current_users = ndb.KeyProperty(User, repeated=True)
    passed_users = ndb.KeyProperty(User, repeated=True)


class Code(ndb.Model):
    title = ndb.StringProperty()
    index = ndb.FloatProperty()
    description = ndb.StringProperty(indexed=False);
    content = ndb.StringProperty(indexed=False)
    time = ndb.FloatProperty()
    created = ndb.DateTimeProperty(auto_now_add=True)


class QuizAnswer(ndb.Model):
    title = ndb.StringProperty()
    is_true = ndb.BooleanProperty()


class Quiz(ndb.Model):
    title = ndb.StringProperty()
    question = ndb.StringProperty()
    answers = ndb.StructuredProperty(QuizAnswer, repeated=True)
    time = ndb.FloatProperty()
    created = ndb.DateTimeProperty(auto_now_add=True)
    score = ndb.FloatProperty()


class Test(ndb.Model):
    title = ndb.StringProperty()
    description = ndb.StringProperty(indexed=False)
    test_script = ndb.StringProperty(indexed=False)
    time = ndb.FloatProperty()
    created = ndb.DateTimeProperty(auto_now_add=True)
    score = ndb.FloatProperty()
