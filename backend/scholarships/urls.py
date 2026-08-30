from django.urls import path

from scholarships.views import ScholarshipDetailView, ScholarshipListView

urlpatterns = [
    path("", ScholarshipListView.as_view(), name="scholarship-list"),
    path("<int:pk>/", ScholarshipDetailView.as_view(), name="scholarship-detail"),
]
