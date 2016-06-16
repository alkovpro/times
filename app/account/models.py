from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from app import db
from app.config import SECRET_KEY, TOKEN_EXPIRE
from passlib.hash import pbkdf2_sha512
from flask_restful import reqparse, Resource as RestfulResource
from jose import jwt
from datetime import datetime
from flask import request
import random
import string
# TODO: Exceptions here are too broad. Maybe they need to be fixed.


class Account(db.Document):
    name = db.StringField(max_length=255, required=True)
    deleted = db.BooleanField(default=False)

    def __str__(self):
        return self.name

    def get_users(self, start=0, limit=0, end=0, exclude_user=None):
        _filter = {
            'account': self,
            'deleted__ne': True,
        }
        if limit == 0 and end > 0:
            limit = end - start
        if exclude_user is not None:
            _filter['id__ne'] = exclude_user.id
        res = User.objects(**_filter).skip(start).limit(limit)
        return res

    def get_users_count(self, exclude_user=None):
        _filter = {
            'account': self,
        }
        if exclude_user is not None:
            _filter['id__ne'] = exclude_user.id
        res = User.objects(**_filter).count()
        return res


class User(db.Document):
    account = db.ReferenceField(Account)
    role = db.StringField(max_length=20, list=['User', 'Superuser'], default='User')
    username = db.StringField(max_length=255, required=False, default='')
    firstname = db.StringField(max_length=255, required=False, default='')
    lastname = db.StringField(max_length=255, required=False, default='')
    email = db.StringField(max_length=255, required=True)
    email_confirmed = db.BooleanField(default=False)
    password = db.StringField(max_length=255, required=False)
    deleted = db.BooleanField(default=False)

    def __str__(self):
        return self.username

    def register(self, **kwargs):
        if 'email' in kwargs:
            if len(kwargs['email']) > 0:
                acc = Account()
                acc.name = kwargs['email']
                acc.save()
                self.account = acc
                if 'username' not in kwargs:
                    kwargs['username'] = kwargs['email'].split('@')[0]
                if 'password' in kwargs:
                    self.password = kwargs['password']
                self.role = 'Superuser'
                self.do_save_profile(**kwargs)

    def set_password(self, password):
        """ encrypts password and sets it to the user.password """
        self.password = User.get_password_hash(password)

    # Return a random alphanumerical password
    def reset_random_password(self, length=8, strong=False):
        random_password = ''
        for x in range(length):
            random_password += random.choice(
                ('!@#$%^&*()_-+=' if strong else '') + string.ascii_letters + string.digits)
        # self.password = random_password
        # self.save()
        return random_password

    def authenticate(self, password):
        if password is not None:
            if self.password is not None:
                if pbkdf2_sha512.verify(str(password), self.password):
                    return True
        return False

    @staticmethod
    def get_password_hash(password):
        """ returns sha256 hash of the password """
        pwd_hash = pbkdf2_sha512.encrypt(password, rounds=20, salt_size=16)
        return pwd_hash

    @staticmethod
    def get_if_found(**kwargs):
        usr = User.objects(**kwargs)
        if len(usr) == 1:
            return usr[0]
        return None

    def get_token(self, exp_begin=0, expiration=0):
        expiration = expiration if expiration > 0 else TOKEN_EXPIRE
        exp_begin = exp_begin if exp_begin > 0 else int(datetime.utcnow().timestamp())
        expiration += exp_begin
        return jwt.encode({'user': str(self.id), 'exp': expiration}, SECRET_KEY, algorithm='HS256')

    @staticmethod
    def verify_token(token):
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms='HS256')
            token_id = data['user']
        except:
            return None
        if token_id:
            return User.get_if_found(id=token_id)
        return None

    def get_email_token(self, salt='', expiration=0, reset_password=False):
        expiration = expiration if expiration > 0 else TOKEN_EXPIRE
        s = Serializer("%s%s" % (SECRET_KEY, salt), expiration)
        data = {
            'user': str(self.id),
        }
        if reset_password:
            data['pwd'] = self.reset_random_password()
        token = s.dumps(data).decode('utf-8')
        if reset_password:
            return token, data['pwd']
        return token

    @staticmethod
    def verify_email_token(token, salt='', reset_password=False):
        s = Serializer("%s%s" % (SECRET_KEY, salt))
        try:
            data = s.loads(token)
        except:
            return None
        token_id = data.get('user')
        if token_id:
            usr = User.get_if_found(id=token_id)
            if reset_password:
                return usr, data.get('pwd')
            return usr
        return None

    def is_superuser(self):
        return self.role == 'Superuser'

    def get_full_name(self):
        return str('%s %s' % (str(self.firstname or '').strip(), str(self.lastname or '').strip())).strip()

    def get_profile(self):
        data = {k: str(self[k]) if self[k] is not None else '' for k in ['email', 'firstname', 'lastname', 'username']}
        data['orgname'] = ''
        if self.account is not None:
            data['orgname'] = self.account.name
        superuser = self.is_superuser()
        return data, superuser

    def do_save_profile(self, **kwargs):
        do_save = False
        for attr in self._fields_ordered:
            if attr in kwargs and attr not in ['id', 'email_confirmed', 'password', 'deleted', 'account']:
                if self[attr] != kwargs[attr]:
                    self[attr] = kwargs[attr]
                    do_save = True
        if do_save:
            self.save()

    def save_profile(self, **kwargs):
        self.do_save_profile(**kwargs)
        if self.is_superuser():
            if 'orgname' in kwargs:
                if self.account.name != kwargs['orgname']:
                    self.account.name = kwargs['orgname']
                    self.account.save()
        return self.get_profile()


def check_auth(**options):
    def check_decorator(f):
        def wrapper(*args, **kwargs):
            arg = {}
            usr = None

            if 'parser' in dir(args[0].__class__):
                if sum(1 if x.name == 'token' else 0 for x in args[0].parser.args) < 1:
                    args[0].parser.add_argument('token', type=str, required=False)
                arg = args[0].parser.parse_args()
            else:
                try:
                    pars = reqparse.RequestParser()
                    pars.add_argument('token', type=str, required=False)
                    arg = pars.parse_args()
                except:
                    pass
            if 'token' not in arg:
                arg['token'] = None
            if arg['token'] is None:
                auth = ''
                try:
                    auth = request.headers.environ['HTTP_AUTHORIZATION']
                except:
                    pass
                if auth.lower().startswith('bearer'):
                    arg['token'] = auth[7:]
            if 'token' in arg:
                usr = User.verify_token(arg['token'])
            allow = False
            if 'allow' in options:
                allow = options['allow']
            if (usr is not None) or allow:
                for k, v in arg.items():
                    if v is not None:
                        kwargs[k] = v
                kwargs['user'] = usr
                return f(*args, **kwargs)
            else:
                return {'success': False,
                        'error': '401',
                        'message': 'Authorization Required',
                        }, 401

        return wrapper

    return check_decorator


class Resource(RestfulResource):
    def get(self):
        return self.action()

    def post(self):
        return self.action()

    def action(self, **kwargs):
        return {}
