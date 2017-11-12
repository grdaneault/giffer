from celery import Celery
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

from model import Base

celery_app = Celery('apps.tasks', backend='redis://localhost', broker='pyamqp://guest@localhost//')
celery_app.config_from_object('apps.Config')

flask_app = Flask('giffer')
flask_app.config.from_object('apps.Config')
cors = CORS(flask_app, resources={r"/api/*": {"origins": "*"}})

db = SQLAlchemy(flask_app)
db.Model = Base
db.create_all()

