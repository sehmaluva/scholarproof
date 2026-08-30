from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("users.urls")),
    path("api/scholarships/", include("scholarships.urls")),
    path("api/students/", include("credentials.urls")),
    path("api/eligibility/", include("eligibility.urls")),
    path("api/ai/", include("ai.urls")),
]
