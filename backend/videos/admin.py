from django.contrib import admin

from .models import Video, VideoView, PlaylistView, Playlist

admin.site.register(Video)
admin.site.register(VideoView)
admin.site.register(PlaylistView)
admin.site.register(Playlist)