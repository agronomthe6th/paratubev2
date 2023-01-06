from django.urls import re_path as url
from django.urls import path, include
from .views import *
from rest_framework_simplejwt import views as jwt_views


urlpatterns = [

      # path('register/',RegisterView.as_view()),
      path('logout/', LogoutView.as_view(), name='logout'),
      path('current_user/', get_current_user),
      path('profiledetail/<str:pk>', Userdetail.as_view()),
      path('updateprofile/<str:pk>', Userupdate.as_view()),
      # path('accounts/register/', RegisterView.as_view(), name='register'),
      # path('my-profile/', ProfileViewSet, name='my-profile'),
      # url('my-profile/', get_current_user, name='my-profile'),
      # path('token', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
      path('token/refresh', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
      path('token',
         TokenObtainPairView.as_view(), name='token_obtain_pair'),
      path('register/', SignUpView.as_view(), name='signup'),

]