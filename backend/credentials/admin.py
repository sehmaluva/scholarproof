from django.contrib import admin

from .models import Credential


@admin.register(Credential)
class CredentialAdmin(admin.ModelAdmin):
    list_display = ("student", "credential_type", "issuer", "issued_at")
    list_filter = ("credential_type", "issuer")
