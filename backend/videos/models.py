import os
from email.policy import default
from django.conf import settings
from django.db import models
from django.urls import reverse
from django.utils import timezone
from taggit.managers import TaggableManager
from django.contrib.auth.models import User, AbstractUser
from django.contrib.contenttypes.fields import GenericRelation
from PIL import Image
import subprocess
from rating.models import VideoRating
from tinytag import TinyTag
from django.dispatch.dispatcher import receiver
from django.db.models.signals import post_save
import ffmpeg_streaming2
from ffmpeg_streaming2 import Formats
# import ffmpeg_streaming

video_input_path = '/youtube/static/videos/'
img_output_path = '/youtube/static/thumbnails/'

# Create your models here.
class ViewBase(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='%(class)s_user', blank=True, null=True)

    class Meta:
        abstract = True

class VideoView(ViewBase):
    video = models.ForeignKey(
        'Video', on_delete=models.CASCADE, related_name='video_view_video')

    class Meta:
        verbose_name = 'Video View'
        verbose_name_plural = 'Video Views'

    def __str__(self) -> str:
        return f'Video View {self.id}, {self.user}, {self.video}'

class Video(models.Model):
    # id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=30)
    video = models.FileField(upload_to='videos/videos/', null=True)
    description = models.TextField(max_length=300, default="Nothing yet", null=True)
    # comments = GenericRelation(Comment)
    # path = models.CharField(max_length=60)
    # datetime = models.DateTimeField(blank=False, null=False) #todo: auto_now=True
    author = models.ForeignKey(
         settings.AUTH_USER_MODEL, default=0, on_delete=models.CASCADE, related_name='video_author')
    # username = models.CharField(default=False, null=True, max_length=60)
    # tags = TaggableManager()
    thumbnail = models.ImageField(default='default.jpg', upload_to='videos/videos/thumbnails/')
    preview = models.ImageField(default='default.jpg', upload_to='videos/videos/thumbnails/')
    embedornot = models.BooleanField(default=False)
    # viewers = models.ManyToManyField(User, blank=True, related_name='viewers')
    # views = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Video'
        verbose_name_plural = 'Videos'

    def __str__(self) -> str:
        return f'Video {self.id}'

    

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        path = 'media/'+str(self.video)

        dashpath = path[:path.index(".") + len(".")]+"mpd"
        video = ffmpeg_streaming2.input(path)
        dash = video.dash(Formats.h264())
        dash.auto_generate_representations()
        dash.output(dashpath)

        thumbnailpath = path[:path.index(".") + len(".")]+"jpg"
        subprocess.call(['ffmpeg', '-i', path, '-ss', '00:00:00.000', 
            '-vframes', '1', thumbnailpath])


        previewpath = path[:path.index(".") + len(".")]+"gif"
        subprocess.call(["ffmpeg", "-t", "5" ,'-hide_banner', "-i", 
            path,previewpath])

        self.video = "".join(dashpath.split('media/',1))
        self.thumbnail = "".join(thumbnailpath.split('media/',1))
        self.preview = "".join(previewpath.split('media/',1))
        super().save()

    @property
    def get_views_count(self) -> int:
        # print('get_views_count')
        # print(self.id)
        # print(VideoView.objects.filter(video=self.id).count())
        return VideoView.objects.filter(video=self.id).count()

    @property
    def get_likes_count(self) -> int:
        return VideoRating.objects.filter(video=self.id, is_liking=True).count()

    @property
    def get_dislikes_count(self) -> int:
        return VideoRating.objects.filter(video=self.id, is_disliking=True).count()

    @property
    def views_num(self):
        return self.views 

    def get_video_duration(self) -> int:
        video = TinyTag.get(os.path.join(
            settings.MEDIA_ROOT +'/'+ str(self.video)))
        return int(video.duration)

    def get_video_thumbnail(self):
        # change resluting directory, 
        # add- tweak+ gif creation
        subprocess.call(['ffmpeg', '-i', os.path.join(
            settings.MEDIA_ROOT +'/'+ str(self.video)), 
                '-ss', 
                '00:00:00.000', 
                '-vframes', 
                '1',
                str(self.video)+'.jpg'])
        subprocess.call(["ffmpeg", 
            "-t", 
            "5" ,
            '-hide_banner',
            "-i",
            os.path.join(
            settings.MEDIA_ROOT +'/'+ str(self.video)),
            str(self.video)+'.gif'])

        print ('ass')
        return 0

    def rename_file(self, file, dir_name):
        ext = file.split('.')[-1]
        filename = '%s/%s/%s.%s' % (self.author_id, dir_name, self.id, ext)
        path = os.path.join('uploads', filename)

        os.renames(
            os.path.join(settings.MEDIA_ROOT, file),
            os.path.join(settings.MEDIA_ROOT, path),
        )


    # @property
    def viewed(self, user):
        # print(self.viewers.all())
        if user in self.viewers.all():
            return True
        else:
            return False

    def get_absolute_url(self):
        return reverse('video', kwargs={'id': self.id})

    # class Meta:
    #     ordering = ['-datetime'] 

    def __str__(self):
        return self.title

class PlaylistView(ViewBase):
    playlist = models.ForeignKey(
        'Playlist', on_delete=models.CASCADE, related_name='playlist_view_playlist')

    class Meta:
        verbose_name = 'Playlist View'
        verbose_name_plural = 'Playlist Views'

    def __str__(self) -> str:
        return f'Playlist View {self.id}, {self.user}, {self.playlist}'


class PlaylistVideo(models.Model):  # M2M between playlist and video
    playlist = models.ForeignKey(
        'Playlist', on_delete=models.CASCADE, related_name='playlist_video_playlist')
    video = models.ForeignKey(
        Video, on_delete=models.CASCADE, related_name='playlist_video_video')
    # position = models.PositiveSmallIntegerField()

    class Meta:
        # ordering = ['position']
        verbose_name = 'Playlist Video'
        verbose_name_plural = 'Playlist Videos'

    def __str__(self) -> str:
        return f'Playlist video {self.id}'

STATUS_TYPES = (
    ('Public', 'Public'),
    ('Unlisted', 'Unlisted'),
    ('Private', 'Private'),
)

class Playlist(models.Model):
    title = models.CharField(max_length=50)
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='playlist_author')
    description = models.CharField(max_length=200, blank=True)
    status = models.CharField(
        max_length=8, choices=STATUS_TYPES, default='Public')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Playlist'
        verbose_name_plural = 'Playlists'

    def __str__(self) -> str:
        return f'Playlist {self.id}'

    @property
    def get_views_count(self) -> int:
        return PlaylistView.objects.filter(playlist=self.id).count()

    @property
    def get_videos(self):
        return PlaylistVideo.objects.filter(playlist=self.id)