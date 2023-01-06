from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.viewsets import ModelViewSet
import django_filters.rest_framework
from rest_framework import filters
from .models import Comment
from .models import ReplyComment
from .serializers import CommentSerializer
from .serializers import ReplyCommentSerializer
from root.permissions import IsAuthor
from rest_framework.pagination import PageNumberPagination

class LargeResultsSetPagination(PageNumberPagination):
    page_size = 8
    page_size_query_param = 'page_size'
    max_page_size = 24


class CommentViews(ModelViewSet):
    pagination_class = LargeResultsSetPagination 
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthor]
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()
    filter_backends = [filters.OrderingFilter, filters.SearchFilter, django_filters.rest_framework.DjangoFilterBackend]
    filterset_fields = ['video',]

    def perform_create(self, serializer):
        print('Create Comment')
        serializer.save(author=self.request.user)

    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


class ReplyCommentViews(ModelViewSet):
    pagination_class = LargeResultsSetPagination 
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthor]
    serializer_class = ReplyCommentSerializer
    queryset = ReplyComment.objects.all()
    filter_backends = [filters.OrderingFilter, filters.SearchFilter, django_filters.rest_framework.DjangoFilterBackend]
    filterset_fields = ['comment',]
    search_fields = ('comment',)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
