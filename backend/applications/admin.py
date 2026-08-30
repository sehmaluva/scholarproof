from django.contrib import admin

from .models import Application


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = (
        "student",
        "scholarship",
        "eligible",
        "verification_status",
        "midnight_proof_valid",
        "created_at",
    )
    list_filter = ("eligible", "verification_status", "midnight_proof_valid")
