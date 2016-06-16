from app import application
from flask import (
    make_response,
    jsonify,
)
from app.account import views as account


@application.route('/confirm')
def confirm_email():
    return account.confirm_email()


@application.route('/reset')
def reset_password():
    return account.reset_password()


@application.errorhandler(404)
def not_found(error):
    return make_response(jsonify({
        'success': False,
        'error': error.code,
        'message': 'This url does not belong to the app.' if error.code == 404 else error.description,
    }), error.code)


@application.route('/')
def index():
    return make_response(jsonify({'success': True,
                                  'message': 'Test API connection',
                                  }), 200)
