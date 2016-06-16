from flask_restful import Api
from flask import Blueprint
from .views import *

watch_bp = Blueprint('account', __name__, url_prefix='/account')
watch = Api(watch_bp)

# watch.add_resource(List, '/list')
# watch.add_resource(Edit, '/edit')
# watch.add_resource(Delete, '/delete')
