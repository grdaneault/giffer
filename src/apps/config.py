import os


class Config:
    PSQL_HOST = os.environ.get('POSTGRES_HOST', 'localhost')
    PSQL_PORT = os.environ.get('POSTGRES_PORT', '5432')
    PSQL_USER = os.environ.get('POSTGRES_USER', 'giffer')
    PSQL_PASS = os.environ.get('POSTGRES_PASSWORD', 'password')

    SQLALCHEMY_DATABASE_URI = os.environ.get('PSQL_URI', 'postgresql://%s:%s@%s:%s' % (PSQL_USER, PSQL_PASS, PSQL_HOST, PSQL_PORT))

    ES_HOST = os.environ.get('ES_HOST', 'localhost:9200')

    REDIS_HOST = os.environ.get('REDIS_HOST', 'localhost')

    RMQ_HOST = os.environ.get('RMQ_HOST', 'localhost')
    RMQ_USER = os.environ.get('RMQ_USER', 'guest')

    GIF_OUTPUT_DIR = '/tmp/gifs'

    OS_USERNAME = os.environ.get('OS_USER')
    OS_PASSWORD = os.environ.get('OS_PASS')
    OS_USER_AGENT = os.environ.get('OS_USER_AGENT')

    DO_SPACES_KEY = os.environ.get('DO_SPACES_KEY')
    DO_SPACES_SECRET = os.environ.get('DO_SPACES_SECRET')
    DO_SPACES_BUCKET = os.environ.get('DO_SPACES_BUCKET', 'giffer')
    DO_SPACES_REGION = os.environ.get('DO_SPACES_REGION', 'nyc3')
    DO_SPACES_ENDPOINT = os.environ.get('DO_SPACES_ENDPOINT', 'https://%s.digitaloceanspaces.com' % DO_SPACES_REGION)
    DO_SPACES_PUBLIC_URL = os.environ.get('DO_SPACES_PUBLIC_URL', 'http://localhost:4572/giffer')

    DO_GIF_DIR = os.environ.get('DO_GIF_DIR', 'gifs/')
    DO_MOVIE_DIR = os.environ.get('DO_MOVIE_DIR', 'movies/')





