import os
from pythonopensubtitles.opensubtitles import OpenSubtitles
from pythonopensubtitles.utils import File
from pythonopensubtitles.settings import Settings

from model import Movie


class SubsLocatorService:
    def __init__(self, username, password, user_agent=None):
        if not username or not username.strip():
            raise ValueError("Missing username")
        if not password or not password.strip():
            raise ValueError("Missing password")

        # Allow overriding the user agent since the test UA has changed
        if user_agent:
            Settings.USER_AGENT = user_agent

        self.os = OpenSubtitles()
        self.os.login(username, password)

    def get_subs_for_movie(self, movie):
        """
        Extracts or downloads the subtitles for a movie
        :param movie:
        :return:
        """
        movie_file = File(movie.movie_path)
        search_def = {
            'sublanguageid': 'eng',
            'moviehash': movie_file.get_hash(),
            'moviebytesize': int(movie_file.size)
        }
        subs = self.os.search_subtitles([search_def])
        for sub in subs:
            print(sub)
        return subs


if __name__ == "__main__":
    instance = SubsLocatorService(os.environ.get("OS_USER"), os.environ.get("OS_PASS"), os.environ.get("OS_USER_AGENT"))
    # instance.get_subs_for_movie(m3)
