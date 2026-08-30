from rest_framework import generics

from users.models import User
from users.permissions import IsUniversity
from users.serializers import UserSerializer


class StudentListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsUniversity]

    def get_queryset(self):
        return User.objects.filter(role=User.Role.STUDENT)
