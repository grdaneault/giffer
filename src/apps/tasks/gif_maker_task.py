import os

from moviepy.editor import *
from moviepy.tools import extensions_dict
from moviepy.video.tools.subtitles import SubtitlesClip

from apps import celery_app as app, Config
from apps import db
from model import Movie
from service import SubsLocatorService, SubSearch, GifUploadService

extensions_dict["mkv"] = {'type': 'video', 'codec': ['libx264', 'libmpeg4', 'aac']}

subs_service = SubsLocatorService(username=Config.OS_USERNAME, password=Config.OS_PASSWORD)
sub_search = SubSearch(db=db)
upload_service = GifUploadService(Config)

@app.task()
def make_gif(movie_id, start_id, end_id, width=400):
    """
    Makes a gif including the selected subtitles
    
    :param movie_id: Movie file ID 
    :param start_id: Starting subtitle ID
    :param end_id: Ending subtitle ID
    :return: name of gif
    """

    movie = db.session.query(Movie).get(movie_id)
    start = sub_search.get_sub_by_id(movie_id, start_id)
    end = sub_search.get_sub_by_id(movie_id, end_id)

    filename = "%d_%d-%d_%d.gif" % (movie.id, start.sub_id, end.sub_id, width)
    full_filename = os.path.join(app.conf['GIF_OUTPUT_DIR'], filename)

    # we already have this gif - don't render again
    if upload_service.file_exists(filename):
        return upload_service.get_url_of_upload(filename)

    if os.path.exists(full_filename):
        return upload_service.upload_file(full_filename)

    clip = VideoFileClip(movie.movie_path)
    font_size = clip.h // 10  # Scale the font size to an appropriate size based on the dimensions of the movie

    def subtitler(text):
        return TextClip(text, font='Helvetica-Bold',
                        fontsize=font_size, color='white',
                        method='caption', size=(clip.w, None),
                        stroke_color='black', stroke_width=2)

    subs = SubtitlesClip(movie.subs_path, make_textclip=subtitler)

    start_time = start.start.strftime("%H:%M:%S.%f")
    end_time = end.end.strftime("%H:%M:%S.%f")
    cropped_vid = clip.subclip(t_start=start_time, t_end=end_time)
    cropped_sub = subs.subclip(t_start=start_time, t_end=end_time)
    cropped_sub = cropped_sub.set_position(("center", "bottom"))

    final = CompositeVideoClip([cropped_vid, cropped_sub])
    final = final.resize(width=width)

    final.write_gif(full_filename, fps=15)

    return upload_service.upload_file(full_filename)
