from .models import User, check_auth, Resource
from flask_restful import reqparse
from app.common import emails
from flask import request, redirect


class Login(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('email', type=str, required=True)
    parser.add_argument('password', type=str, required=True)

    def action(self):
        args = self.parser.parse_args()
        success = False
        token = ''
        message = ''

        if args['email'] != '' and args['password'] != '':
            usr = User.objects(email=args['email'], deleted__ne=True)
            if len(usr) == 1:
                if usr[0].authenticate(args['password']):
                    token = usr[0].get_token('api')
                    success = True
                else:
                    message = 'Please check your email and password!'
            elif len(usr) > 1:
                message = ['More than one user found!', 'Please contact our support.']
            else:
                message = 'Please check your email and password!'

        return {'success': success,
                'token': token,
                'message': message,
                }


class Register(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('email', type=str, required=True)
    parser.add_argument('password', type=str, required=True)
    parser.add_argument('password1', type=str, required=True)

    def action(self):
        args = self.parser.parse_args()
        success = False
        message = ''

        if args['email'] != '' and args['password'] != '' and args['password1'] != '':
            if args['password'] == args['password1']:
                usr = User.objects(email=args['email'])
                if len(usr) == 0:
                    usr = User()
                    usr.register(email=args['email'], password=args['password'])
                    success = True
                    message = ['We sent you email with a confirmation link.', 'Click it to complete registration.']
                    emails.confirm(usr.email, usr.username, usr.get_email_token('confirm'))
                else:
                    message = 'User with this email already exists!'
            else:
                message = "Passwords don't match!"
        else:
            message = "You should fill all fields!"

        return {'success': success,
                'message': message,
                }


class Reset(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('email', type=str, required=True)

    def action(self):
        args = self.parser.parse_args()
        success = False
        message = ''

        if args['email'] != '':
            usr = User.objects(email=args['email'])
            if len(usr) == 1:
                message = ['We sent you email with new password and a link to apply it.',
                           'Click it to complete password reset.']
                (token, pwd) = usr[0].get_email_token('reset', reset_password=True)
                emails.reset(usr[0].email, usr[0].firstname or usr[0].username, token, pwd)
                success = True
            elif len(usr) > 1:
                message = ['More than one user found!', 'Please contact our support.']
            else:
                message = 'User with this email not found!'
        else:
            message = "You should enter email!"

        return {'success': success,
                'message': message,
                }


class Sidebar(Resource):
    @check_auth()
    def action(self, **kwargs):
        success = False
        message = ''
        data = {}
        if 'user' in kwargs:
            if kwargs['user']:
                try:
                    data = {
                        'name': kwargs['user'].get_full_name(),
                        'username': kwargs['user'].username or '',
                        'email': kwargs['user'].email,
                    }
                    success = True
                except:
                    pass
        return {'success': success,
                'data': data,
                'message': message,
                }


class Profile(Resource):
    @check_auth()
    def action(self, **kwargs):
        success = False
        message = ''
        data = {}
        superuser = False
        if 'user' in kwargs:
            if kwargs['user']:
                try:
                    (data, superuser) = kwargs['user'].get_profile()
                    success = True
                except:
                    pass
        return {'success': success,
                'data': data,
                'superuser': superuser,
                'message': message,
                }


class SaveProfile(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('email', type=str, required=False)
    parser.add_argument('firstname', type=str, required=False)
    parser.add_argument('lastname', type=str, required=False)
    parser.add_argument('username', type=str, required=False)
    parser.add_argument('orgname', type=str, required=False)

    @check_auth()
    def action(self, **kwargs):
        success = False
        message = ''
        data = {}
        superuser = False
        if 'user' in kwargs:
            if kwargs['user']:
                usr = User.objects(email=kwargs['email'], id__ne=kwargs['user'].id, deleted__ne=True)
                if len(usr) == 0:
                    try:
                        need_confirm = kwargs['user'].email != kwargs['email']
                        (data, superuser) = kwargs['user'].save_profile(**kwargs)
                        if need_confirm:
                            kwargs['user'].email_confirmed = False
                            emails.confirm(kwargs['user'].email, kwargs['user'].username,
                                           kwargs['user'].get_email_token('confirm'), new_user=False)
                        success = True
                    except:
                        message = 'Error saving profile.'
                else:
                    message = 'User with this email already exists!'

        return {'success': success,
                'data': data,
                'superuser': superuser,
                'message': message,
                }


class SavePassword(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('oldpassword', type=str, required=True)
    parser.add_argument('password', type=str, required=True)
    parser.add_argument('password1', type=str, required=True)

    @check_auth()
    def action(self, **kwargs):
        success = False
        message = ''
        if 'user' in kwargs:
            if kwargs['user']:
                try:
                    # if kwargs['user'].authenticate(kwargs['oldpassword']):
                    if kwargs['password'] == kwargs['password1']:
                        kwargs['user'].set_password(kwargs['password'])
                        kwargs['user'].save()
                        success = True
                    else:
                        message = "Passwords don't match"
                except:
                    pass
        return {'success': success,
                'message': message,
                }


# { id: '1', email: "user@mail.ru", username: "User1", role: "User" },
class Users(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('startRow', type=int, required=False)
    parser.add_argument('endRow', type=int, required=False)

    @check_auth()
    def action(self, **kwargs):
        success = False
        message = ''
        data = []
        total = 0
        if 'user' in kwargs:
            if kwargs['user']:
                if 'startRow' not in kwargs:
                    kwargs['startRow'] = 0
                if 'endRow' not in kwargs:
                    kwargs['endRow'] = 10
                try:
                    # TODO: add excludeUser to both lines
                    data = [{k: str(x[k]) for k in ['id', 'email', 'username', 'role']} for x in
                            kwargs['user'].account.get_users(start=kwargs['startRow'], end=kwargs['endRow'],
                                                             excludeUser=kwargs['user'])]
                    total = kwargs['user'].account.get_users_count()
                    success = True
                except:
                    pass
        return {'success': success,
                'data': data,
                'total': total,
                'message': message,
                }


class SaveUser(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('id', type=str, required=False)
    parser.add_argument('email', type=str, required=True)
    parser.add_argument('firstname', type=str, required=False)
    parser.add_argument('lastname', type=str, required=False)
    parser.add_argument('username', type=str, required=False)
    parser.add_argument('role', type=str, required=False)

    @check_auth()
    def action(self, **kwargs):
        success = False
        message = ''
        data = []
        if 'user' in kwargs:
            if kwargs['user']:
                success = True
                usrID = ''
                usr = User()
                if 'id' in kwargs and len(kwargs['id']) > 0:
                    usrID = kwargs['id']
                    usr = User.objects(id=usrID)
                    if len(usr) > 0:
                        usr = usr[0]
                    else:
                        success = False
                        message = "User ID not found"
                    tmpUsr = User.objects(email=kwargs['email'], id__ne=usr.id)
                    if len(tmpUsr) > 0:
                        success = False
                        message = "User with this email already exists"

                elif len(kwargs['email']) > 0:
                    tmpUsr = User.objects(email=kwargs['email'])
                    if len(tmpUsr) > 0:
                        success = False
                        message = "User with this email already exists"

                else:
                    success = False
                    message = "Not enough valid data for user identification"

                if success:
                    success = False
                    try:
                        (data, superuser) = usr.save_profile(**kwargs)
                        usr.account = kwargs['user'].account
                        usr.save()
                        success = True
                    except:
                        pass
        return {'success': success,
                'data': data,
                'message': message,
                }


class DeleteUser(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('id', type=str, required=True)

    @check_auth()
    def action(self, **kwargs):
        success = False
        message = ''
        if 'user' in kwargs:
            if kwargs['user']:
                success = True
                usr = User()
                if 'id' in kwargs and len(kwargs['id']) > 0:
                    usrID = kwargs['id']
                    usr = User.objects(id=usrID)
                    if len(usr) > 0:
                        usr = usr[0]
                    else:
                        success = False
                        message = "User ID not found"

                else:
                    success = False
                    message = "Not enough valid data for user identification"

                if success:
                    success = False
                    try:
                        usr.deleted = True
                        usr.save()
                        success = True
                    except:
                        pass
        return {'success': success,
                'message': message,
                }


def confirm_email():
    token = request.args.get('token', None)
    if token:
        usr = User.verify_email_token(token, 'confirm')
        if usr:
            usr.email_confirmed = True
            usr.save()
            return redirect('/#/confirmed')
        else:  # TODO? User not found
            pass
    else:  # TODO? Token is invalid (maybe expired)
        pass
    return redirect('/')


def reset_password():
    token = request.args.get('token', None)
    if token:
        (usr, pwd) = User.verify_email_token(token, 'reset', reset_password=True)
        if usr:
            if not usr.email_confirmed:
                usr.email_confirmed = True
            if pwd is not None:
                usr.set_password(pwd)
            usr.save()
            return redirect('/#/reset')
        else:  # TODO? User not found
            pass
    else:  # TODO? Token is invalid (maybe expired)
        pass
    return redirect('/')
