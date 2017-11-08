import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

from model import Base, Movie
from service import SubsLocatorService

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'

db = SQLAlchemy(app)
db.Model = Base
db.create_all()

subs_service = SubsLocatorService(username=os.environ.get('OS_USER'), password=os.environ.get('OS_PASS'))


@app.route("/movie", methods=["PUT"])
def add_movie():
    data = request.get_json()

    movie = Movie(data['name'], data['movie_file'], data['subs_file'])
    if subs_service.get_subs_for_movie(movie):
        db.session.add(movie)
        db.session.commit()
        return jsonify(movie.to_dict(include_subs=False))
    else:
        resp = jsonify({"success": False, "message": "could not find subs for %s" % movie.movie_path})
        resp.status_code = 400
        return resp
