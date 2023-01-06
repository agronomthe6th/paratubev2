from rest_framework import serializers
from rest_framework.permissions import IsAuthenticated
from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from .models import User, Subscription
from rest_framework_jwt.settings import api_settings
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from rest_framework.serializers import ModelSerializer
from rest_framework.views import Response
from rest_framework.serializers import ReadOnlyField
from rest_framework.serializers import PrimaryKeyRelatedField
from rest_framework import status

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email','id', 'avatar', 'description')
        # fields = "__all__"


class ProfileSerializer(serializers.ModelSerializer):
    avatar = serializers.FileField()
    class Meta:
        model = User
        fields = ('id','username' ,'avatar', 'description')

class SignUpSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True, validators=[
                                   UniqueValidator(queryset=User.objects.all())])
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'password2',
                  'email',]

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {'password': 'Password fields didn\'t match.'})

        return attrs

    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
        )

        user.set_password(validated_data['password'])
        user.save()

        return user

class SubscriptionUserSerializer(ModelSerializer):
    subscribers_count = ReadOnlyField(source='get_subscribers_count')

    class Meta:
        model = User
        fields = ['id', 'username', 'avatar', 'subscribers_count']

class SubscriptionSerializer(ModelSerializer):
    channel = SubscriptionUserSerializer(many=False, read_only=True)
    channel_id = PrimaryKeyRelatedField(
        queryset=User.objects.all(), write_only=True)

    class Meta:
        model = Subscription
        fields = '__all__'
        read_only_fields = ['created_at']

    def create(self, validated_data):
        if validated_data['channel_id'] == validated_data['user']:
            return Response(status=status.HTTP_409_CONFLICT)

        subscription, created = Subscription.objects.get_or_create(
            channel=validated_data['channel_id'], user=validated_data['user'])
        return subscription
