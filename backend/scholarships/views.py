from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Scholarship
from .serializers import ScholarshipSerializer


class ScholarshipListView(generics.ListAPIView):
    queryset = Scholarship.objects.prefetch_related("requirements").all()
    serializer_class = ScholarshipSerializer
    permission_classes = [IsAuthenticated]


class ScholarshipDetailView(generics.RetrieveAPIView):
    queryset = Scholarship.objects.prefetch_related("requirements").all()
    serializer_class = ScholarshipSerializer
    permission_classes = [IsAuthenticated]
