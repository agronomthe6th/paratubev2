from django.urls import path, include

from . import views
from rest_framework.routers import DefaultRouter
from .views import VideoViews, PlaylistViews, PlaylistVideoViews
from rating.views import VideoRatingViews, CommentRatingViews, ReplyCommentRatingViews
from users.views import SubscriptionViews, UserViews
from comments.views import CommentViews, ReplyCommentViews

router = DefaultRouter()

routes = [
    {'url': r'users', 'view': UserViews},
    {'url': r'videos', 'view': VideoViews},
    {'url': r'video-ratings', 'view': VideoRatingViews},
    {'url': r'comments', 'view': CommentViews},
    {'url': r'comment-ratings', 'view': CommentRatingViews},
    {'url': r'reply-comments', 'view': ReplyCommentViews},
    {'url': r'reply-comment-ratings', 'view': ReplyCommentRatingViews},
    {'url': r'playlists', 'view': PlaylistViews},
    {'url': r'playlists-video', 'view': PlaylistVideoViews},
    {'url': r'subscriptions', 'view': SubscriptionViews},
]

for route in routes:
    router.register(route['url'], route['view'])


urlpatterns = [
    path('', views.ListVideos.as_view(), name="notes"),
    # path('video/<int:pk>', views.ListVideos.as_view(), name="note"),
    # path("new-video", views.VideoViews),
    path('', include(router.urls)),
]