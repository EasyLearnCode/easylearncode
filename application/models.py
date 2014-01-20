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
    name = ndb.StringProperty()
    test_functions = ndb.StringProperty()
    index = ndb.StringProperty()
    timestamp = ndb.DateTimeProperty(auto_now_add=True)


class Exercise(ndb.Model):
    author = ndb.UserProperty()
    name = ndb.StringProperty()
    description = ndb.StringProperty()
    checkpoints = ndb.StructuredProperty(ExerciseCheckpoint)
    index = ndb.StringProperty()
    timestamp = ndb.DateTimeProperty(auto_now_add=True)


class Course(ndb.Model):
    created = ndb.DateTimeProperty(auto_now_add=True)
    updated = ndb.DateTimeProperty(auto_now=True)
    name = ndb.StringProperty()
    img = ndb.BlobProperty()
    description = ndb.StringProperty(indexed=False)
    excercise_keys = ndb.KeyProperty(Exercise, repeated=True)


class WeeklyQuizTest(ndb.Model):
    input = ndb.StringProperty()
    output = ndb.StringProperty()


class WeeklyQuiz(ndb.Model):
    description = ndb.StringProperty(indexed=False)
    start_date = ndb.DateProperty()
    publish_date = ndb.DateTimeProperty(auto_now_add=True)
    limit_memory = ndb.IntegerProperty(default=100)
    limit_time = ndb.FloatProperty(default=60)
    test_case = ndb.StructuredProperty(WeeklyQuizTest, repeated=True)

    @classmethod
    def get_weeklyquizs(cls):
        return cls.query().fetch();

    @classmethod
    def get_this_week_contest(cls):
        from datetime import datetime, timedelta

        test = cls.query(cls.start_date >= (datetime.now() + timedelta(0 - datetime.now().weekday())).date(),
                         cls.start_date <= (datetime.now() + timedelta(
                             6 - datetime.now().weekday())).date()).get()
        return test

    def get_top_player(self, num):
        top_player = WeeklyQuizResult.query(WeeklyQuizResult.test_key == self.key) \
            .order(WeeklyQuizResult.time_used, WeeklyQuizResult.memory_used) \
            .fetch(num)
        top = []
        for player in top_player:
            username = player.user_key.get().email
            player = player.to_dict()
            player.update({'submit_time': str(player['submit_time'])})
            player.pop('test_key', None)
            player.pop('user_key', None)
            player.update({'username': username})
            top.append(player)
        top_player = top
        return top_player

    def run_test_case(self, **kwargs):

        import urllib
        import logging
        import json
        from google.appengine.api import urlfetch
        from application.config import config

        test_result = []

        def handle_result(rpc, **kwargs):
            result = rpc.get_result()
            if result and result.content:
                compile_result = json.loads(result.content)
                testcase = {'time_used': float(compile_result['run_status']['time_used']) or None,
                            'memory_used': int(compile_result['run_status']['memory_used']) or None}
                if compile_result['run_status'] and compile_result['run_status']['output'].strip() == kwargs[
                    'test_output']:
                    testcase['result'] = True
                else:
                    testcase['result'] = False
                test_result.append(testcase)
                if len(test_result) == len(self.test_case):
                    avg_time = sum(
                        test['time_used'] or self.limit_time for test in test_result) / len(
                        self.test_case)
                    avg_memory = sum(
                        test['memory_used'] or self.limit_memory for test in test_result) / len(
                        self.test_case)
                    result = True
                    for test in test_result:
                        result = result and test['result']
                    quiz_result = WeeklyQuizResult(user_key=kwargs['user_key'],
                                                   test_key=self.key, result=result,
                                                   time_used=avg_time,
                                                   memory_used=avg_memory, language=kwargs['lang'], code=kwargs['code'])
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

        for test in self.test_case:
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

    @classmethod
    def get_last_week_contest(cls):
        from datetime import datetime, timedelta

        test = cls.query(cls.start_date >= (datetime.now() + timedelta(-7 - datetime.now().weekday())).date(),
                         cls.start_date <= (datetime.now() + timedelta(
                             -1 - datetime.now().weekday())).date()).get()
        return test


class WeeklyQuizResult(ndb.Model):
    test_key = ndb.KeyProperty(WeeklyQuiz)
    user_key = ndb.KeyProperty(User)
    submit_time = ndb.DateTimeProperty(auto_now_add=True)
    result = ndb.BooleanProperty()
    time_used = ndb.FloatProperty()
    memory_used = ndb.IntegerProperty()
    language = ndb.StringProperty()
    code = ndb.StringProperty(indexed=False)
