import os
import re

from flask import request, jsonify, url_for, send_from_directory, redirect
from werkzeug.exceptions import NotFound

from apps import db
from apps import flask_app as app
from apps.tasks import make_gif
from model import Movie
from service import SubsLocatorService, SubSearch

subs_service = SubsLocatorService(username=os.environ.get('OS_USER'), password=os.environ.get('OS_PASS'))
sub_search = SubSearch(db=db)


@app.route("/api/v1/movie", methods=["PUT"])
def add_movie():
    data = request.get_json()

    if 'name' not in data:
        match = re.match("(.+)\s\(\d+p\)\..+", os.path.basename(data['movie_file']))
        if match:
            data['name'] = match.group(1)
        else:
            resp = jsonify({"success": False, "message": "Missing name for movie!"})
            resp.status_code = 400
            return resp

    movie = Movie(data['name'], data['movie_file'], data.get('subs_file'))
    if subs_service.get_subs_for_movie(movie):
        movie.load_subs()
        db.session.add(movie)
        db.session.commit()
        sub_search.index_movie(movie)
        return jsonify(movie.to_dict(include_subs=False))
    else:
        resp = jsonify({"success": False, "message": "could not find subs for %s" % movie.movie_path})
        resp.status_code = 400
        return resp


@app.route("/api/v1/movie/<int:movie_id>", methods=["DELETE"])
def remove_movie(movie_id):
    movie = db.session.query(Movie).get(movie_id)
    if not movie:
        return jsonify({"success": False, "message": "No movie %d" % movie_id}), 400

    for sub in movie.subtitles:
        db.session.delete(sub)
    db.session.delete(movie)
    sub_search.remove_movie(movie)
    db.session.commit()
    return jsonify({"success": True, "message": "Deleted %s (%d)" % (movie.movie_path, movie.id)})


@app.route("/api/v1/movie")
def list_movies():
    return jsonify([movie.to_dict(include_subs=False) for movie in db.session.query(Movie).all()])


@app.route("/api/v1/movie/<int:movie_id>")
def get_movie(movie_id):
    return jsonify(db.session.query(Movie).get(movie_id).to_dict())


@app.route("/api/v1/movie/<int:movie_id>/art/<type>")
def get_movie_art(movie_id, type):
    if type not in ["poster.jpg", "fanart.jpg", "landscape.jpg", "logo.png", "banner.jpg", "clearart.png", "disc.png"]:
        raise NotFound()
    movie = db.session.query(Movie).get(movie_id)

    return send_from_directory(os.path.dirname(movie.movie_path), type)


@app.route("/api/v1/movie/subtitle", methods=["GET"])
def search_subs():
    search = request.args.get('query')
    start = int(request.args.get('start', 0))
    size = int(request.args.get('size', 20))
    return jsonify(sub_search.search_for_quotes(search, start=start, size=size))



@app.route("/api/v1/movie/<int:movie_id>/subtitle", methods=["GET"])
def search_subs_within_movie(movie_id):
    search = request.args.get('query')
    start = int(request.args.get('start', 0))
    size = int(request.args.get('size', 20))
    return jsonify(sub_search.search_for_quotes(search, movie_id=movie_id, start=start, size=size))


@app.route("/api/v1/movie/<int:movie_id>/subtitle/<int:sub_id>", methods=["GET"])
def get_sub(movie_id, sub_id):
    return jsonify(sub_search.get_sub_by_id(movie_id, sub_id).to_dict(include_movie=False))


@app.route("/api/v1/movie/<int:movie_id>/subtitle/<int:start_id>:<int:end_id>", methods=["GET"])
def get_sub_range(movie_id, start_id, end_id):
    return jsonify([sub.to_dict(include_movie=False) for sub in sub_search.get_sub_by_range(movie_id, start_id, end_id)])


@app.route("/api/v1/movie/<int:movie_id>/subtitle/<int:sub_id>/gif", methods=["GET"])
def get_gif(movie_id, sub_id):
    return get_gif_range(movie_id, sub_id, sub_id)


@app.route("/api/v1/movie/<int:movie_id>/subtitle/<int:start_id>:<int:end_id>/gif", methods=["GET"])
def get_gif_range(movie_id, start_id, end_id):
    if end_id - start_id > 10:
        return "too much!"

    task = make_gif.delay(movie_id, start_id, end_id)
    return redirect(url_for('gif_render_status', task_id=task.id))


@app.route("/api/v1/gif/status/<task_id>")
def gif_render_status(task_id):
    task = make_gif.AsyncResult(task_id)
    response = {
        'state': task.state,
        'renderId': task_id
    }

    if task.state == "SUCCESS":
        response["url"] = task.result if task.result.startswith("https://") else url_for('gif', gif_file=task.result)
    return jsonify(response)


@app.route("/api/v1/gif/<gif_file>")
def gif(gif_file):
    return send_from_directory(app.config['GIF_OUTPUT_DIR'], gif_file)
