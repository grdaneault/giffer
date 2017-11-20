import os


class Config:
    SQLALCHEMY_DATABASE_URI = os.environ.get('PSQL_URL', 'postgresql://giffer:password@localhost:5432')
    GIF_OUTPUT_DIR = '/tmp/gifs'

    OS_USERNAME = os.environ.get('OS_USER')
    OS_PASSWORD = os.environ.get('OS_PASS')

    DO_SPACES_KEY = os.environ.get('DO_SPACES_KEY')
    DO_SPACES_SECRET = os.environ.get('DO_SPACES_SECRET')
    DO_SPACES_BUCKET = os.environ.get('DO_SPACES_BUCKET', 'giffer')
    DO_SPACES_REGION = os.environ.get('DO_SPACES_REGION', 'nyc3')






