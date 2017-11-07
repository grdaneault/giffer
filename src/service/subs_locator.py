import os
from pythonopensubtitles.opensubtitles import OpenSubtitles
from pythonopensubtitles.utils import File


class SubsLocatorService:
    def __init__(self, username, password):
        if not username or not username.strip():
            raise ValueError("Missing username")
        if not password or not password.strip():
            raise ValueError("Missing password")
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
            'MovieLanguage': 'English',
            'MovieHash': movie_file.get_hash(),
            'MovieByteSize': movie_file.size
        }
        subs = self.os.search_subtitles([search_def])
        for sub in subs:
            print(sub)
        return subs


if __name__ == "__main__":
    instance = SubsLocatorService(os.environ.get("OS_USER"), os.environ.get("OS_PASS"))
