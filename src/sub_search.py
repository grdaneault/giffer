import requests

from movie_to_gif import make_a_gif
from movie_paths import movies
from parse_subtitles import parse_subs



for movie in movies:
    print(movie)
    subs = parse_subs(movie, movie.replace(".mkv", ".srt"))
    movies[movie] = {sub.id: sub for sub in subs}


search = input("term? ")
results = requests.get('http://localhost:9200/subtitles/_search?pretty&q=%s' % search)
hits = results.json()["hits"]["hits"]

for i, hit in enumerate(hits):
    hit = hit["_source"]
    movie_subs = movies[hit["movie"]]
    print("%d: %s" % (i, hit["movie"]))

    for i in range(-3, 4, 1):
        if hit["id"] + i in movie_subs:
            print("\t%s%s" % (">>> " if i == 0 else "", movie_subs[hit["id"] + i]))

    print("-" * 80)

hit = hits[int(input("Quote choice: "))]["_source"]
start = int(input("Start ID: "))
end = int(input("End ID: "))
out = input("filename: ")

movie_subs = movies[hit["movie"]]

make_a_gif(hit["movie"], hit["movie"].replace(".mkv", ".srt"), out, movie_subs[start].start, movie_subs[end].end)

