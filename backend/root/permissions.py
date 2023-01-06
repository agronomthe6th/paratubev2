from rest_framework.permissions import BasePermission
from rest_framework.permissions import SAFE_METHODS


class IsAuthor(BasePermission):
    def has_object_permission(self, request, view, obj):
        print('IsAuthor')
        if request.method in SAFE_METHODS:
            return True
        elif request.user.is_authenticated and obj.author.id == request.user.id:
            return True
        return False


class IsUser(BasePermission):
    def has_object_permission(self, request, view, obj):
        print('IsUser')
        if request.method in SAFE_METHODS:
            return True
        elif request.user.is_authenticated and obj.user.id == request.user.id:
            return True
        return False
