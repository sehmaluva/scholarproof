from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from users.views import HealthView, LoginView, MeView, RegisterView
from users.student_views import StudentListView

urlpatterns = [
    path("health/", HealthView.as_view(), name="health"),
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("auth/me/", MeView.as_view(), name="me"),
    path("students/", StudentListView.as_view(), name="student-list"),
]
