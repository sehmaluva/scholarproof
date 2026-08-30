from rest_framework import generics

from users.permissions import IsStudent, IsUniversity

from .models import Credential
from .serializers import IssueCredentialSerializer, StudentCredentialSerializer


class MyCredentialsView(generics.ListAPIView):
    serializer_class = StudentCredentialSerializer
    permission_classes = [IsStudent]

    def get_queryset(self):
        return Credential.objects.filter(student=self.request.user)


class IssueCredentialView(generics.CreateAPIView):
    serializer_class = IssueCredentialSerializer
    permission_classes = [IsUniversity]

    def perform_create(self, serializer):
        serializer.save()
