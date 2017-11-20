from elasticsearch import Elasticsearch
from elasticsearch_dsl import Search
import elasticsearch.helpers

from model import Subtitle, Movie

INDEX_SUBTITLES = "subtitles"
INDEX_MOVIES = "movies"


class SubSearch:
    def __init__(self, config, db=None):
        self.es = Elasticsearch(hosts=[config.ES_HOST])
        self.db = db

    def index_movie(self, movie):
        """
        Indexes a movie into ES
        :param movie: the movie to index
        :type movie: Movie
        :return:
        """
        self.es.index(INDEX_MOVIES, 'movie', movie.to_dict(include_subs=False), id=movie.id)
        elasticsearch.helpers.bulk(self.es, [{
            "_id": "%d-%d" % (movie.id, sub.sub_id),
            "_index": INDEX_SUBTITLES,
            "_type": "subtitle",
            "_source": sub.to_dict()
        } for sub in movie.subtitles])

    def remove_movie(self, movie):
        elasticsearch.helpers.bulk(self.es, [{
            "_id": "%d-%d" % (movie.id, sub.sub_id),
            "_index": INDEX_SUBTITLES,
            "_type": "subtitle",
            "_op_type": "delete"
        } for sub in movie.subtitles] + [{
            "_id": movie.id,
            "_index": INDEX_MOVIES,
            "_type": "movie",
            "_op_type": "delete"
        }], raise_on_error=False)

    def search_for_quotes(self, query, movie_id=None, start=0, size=10):
        search = Search(using=self.es, index=INDEX_SUBTITLES).query("match", text=query)

        if movie_id is not None:
            search.filter("match", movie_id=movie_id)

        search = search[start:start + size]

        results = search.execute()

        subtitle_matches = []
        matched_movies = {}

        for result in results:
            if result.movie_id not in matched_movies:
                movie = self.db.session.query(Movie).get(result.movie_id)
                matched_movies[result.movie_id] = movie

            sub = {
                "sub_id": result.sub_id,
                "movie_id": result.movie_id,
                "movie_name": matched_movies[result.movie_id].name,
                "start": result.start,
                "end": result.end,
                "text": result.text
            }

            subtitle_matches.append(sub)

        return {
            "total": results.hits.total,
            "matches": subtitle_matches
        }

    def search_around_subtitle(self, subtitle, before=0, after=0):
        min_id = subtitle.sub_id - before
        max_id = subtitle.sub_id + after
        return self.db.session.query(Subtitle).filter(Subtitle.movie_id == subtitle.movie_id, Subtitle.sub_id >= min_id, Subtitle.sub_id <= max_id).all()

    def get_sub_by_id(self, movie_id, sub_id):
        return self.db.session.query(Subtitle).filter(Subtitle.movie_id == movie_id, Subtitle.sub_id == sub_id).first()

    def get_sub_by_range(self, movie_id, start_id, end_id):
        start_id = int(start_id)
        end_id = int(end_id)
        return self.db.session.query(Subtitle).filter(Subtitle.movie_id == movie_id, Subtitle.sub_id >= start_id, Subtitle.sub_id <= end_id).all()
