import os

from celery import Celery
from flask_sqlalchemy import SQLAlchemy

from model import Base

from service import SubsLocatorService, SubSearch

app = Celery('apps.tasks', broker='pyampq://guest@localhost//')
app.config.from_object('apps.config.Config')

db = SQLAlchemy(app)
db.Model = Base
db.create_all()

subs_service = SubsLocatorService(username=os.environ.get('OS_USER'), password=os.environ.get('OS_PASS'))
sub_search = SubSearch(db=db)
