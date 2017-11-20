import os

import re

from apps import celery_app as app
from apps import Config
from model import Movie
from service import SubsLocatorService, FileUploadService

subs_service = SubsLocatorService(Config)
upload_service = FileUploadService(Config)


@app.task()
def load_movie(filename):
    """
    loads a movie and gathers subtitles if possible
    """
    match = re.match("(.+)\s\(\d+p\)\..+", os.path.basename(filename))
    if match:
        movie_name = match.group(1)
    else:
        return {"success": False, "message": "Missing name for movie!"}

    if not os.path.exists(filename):
        return {"success": False, "message": "Missing movie file!"}

    movie = Movie(movie_name, filename)

    if subs_service.get_subs_for_movie(movie):
        movie.load_subs()
        cover_path = os.path.dirname(movie.movie_path) + "/poster.jpg"

        if os.path.exists(cover_path):
            movie.cover_image = upload_service.upload_cover(movie.name, cover_path)

        return movie.to_dict(include_subs=True)
    else:
        return {"success": False, "message": "could not find subs for %s" % movie.movie_path}
