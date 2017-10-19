import re

from model.base import Base
from sqlalchemy import Column, Integer, String, Time, ForeignKey
from sqlalchemy.orm import relationship

TIMESTAMP_PATTERN = re.compile("[0-9]*:[0-9]*:[0-9]*,[0-9]*")
ID_PATTERN = re.compile("[0-9]+")


class Subtitle(Base):
    __tablename__ = 'subtitles'

    sub_id = Column(Integer, primary_key=True)
    movie_id = Column(Integer, ForeignKey('movies.id'), primary_key=True)

    start = Column(Time)
    end = Column(Time)
    text = Column(String)

    movie = relationship('Movie', back_populates='subtitles')

    def to_dict(self, include_movie=False):
        d = {
            "movie_id": self.movie_id,
            "sub_id": self.sub_id,
            "start": str(self.start),
            "end": str(self.end),
            "text": self.text
        }

        if include_movie:
            d["movie"] = self.movie.to_dict(include_subs=False)

        return d


