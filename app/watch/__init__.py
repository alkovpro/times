from flask_restful import Api
from flask import Blueprint
from .views import *

watch_bp = Blueprint('account', __name__, url_prefix='/account')
watch = Api(watch_bp)

# watch.add_resource(list, '/list')
# watch.add_resource(edit, '/edit')
# watch.add_resource(delete, '/delete')
# watch.add_resource(job_recurrent, '/job/request/<int:request_id>')
# watch.add_resource(job_scheduled, '/job/scheduled')
# watch.add_resource(measure_results_all, '/measure/results/all/<int:measure_id>')
