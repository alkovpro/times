from app.account.models import User, Account
from .models import Watch
from flask_restful import Resource, reqparse


# def check_auth(token):
#     return Account.verify_token(token,'api')


class users(Resource):
    def get(self):
        return self.action()

    def post(self):
        return self.action()

    def action(self):
        success = False
        return {'success': success,
                'users': [{k:x[k] for k in ['name','email']} for x in User.objects.all()],
                }


class accounts(Resource):
    def get(self):
        return self.action()

    def post(self):
        return self.action()

    def action(self):
        success = False
        accs = []
        for x in Account.objects.all():
            acc = {k: x[k] for k in ['name']}
            acc['users'] = [{k: x[k] for k in ['name', 'email']} for x in User.objects(account = x['id'])]
            accs.append(acc)

        return {'success': success,
                'accounts': accs,
                }


class login(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('email', type=str, required=True)
    parser.add_argument('password', type=str, required=True)

    def get(self):
        return self.action()

    def post(self):
        return self.action()

    def action(self):
        args = self.parser.parse_args()
        success = False
        token = ''

        if args['account'] > 0 and args['key'] != '':
            acc = Account(account_number=args['account'])
            if acc.id > 0 and acc.access_key == args['key']:
                token = acc.get_token('api')
                success = True

        return {'success': success,
                'token': token,
                }
