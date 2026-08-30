from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        STUDENT = "student", "Student"
        PROVIDER = "provider", "Provider"
        UNIVERSITY = "university", "University"

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.STUDENT)
    wallet_address = models.CharField(max_length=128, blank=True, default="")
    student_id = models.CharField(max_length=32, blank=True, default="")
    university_name = models.CharField(max_length=255, blank=True, default="")

    def __str__(self) -> str:
        return f"{self.username} ({self.role})"
