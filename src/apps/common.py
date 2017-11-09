from celery import Celery
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

from model import Base

celery_app = Celery('apps.tasks', broker='pyampq://guest@localhost//')
celery_app.config_from_object('apps.Config')

flask_app = Flask('giffer')
flask_app.config.from_object('apps.Config')

db = SQLAlchemy(flask_app)
db.Model = Base
db.create_all()

