from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

from model import Base, Movie

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'

db = SQLAlchemy(app)
db.Model = Base
db.create_all()


@app.route("/movie", methods=["PUT"])
def add_movie():
    data = request.get_json()
    movie = Movie(data['name'], data['movie_file'], data['subs_file'])
    db.session.add(movie)
    db.session.commit()

    return jsonify(movie.to_dict(include_subs=False))
