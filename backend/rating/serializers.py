from rest_framework.serializers import ModelSerializer
from rest_framework.serializers import ReadOnlyField

from .models import CommentRating
from .models import ReplyCommentRating
from .models import VideoRating
from colorama import Fore, Back, Style


class RatingBaseSerializer(ModelSerializer):
    likes_count = ReadOnlyField(source='get_likes_count')
    dislikes_count = ReadOnlyField(source='get_dislikes_count')
    class Meta:
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class CommentRatingSerializer(RatingBaseSerializer):
    class Meta(RatingBaseSerializer.Meta):
        model = CommentRating

    def create(self, validated_data):
        rating, created = CommentRating.objects.get_or_create(
            user=validated_data['user'], comment=validated_data['comment'])
        rating.is_liking = validated_data['is_liking']
        rating.is_disliking = validated_data['is_disliking']
        rating.save()
        return rating


class ReplyCommentRatingSerializer(RatingBaseSerializer):
    class Meta(RatingBaseSerializer.Meta):
        model = ReplyCommentRating

    def create(self, validated_data):
        rating, created = ReplyCommentRating.objects.get_or_create(
            user=validated_data['user'], reply_comment=validated_data['reply_comment'])
        rating.is_liking = validated_data['is_liking']
        rating.is_disliking = validated_data['is_disliking']
        rating.save()
        return rating

class VideoRatingSerializer(RatingBaseSerializer):
    class Meta(RatingBaseSerializer.Meta):
        model = VideoRating

    def create(self, validated_data):
        rating, created = VideoRating.objects.get_or_create(
            user=validated_data['user'], video=validated_data['video'])
        rating.is_liking = validated_data['is_liking']
        rating.is_disliking = validated_data['is_disliking']
        rating.save()
        return rating
