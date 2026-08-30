from rest_framework import serializers

from scholarships.models import Requirement, Scholarship


class RequirementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Requirement
        fields = ("id", "field", "operator", "value")


class ScholarshipSerializer(serializers.ModelSerializer):
    requirements = RequirementSerializer(many=True, read_only=True)

    class Meta:
        model = Scholarship
        fields = (
            "id",
            "name",
            "description",
            "provider",
            "deadline",
            "policy_id",
            "policy_version",
            "requirements",
            "created_at",
        )
