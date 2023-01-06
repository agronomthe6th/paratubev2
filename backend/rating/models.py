from django.conf import settings
from django.db import models


class RatingBase(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='%(class)s_user')
    is_liking = models.BooleanField(default=False)
    is_disliking = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

    def __str__(self) -> str:
        return f'Rating - {self.user}, {self.is_liking}'

    @property
    def get_likes_count(self) -> int:
        return VideoRating.objects.filter(video=self.video.id, is_liking=True).count()

    @property
    def get_dislikes_count(self) -> int:
        return VideoRating.objects.filter(video=self.video.id, is_disliking=True).count()


class VideoRating(RatingBase):
    video = models.ForeignKey(
        'videos.Video', on_delete=models.CASCADE, related_name='rating_video_video')

    class Meta:
        verbose_name = 'Video Rating'
        verbose_name_plural = 'Video Ratings'



class CommentRating(RatingBase):
    comment = models.ForeignKey(
        'comments.Comment', on_delete=models.CASCADE, related_name='rating_comment_comment')

    class Meta:
        verbose_name = 'Comment Rating'
        verbose_name_plural = 'Comment Ratings'

    ####
    @property
    def get_likes_count(self) -> int:
        return CommentRating.objects.filter(comment=self.comment.id, is_liking=True).count()

    @property
    def get_dislikes_count(self) -> int:
        return CommentRating.objects.filter(comment=self.comment.id, is_disliking=True).count()



class ReplyCommentRating(RatingBase):
    reply_comment = models.ForeignKey(
        'comments.ReplyComment', on_delete=models.CASCADE, related_name='rating_reply_comment')

    class Meta:
        verbose_name = 'Reply Comment Rating'
        verbose_name_plural = 'Reply Comment Ratings'

    ####
    @property
    def get_likes_count(self) -> int:
        return ReplyCommentRating.objects.filter(reply_comment=self.reply_comment.id, is_liking=True).count()

    @property
    def get_dislikes_count(self) -> int:
        return ReplyCommentRating.objects.filter(reply_comment=self.reply_comment.id, is_disliking=True).count()