import re
import subprocess
import sys


class NoEmbeddedSubsError(ValueError):
    pass


def get_mkv_track_id(movie_path):
    """
    Get the track ID of the subtitles in the MKV file

    :param movie_path: path to the move
    :return: id of the subtitles track
    """
    try:
        raw_info = subprocess.check_output(["mkvmerge", "-i", movie_path],
                                           stderr=subprocess.STDOUT)
    except subprocess.CalledProcessError as ex:
        print(ex)
        sys.exit(1)
    pattern = re.compile('.* (\d+): subtitles \(SubRip/SRT\).*', re.DOTALL)
    m = pattern.match(str(raw_info))
    if m:
        return m.group(1)
    else:
        return None


def extract_mkv_subs(movie_path):
    """
    Extracts the subtitles file from an MKV file (if one exists)

    :param movie_path: path to the movie
    :raises NoEmbeddedSubsError: Problem extracting the subs
    """
    sub_file = movie_path.replace(".mkv", ".srt")
    track_id = get_mkv_track_id(movie_path)

    if track_id:
        try:
            subprocess.call(["mkvextract", "tracks", movie_path, track_id + ":" + sub_file])
        except Exception as e:
            raise NoEmbeddedSubsError("Could not extract subs.", e)

    else:
        raise NoEmbeddedSubsError("No subtitle track")
