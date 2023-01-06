from rest_framework.mixins import CreateModelMixin
from rest_framework.mixins import DestroyModelMixin
from rest_framework.mixins import ListModelMixin
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.viewsets import GenericViewSet
import django_filters.rest_framework
from rest_framework import filters
from root.permissions import IsUser
from .models import CommentRating
from .models import ReplyCommentRating
from .models import VideoRating
from .serializers import CommentRatingSerializer
from .serializers import ReplyCommentRatingSerializer
from .serializers import VideoRatingSerializer


class VideoRatingViews(CreateModelMixin, DestroyModelMixin, ListModelMixin, GenericViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly, IsUser]
    serializer_class = VideoRatingSerializer
    queryset = VideoRating.objects.all()
    filter_backends = [filters.OrderingFilter, filters.SearchFilter, django_filters.rest_framework.DjangoFilterBackend]
    filterset_fields = ['user', 'video',]

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        print('create VideoRatingViews')
        return super().create(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        print('remove')
        return super().destroy(request, *args, **kwargs)


class CommentRatingViews(CreateModelMixin, DestroyModelMixin, ListModelMixin, GenericViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly, IsUser]
    serializer_class = CommentRatingSerializer
    queryset = CommentRating.objects.all()
    filter_backends = [filters.OrderingFilter, filters.SearchFilter, django_filters.rest_framework.DjangoFilterBackend]
    filterset_fields = ('user','comment')

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


class ReplyCommentRatingViews(CreateModelMixin, DestroyModelMixin, ListModelMixin, GenericViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly, IsUser]
    serializer_class = ReplyCommentRatingSerializer
    queryset = ReplyCommentRating.objects.all()
    filterset_fields = ('user', 'reply_comment')

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
