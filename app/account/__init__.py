from flask_restful import Api
from flask import Blueprint
from .views import *

account_bp = Blueprint('account', __name__, url_prefix='/account')
account = Api(account_bp)

# API for /account
# Common endpoints
account.add_resource(Login, '/login')
account.add_resource(Register, '/register')
account.add_resource(Reset, '/reset')
account.add_resource(Sidebar, '/sidebar')

# Profile endpoints
account.add_resource(Profile, '/profile')
account.add_resource(SaveProfile, '/saveprofile')
account.add_resource(SavePassword, '/savepassword')

# Users endpoints
account.add_resource(Users, '/users')
account.add_resource(SaveUser, '/saveuser')
account.add_resource(DeleteUser, '/deleteuser')

# account.add_resource(job_recurrent, '/job/request/<int:request_id>')
# account.add_resource(job_scheduled, '/job/scheduled')
# account.add_resource(measure_results_all, '/measure/results/all/<int:measure_id>')
