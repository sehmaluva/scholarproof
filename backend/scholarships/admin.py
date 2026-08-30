from django.contrib import admin

from .models import Requirement, Scholarship


class RequirementInline(admin.TabularInline):
    model = Requirement
    extra = 0


@admin.register(Scholarship)
class ScholarshipAdmin(admin.ModelAdmin):
    list_display = ("name", "provider", "deadline", "policy_id")
    inlines = [RequirementInline]


@admin.register(Requirement)
class RequirementAdmin(admin.ModelAdmin):
    list_display = ("scholarship", "field", "operator", "value")
