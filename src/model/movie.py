import os

from datetime import datetime

from model.subtitle import Subtitle, ID_PATTERN, TIMESTAMP_PATTERN
from model.base import Base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship


class Movie(Base):
    __tablename__ = 'movies'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(256))
    movie_path = Column(String)
    subs_path = Column(String)
    cover_image = Column(String)

    subtitles = relationship("Subtitle", order_by=Subtitle.sub_id, back_populates="movie")

    def __init__(self, name, movie_path, subs_path=None, cover_image=None, subtitles=None, id=None):
        self.name = name

        if not os.path.isfile(movie_path):
            raise ValueError("Movie not found at %s" % movie_path)

        self.movie_path = movie_path
        self.subs_path = subs_path
        self.cover_image = cover_image
        self.id = id

        if subtitles:
            if isinstance(subtitles[0], Subtitle):
                self.subtitles = subtitles
            else:
                self.subtitles = [Subtitle(**sub, movie=self) for sub in self.subtitles]
        else:
            if subs_path and os.path.exists(subs_path):
                self.load_subs()
            else:
                self.subtitles = []

    def load_subs(self):
        # noop if there's no subs file or subs are already loaded
        if not self.subs_path or self.subtitles:
            return

        subs = []
        with open(self.subs_path, encoding='utf-8') as sub_file:
            sub = None
            for line in sub_file:
                if sub is None:
                    sub = Subtitle(movie=self, sub_id=ID_PATTERN.findall(line)[0], text="")
                elif sub.start is None:
                    start, end = TIMESTAMP_PATTERN.findall(line)
                    sub.start = datetime.strptime(start, "%H:%M:%S,%f").time()
                    sub.end = datetime.strptime(end, "%H:%M:%S,%f").time()

                elif not line.strip():
                    sub.text = sub.text.strip()
                    subs.append(sub)
                    sub = None
                else:
                    sub.text += line

        self.subtitles = subs

    def to_dict(self, include_subs=False):
        d = {
            "id": self.id,
            "name": self.name,
            "movie_path": self.movie_path,
            "subs_path": self.subs_path,
            "cover_image": self.cover_image
        }

        if include_subs:
            d["subtitles"] = [sub.to_dict(include_movie=False) for sub in self.subtitles]

        return d
