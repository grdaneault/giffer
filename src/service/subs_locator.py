import os
import shutil
from pythonopensubtitles.opensubtitles import OpenSubtitles
from pythonopensubtitles.utils import File
from pythonopensubtitles.settings import Settings

from service.mkv_extractor import NoEmbeddedSubsError, extract_mkv_subs
from logging import getLogger


class SubsLocatorService:
    def __init__(self, username, password, user_agent=None):
        if not username or not username.strip():
            raise ValueError("Missing username")
        if not password or not password.strip():
            raise ValueError("Missing password")

        self.os_username = username
        self.os_password = password
        self.os = OpenSubtitles(user_agent=user_agent)
        self.os_logged_in = False

        self.log = getLogger(self.__class__.__name__)

    def _extract_subs_from_mkv(self, movie_path):
        try:
            extract_mkv_subs(movie_path)
            return True
        except NoEmbeddedSubsError as e:
            self.log.info("could not get subs from mkv", e)
            return False

    def _download_subs_for_file(self, movie_path, sub_file):
        if not self.os_logged_in:
            self.os.login(self.os_username, self.os_password)
            self.os_logged_in = True

        movie_file = File(movie_path)
        search_def = {
            'sublanguageid': 'eng',
            'moviehash': movie_file.get_hash(),
            'moviebytesize': movie_file.size
        }
        subs = self.os.search_subtitles([search_def])

        if subs:
            sub = subs[0]
            sub_id = sub['IDSubtitleFile']
            names = {sub_id: sub_file}
            self.os.download_subtitles([sub_id], override_filenames=names, output_directory='/')

            return True
        else:
            self.log.info("No subs found for %s on opensubtitles.org")
            return False

    def _find_existing_subs(self, movie):
        base = os.path.splitext(movie.movie_path)[0]

        for extension in [".srt", ".en.srt", ".eng.srt"]:
            if os.path.exists(base + extension):
                self.log.info("Found existing subs at %s%s" % (base, extension))
                return base + extension

        return None

    def get_subs_for_movie(self, movie):
        """
        Extracts or downloads the subtitles for a movie
        :param movie:
        :return: True, if the subs are available or have been made available. False otherwise.
        """

        # Preserve sanity... ensure that all subs files are named the same way
        expected_sub_file = os.path.splitext(movie.movie_path)[0] + ".srt"
        if movie.subs_path and expected_sub_file != movie.subs_path and os.path.exists(movie.subs_path) and not os.path.exists(expected_sub_file):
            shutil.copy(movie.subs_path, expected_sub_file)
            movie.subs_path = expected_sub_file
            return True

        # Do we already have subs in the expected places?
        existing_subs = self._find_existing_subs(movie)
        if existing_subs:
            if existing_subs != expected_sub_file:
                shutil.copy(movie.subs_path, expected_sub_file)
            movie.subs_path = expected_sub_file
            return True

        # Is this an mkv with subs baked in?
        if movie.movie_path.endswith(".mkv") and self._extract_subs_from_mkv(movie.movie_path):
            movie.subs_path = expected_sub_file
            return True

        # Does this movie have "sync" subs available (matching the hash)
        if self._download_subs_for_file(movie.movie_path, expected_sub_file):
            movie.subs_path = expected_sub_file
            return True

        return False
