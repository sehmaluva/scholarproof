from rest_framework import serializers

from .models import Credential


class StudentCredentialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Credential
        fields = (
            "id",
            "credential_type",
            "issuer",
            "commitment",
            "issued_at",
            "gpa",
            "household_income",
            "age",
            "years_completed",
            "enrollment_status",
            "university",
        )
        read_only_fields = ("id", "issued_at", "commitment")


class IssueCredentialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Credential
        fields = (
            "student",
            "credential_type",
            "gpa",
            "household_income",
            "age",
            "years_completed",
            "enrollment_status",
            "university",
        )

    def create(self, validated_data):
        issuer_user = self.context["request"].user
        validated_data["issuer"] = issuer_user.university_name or issuer_user.username
        credential = Credential.objects.create(**validated_data)
        credential.commitment = f"commit-{credential.id}"
        credential.save(update_fields=["commitment"])
        return credential


class ProviderCredentialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Credential
        fields = ("id", "credential_type", "issuer", "commitment", "issued_at")
