from moviepy.editor import *
from moviepy.video.tools.subtitles import SubtitlesClip
from moviepy.tools import extensions_dict

extensions_dict["mkv"] = {'type':'video', 'codec':['libx264','libmpeg4', 'aac']}


def make_a_gif(mkv_file, sub_file, output_file, start, end):
    clip = VideoFileClip(mkv_file)


    def subtitler(text):
        return TextClip(text, font='Helvetica-Bold',
                        fontsize=72, color='white',
                        method='caption', size=(clip.w, None),
                        stroke_color='black', stroke_width=2)

    subs = SubtitlesClip(sub_file, make_textclip=subtitler)

    start = start.replace(',', '.')
    end = end.replace(',', '.')
    cropped_vid = clip.subclip(t_start=start, t_end=end)
    cropped_sub = subs.subclip(t_start=start, t_end=end)
    cropped_sub = cropped_sub.set_position(("center", "bottom"))

    final = CompositeVideoClip([cropped_vid, cropped_sub])
    final = final.resize(width=400)
    # final.to_videofile("final.mp4")


    # if not output_file.endswith(".webm"):
    #     output_file += ".webm"

    if not output_file.endswith(".gif"):
        output_file += ".gif"

    # final.write_videofile("output/" + output_file, fps=2, audio=False)

    final.write_gif("output/" + output_file, fps=15)
