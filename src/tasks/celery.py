from celery import Celery

app = Celery('tasks', broker='pyampq://guest@localhost//')
