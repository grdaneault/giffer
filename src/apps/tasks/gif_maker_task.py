import os

from apps.tasks.celery import app
from moviepy.editor import *
from moviepy.video.tools.subtitles import SubtitlesClip
from moviepy.tools import extensions_dict

extensions_dict["mkv"] = {'type': 'video', 'codec': ['libx264', 'libmpeg4', 'aac']}


@app.task()
def make_gif(movie, start, end, width=400):
    """
    Makes a gif including the selected subtitles
    
    :param movie: The movie from which the gif will be created 
    :param start: Starting subtitle
    :param end: Ending subtitle
    :type start: Subtitle
    :type end: Subtitle
    """

    filename = "%d_%d-%d_%d.gif" % (movie.id, start.sub_id, end.sub_id, width)
    filename = os.path.join(app.conf['GIF_OUTPUT_PATH'], filename)

    # we already have this gif - don't render again
    if os.path.exists(filename):
        return

    clip = VideoFileClip(movie.movie_path)

    def subtitler(text):
        return TextClip(text, font='Helvetica-Bold',
                        fontsize=72, color='white',
                        method='caption', size=(clip.w, None),
                        stroke_color='black', stroke_width=2)

    subs = SubtitlesClip(movie.subs_path, make_textclip=subtitler)

    start_time = start.start.replace(',', '.')
    end_time = end.end.replace(',', '.')
    cropped_vid = clip.subclip(t_start=start_time, t_end=end_time)
    cropped_sub = subs.subclip(t_start=start_time, t_end=end_time)
    cropped_sub = cropped_sub.set_position(("center", "bottom"))

    final = CompositeVideoClip([cropped_vid, cropped_sub])
    final = final.resize(width=400)

    final.write_gif(filename, fps=15)