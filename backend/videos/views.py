from rest_framework import generics, status
from rest_framework.response import Response
from .models import *
from .serializers import VideoSerializer, PlaylistSerializer, PlaylistVideoSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
import django_filters.rest_framework
from rest_framework import filters
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from root.permissions import IsAuthor,IsUser
from rest_framework.pagination import PageNumberPagination
import sys
from rest_framework.permissions import BasePermission
from rest_framework import mixins
from rest_framework.permissions import SAFE_METHODS
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import CreateModelMixin
from rest_framework.mixins import DestroyModelMixin
from rest_framework.mixins import ListModelMixin
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.viewsets import GenericViewSet


class LargeResultsSetPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 24

class ListVideos(generics.ListAPIView):
    pagination_class = LargeResultsSetPagination 
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    filter_backends = [filters.OrderingFilter, filters.SearchFilter, django_filters.rest_framework.DjangoFilterBackend]
    filterset_fields = ['id', 'title', 'description','author']
    ordering_fields = [ 'id', 'title', 'description',]
    search_fields = ['title', 'description', 'id']

class DetailVideos(generics.ListAPIView):
    pagination_class = LargeResultsSetPagination 
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    

class ThumbnailUpload(APIView):
    def post(self, request, *args, **kwargs):
            print(request.data)
            posts_serializer = VideoSerializer(data=request.data)
            if posts_serializer.is_valid():
                posts_serializer.save()
                print('valid', posts_serializer.data)
                return Response(posts_serializer.data, status=status.HTTP_201_CREATED)
            else:
                print('error', posts_serializer.errors)
                return Response(posts_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
       
class VideoViews(ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthor]
    serializer_class = VideoSerializer
    pagination_class = LargeResultsSetPagination 
    queryset = Video.objects.all()
    filter_backends = [filters.OrderingFilter, filters.SearchFilter, django_filters.rest_framework.DjangoFilterBackend]
    filter_fields = ('author','description',)
    search_fields = ('title','description',)
    ordering_fields = [ 'title', 'description']

    def perform_create(self, serializer):
        print('----------------------------------------------------------------------')
        # print(self.request.__dict__, file=sys.stderr)
        # print(self.request)
        # print(self.request.user)
        # print(serializer)
        print('----------------------------------------------------------------------')
        # print(self.request.id)
        serializer.save(author=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        # print('retrieve')
        # print('----------------------------------------------------------------------')
        # print(self.request.__dict__, file=sys.stderr)
        # print('----------------------------------------------------------------------')
        if not request.user.is_anonymous:
            print(request.user)
            view = VideoView.objects.create(
                user=request.user, video=self.get_object())
            view.save()
        else:
            print('anon')
            view = VideoView.objects.create(video=self.get_object())
            view.save()

        return super(VideoViews, self).retrieve(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        exclude_video = self.request.query_params.get('exclude')
        if exclude_video:
            self.queryset = self.queryset.exclude(id=exclude_video)

        return super(VideoViews, self).list(request, *args, **kwargs)

class PlaylistViews(ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthor]
    serializer_class = PlaylistSerializer
    queryset = Playlist.objects.all()
    filter_fields = ('author',)
    search_fields = ('title',)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        if not request.user.is_anonymous:
            view = PlaylistView.objects.create(
                user=request.user, playlist=self.get_object())
            view.save()
        else:
            view = PlaylistView.objects.create(playlist=self.get_object())
            view.save()

        return super(PlaylistViews, self).retrieve(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        exclude_playlist = self.request.query_params.get('exclude')

        if exclude_playlist:
            self.queryset = self.queryset.exclude(id=exclude_playlist)

        return super(PlaylistViews, self).list(request, *args, **kwargs)

class IsPlaylistAuthor(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            print('safe_methods')
            return True
        elif request.user.is_authenticated and obj.playlist.author.id == request.user.id:
            print('playlist_author')
            return True
        print('False')
        return False


# class PlaylistVideoViews(mixins.CreateModelMixin,
#                          mixins.UpdateModelMixin,
#                          mixins.DestroyModelMixin,
#                          GenericViewSet):
class PlaylistVideoViews(ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly, IsPlaylistAuthor]
    serializer_class = PlaylistVideoSerializer
    queryset = PlaylistVideo.objects.all()
    filter_fields = ('video', 'playlist_id', )

    def create(self, request, *args, **kwargs):
        print(request.POST)
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        print('update request')
        print(request.POST)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        print('delete request')
        return super().destroy(request, *args, **kwargs)
