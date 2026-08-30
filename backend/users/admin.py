from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    fieldsets = BaseUserAdmin.fieldsets + (
        ("ScholarProof", {"fields": ("role", "wallet_address", "student_id", "university_name")}),
    )
    list_display = ("username", "email", "role", "student_id", "is_staff")
    list_filter = ("role", "is_staff", "is_active")
