from celery import Celery
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

from apps import Config
from model import Base

celery_app = Celery('apps.tasks', backend='redis://' + Config.REDIS_HOST, broker='pyamqp://%s@%s//' % (Config.RMQ_USER, Config.RMQ_HOST))
celery_app.config_from_object('apps.Config')

flask_app = Flask('giffer')
flask_app.config.from_object('apps.Config')
cors = CORS(flask_app, resources={r"/api/*": {"origins": "*"}})

db = SQLAlchemy(flask_app)
db.Model = Base
db.create_all()


def prepare_flask_app():
    from apps.webapp import make_api_blueprint
    flask_app.register_blueprint(make_api_blueprint(db, Config), url_prefix='/api/v1')
    return flask_app
