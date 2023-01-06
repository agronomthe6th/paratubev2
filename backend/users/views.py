from django.shortcuts import render

from .serializers import *
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework import generics, permissions, mixins
from .serializers import UserSerializer, UserSerializer
from rest_framework import viewsets
from root.permissions import IsAuthor, IsUser
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.generics import GenericAPIView, RetrieveUpdateAPIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import BasePermission
from rest_framework.permissions import SAFE_METHODS
from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import CreateAPIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Subscription
from rest_framework.mixins import CreateModelMixin
from rest_framework.mixins import DestroyModelMixin
from rest_framework.mixins import ListModelMixin
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.viewsets import GenericViewSet

@api_view(['GET'])
def get_current_user( request):
    # print('get_current_user')
    # # print(request.)
    # print('get_current_user')
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

class Userdetail(generics.RetrieveAPIView):
    permission_classes = []
    authentication_classes = []
    serializer_class = UserSerializer

    def get_queryset(self):

        for p in User.objects.all():
            print(p.id)

        if User.objects.filter(id=self.kwargs['pk']):
            print('yes')
            return User.objects.filter(id=self.kwargs['pk'])
        else:
            print('no')
            return User.objects.filter(id=1)

class Userupdate(generics.UpdateAPIView):
    permission_classes = []
    authentication_classes = []
    parser_classes = (FormParser, MultiPartParser)
    queryset = User.objects.all()
    serializer_class = UserSerializer
   
class Myprof(generics.ListAPIView):
    permission_classes = []
    authentication_classes = []
    serializer_class = UserSerializer

    def get_queryset(self):
        return User.objects.filter(user_id=self.kwargs['pk'])

class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)
    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    # Filter Backends
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['id', 'user__username']

# class UserDetailsView(RetrieveUpdateAPIView):
#     serializer_class = UserSerializer
#     queryset = User.objects.all()
#     # Filter Backends
#     filter_backends = [DjangoFilterBackend]
#     filterset_fields = ['id','user__id']

#     # def get_object(self):
#     #     return self.request.user

#     # def get_queryset(self):
#     #     return get_user_model().objects.none()

class Userdetail(generics.RetrieveAPIView):
    permission_classes = []
    authentication_classes = []
    queryset = User.objects.all()
    serializer_class = ProfileSerializer

class RegisterView(APIView):
    permission_classes = []

    def post(self, request, format=None):
        data = self.request.data
        username = data["username"]
        email = data["email"]
        password = data["password"]
        print(username, email, password)
        if User.objects.filter(email=email).exists():
            return Response({"error":"Email Already Exists!"})
        else:
            user = User.objects.create_user(username=username,
                email=email,
                password=password,
                )
            user.save()
            userUser = User.objects.create(id=user.id, 
                user=user,
                username=username,
                avatar='default.jpg')
            print(userUser.id)
            userUser.save()
            return Response({"success":"A new user created sucessfully"})

class IsThisUser(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        elif obj.id == request.user.id:
            return True
        return False


class UserViews(ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [IsThisUser]
    serializer_class = UserSerializer

    def list(self, request, *args, **kwargs):
        self.queryset = self.queryset.exclude(id=request.user.id)
        return super(UserViews, self).list(request, *args, **kwargs)

    def get_current_user(self, request, *args, **kwargs):
        current_user = request.user
        print (current_user.id)

class TokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['id'] = user.id
        token['username'] = user.username
        token['email'] = user.email
        # token['avatar'] = str(user.avatar)
        # print(token)
        return token

class TokenObtainPairView(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializer


class LogoutAndBlacklistRefreshTokenForUserView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        try:
            refresh_token = request.data['refresh_token']
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class SignUpView(CreateAPIView):
    model = User
    permission_classes = (AllowAny,)
    serializer_class = SignUpSerializer



class SubscriptionViews(CreateModelMixin, DestroyModelMixin, ListModelMixin, GenericViewSet):
    queryset = Subscription.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly, IsUser]
    serializer_class = SubscriptionSerializer
    filter_fields = ('user',)

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

