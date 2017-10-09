import re
import requests

timestamp_pattern = re.compile("[0-9]*:[0-9]*:[0-9]*,[0-9]*")
id_pattern = re.compile("[0-9]+")


class Subtitle:
    def __init__(self, movie, id):
        self.movie = movie
        self.id = int(id)
        self.start = None
        self.end = None
        self.text = ""

    def __str__(self):
        return "{}: {}".format(self.id, self.text.replace("\n", "\\n"))

    __repr__ = __str__


def parse_subs(movie_path, sub_path):
    subs = []

    with open(sub_path, encoding='utf-8') as sub_file:
        sub = None
        for line in sub_file:
            if sub is None:
                sub = Subtitle(movie_path, id_pattern.findall(line)[0])
            elif sub.start is None:
                sub.start, sub.end = timestamp_pattern.findall(line)
            elif not line.strip():
                sub.text = sub.text.strip()
                subs.append(sub)
                sub = None
            else:
                sub.text += line

    return subs


def load_subs_to_es(subs):
    for sub in subs:
        resp = requests.post('http://localhost:9200/subtitles/sub', json=sub.__dict__)
        if resp.status_code >= 400:
            print(resp.text)
        resp.raise_for_status()


if __name__ == '__main__':
    mkv_file = "movie.mkv"
    sub_file = "movie.srt"

    subs = parse_subs(mkv_file, sub_file)


    for sub in subs:
        resp = requests.post('http://localhost:9200/subtitles/sub', json=sub.__dict__)
        print(resp.text)
        resp.raise_for_status()

