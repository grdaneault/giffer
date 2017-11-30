import os

from flask import request, jsonify, url_for, send_from_directory, redirect, Blueprint
from werkzeug.exceptions import NotFound

from apps.tasks import make_gif, load_movie
from model import Movie
from service import SubSearch

from logging import getLogger, DEBUG

log = getLogger(__name__)
log.setLevel(DEBUG)


def make_api_blueprint(db, config):
    log.error('Creating api blueprint')
    sub_search = SubSearch(config, db=db)

    api = Blueprint('api', __name__)

    @api.route("/movie", methods=["POST"])
    def add_movie():
        data = request.get_json()
        log.error('Loading movie %s' % data)

        task = load_movie.delay(data['movie_file'])

        log.error('Task %s scheduled to load movie' % task.id)

        return redirect(url_for('api.movie_load_status', task_id=task.id), code=303)

    @api.route("/movie/status/<task_id>")
    def movie_load_status(task_id):
        task = load_movie.AsyncResult(task_id)
        response = {
            'state': task.state,
            'task_id': task_id
        }

        log.error("getting status for %s" % task_id)

        if task.state == "SUCCESS":
            if 'success' in task.result:
                response.update(task.result)
                return jsonify(response), 400
            else:
                log.error('Movie loaded successfully... adding to postgres')
                movie = Movie(**task.result)
                db.session.add(movie)
                db.session.commit()
                log.error('Movie %d loaded successfully... now adding %d subtitles to elasticsearch' % (movie.id, len(movie.subtitles)))
                sub_search.index_movie(movie)
                response["movie"] = movie.to_dict(include_subs=False)
        return jsonify(response)

    @api.route("/movie/<int:movie_id>")
    def get_movie(movie_id):
        movie = db.session.query(Movie).get(movie_id)
        if not movie:
            return jsonify({"success": False, "message": "No movie %d" % movie_id}), 404

        return jsonify(movie.to_dict())

    @api.route("/movie/<int:movie_id>", methods=["DELETE"])
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

    @api.route("/movie")
    def list_movies():
        return jsonify([movie.to_dict(include_subs=False) for movie in db.session.query(Movie).all()])

    @api.route("/movie/<int:movie_id>/art/<type>")
    def get_movie_art(movie_id, type):
        if type not in ["poster.jpg", "fanart.jpg", "landscape.jpg", "logo.png", "banner.jpg", "clearart.png", "disc.png"]:
            raise NotFound()
        movie = db.session.query(Movie).get(movie_id)
        if not movie:
            raise NotFound()

        return send_from_directory(os.path.dirname(movie.movie_path), type)

    @api.route("/movie/subtitle", methods=["GET"])
    def search_subs():
        search = request.args.get('query')
        start = int(request.args.get('start', 0))
        size = int(request.args.get('size', 20))
        return jsonify(sub_search.search_for_quotes(search, start=start, size=size))

    @api.route("/movie/<int:movie_id>/subtitle", methods=["GET"])
    def search_subs_within_movie(movie_id):
        search = request.args.get('query')
        start = int(request.args.get('start', 0))
        size = int(request.args.get('size', 20))
        return jsonify(sub_search.search_for_quotes(search, movie_id=movie_id, start=start, size=size))

    @api.route("/movie/<int:movie_id>/subtitle/<int:sub_id>", methods=["GET"])
    def get_sub(movie_id, sub_id):
        subs = sub_search.get_sub_by_id(movie_id, sub_id)
        if not subs:
            return jsonify({"success": False, "message": "No movie %d or no subs %s" % (movie_id, sub_id)}), 404

        return jsonify(subs.to_dict(include_movie=False))

    @api.route("/movie/<int:movie_id>/subtitle/<int:start_id>:<int:end_id>", methods=["GET"])
    def get_sub_range(movie_id, start_id, end_id):
        return jsonify([sub.to_dict(include_movie=False) for sub in sub_search.get_sub_by_range(movie_id, start_id, end_id)])

    @api.route("/movie/<int:movie_id>/subtitle/<int:sub_id>/mp4", methods=["GET"])
    def get_mp4(movie_id, sub_id):
        return get_mp4_range(movie_id, sub_id, sub_id)

    @api.route("/movie/<int:movie_id>/subtitle/<int:start_id>:<int:end_id>/mp4", methods=["GET"])
    def get_mp4_range(movie_id, start_id, end_id):
        if end_id - start_id > 10:
            return jsonify({"success": False, "message": "Can't request more than 10 lines of a movie"}), 400

        task = make_gif.delay(movie_id, start_id, end_id, type="mp4")
        return redirect(url_for('api.gif_render_status', task_id=task.id))

    @api.route("/movie/<int:movie_id>/subtitle/<int:sub_id>/gif", methods=["GET"])
    def get_gif(movie_id, sub_id):
        return get_gif_range(movie_id, sub_id, sub_id)

    @api.route("/movie/<int:movie_id>/subtitle/<int:start_id>:<int:end_id>/gif", methods=["GET"])
    def get_gif_range(movie_id, start_id, end_id):
        if end_id - start_id > 10:
            return jsonify({"success": False, "message": "Can't request more than 10 lines of a movie"}), 400

        task = make_gif.delay(movie_id, start_id, end_id)
        return redirect(url_for('api.gif_render_status', task_id=task.id))

    @api.route("/gif/status/<task_id>")
    def gif_render_status(task_id):
        task = make_gif.AsyncResult(task_id)
        response = {
            'state': task.state,
            'renderId': task_id
        }

        if task.state == "SUCCESS":
            response["url"] = task.result if task.result.startswith("https://") else url_for('api.gif', gif_file=task.result)
        return jsonify(response)

    @api.route("/gif/<gif_file>")
    def gif(gif_file):
        return send_from_directory(config.GIF_OUTPUT_DIR, gif_file)

    return api
