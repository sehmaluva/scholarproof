from rest_framework import serializers

from applications.models import Application


class ApplicationSerializer(serializers.ModelSerializer):
    scholarship_name = serializers.CharField(source="scholarship.name", read_only=True)

    class Meta:
        model = Application
        fields = (
            "id",
            "scholarship",
            "scholarship_name",
            "proof_reference",
            "verification_status",
            "eligible",
            "requirement_results",
            "policy_id",
            "policy_version",
            "midnight_proof_valid",
            "created_at",
        )
        read_only_fields = (
            "proof_reference",
            "verification_status",
            "eligible",
            "requirement_results",
            "policy_id",
            "policy_version",
            "midnight_proof_valid",
            "created_at",
        )


class ProviderApplicationSerializer(serializers.ModelSerializer):
    student_id = serializers.CharField(source="student.student_id", read_only=True)
    scholarship_name = serializers.CharField(source="scholarship.name", read_only=True)

    class Meta:
        model = Application
        fields = (
            "id",
            "student_id",
            "scholarship_name",
            "eligible",
            "verification_status",
            "requirement_results",
            "midnight_proof_valid",
            "proof_reference",
            "created_at",
        )
