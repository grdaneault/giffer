import os

from apps import celery_app as app
from apps import db, Config
from model import Movie
from service import SubsLocatorService, SubSearch, FileUploadService

subs_service = SubsLocatorService(Config)
sub_search = SubSearch(config=Config, db=db)
upload_service = FileUploadService(Config)

@app.task()
def make_gif(movie_id, start_id, end_id, width=400, file_type="gif"):
    """
    Makes a gif including the selected subtitles

    :param movie_id: Movie file ID
    :param start_id: Starting subtitle ID
    :param end_id: Ending subtitle ID
    :return: name of gif
    """

    # bring in dependencies here so that we don't break the docker run which does not have ffmpeg/etc
    from moviepy.editor import VideoFileClip, TextClip, CompositeVideoClip
    from moviepy.tools import extensions_dict
    from moviepy.video.tools.subtitles import SubtitlesClip
    extensions_dict["mkv"] = {'type': 'video', 'codec': ['libx264', 'libmpeg4', 'aac']}

    movie = db.session.query(Movie).get(movie_id)
    start = sub_search.get_sub_by_id(movie_id, start_id)
    end = sub_search.get_sub_by_id(movie_id, end_id)

    filename = "%d_%d-%d_%d.%s" % (movie.id, start.sub_id, end.sub_id, width, file_type)
    full_filename = os.path.join(app.conf['GIF_OUTPUT_DIR'], filename)

    # we already have this gif - don't render again
    if upload_service.gif_exists(filename):
        path = upload_service.get_url_of_gif(filename)
        print("File exists, returning existing path: %s" % path)
        return path

    if os.path.exists(full_filename):
        if file_type == "gif":
            path = upload_service.upload_gif(full_filename)
        else:
            path = upload_service.upload_mp4(full_filename)
        print("Uploaded existing file to %s" % path)
        return path

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

    if file_type == "gif":
        final.write_gif(full_filename, fps=15)
        path = upload_service.upload_gif(full_filename)
    else:
        final.write_videofile(full_filename, fps=15, audio=False)
        path = upload_service.upload_mp4(full_filename)

    print("Uploaded new render to %s" % path)
    return path
