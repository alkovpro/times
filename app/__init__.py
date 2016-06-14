from flask import Flask
from app import config
from flask_mongoengine import MongoEngine


class PrefixMiddleware(object):
    def __init__(self, app, prefix=''):
        self.app = app
        self.prefix = prefix

    def __call__(self, environ, start_response):

        if environ['PATH_INFO'].startswith(self.prefix):
            environ['PATH_INFO'] = environ['PATH_INFO'][len(self.prefix):]
            environ['SCRIPT_NAME'] = self.prefix
            return self.app(environ, start_response)
        else:
            start_response('404', [('Content-Type', 'application/json')])
            return ['{' \
                    '"success": false,' \
                    '"error": 404,' \
                    '"message": "This url does not belong to the app."' \
                    '}'.encode()]
            # start_response('404', [('Content-Type', 'text/plain')])
            # return ["This url does not belong to the app.".encode()]


application = Flask(__name__)
application.config.from_object(config)
application.wsgi_app = PrefixMiddleware(application.wsgi_app, prefix='/api')

# TODO: Remove cross site requests vulnerability
from flask_cors import CORS

CORS(application)

db = MongoEngine(application)

from .account import account_bp

# from .watch import watch_bp

application.register_blueprint(account_bp)
# application.register_blueprint(watch_bp)

from app import views
