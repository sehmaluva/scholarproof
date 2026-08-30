from django.urls import path

from ai.views import ExtractRequirementsView

urlpatterns = [
    path("extract-requirements/", ExtractRequirementsView.as_view(), name="extract-requirements"),
]
