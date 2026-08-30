from django.db import models


class Credential(models.Model):
    class CredentialType(models.TextChoices):
        ACADEMIC = "academic", "Academic Credential"
        ENROLLMENT = "enrollment", "Enrollment Credential"
        FINANCIAL = "financial", "Financial Eligibility Credential"
        IDENTITY = "identity", "Identity/Age Credential"

    student = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        related_name="credentials",
        limit_choices_to={"role": "student"},
    )
    credential_type = models.CharField(max_length=32, choices=CredentialType.choices)
    issuer = models.CharField(max_length=255)
    commitment = models.CharField(max_length=128, blank=True, default="")
    issued_at = models.DateTimeField(auto_now_add=True)

    # Private payload — never exposed to providers
    gpa = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    household_income = models.IntegerField(null=True, blank=True)
    age = models.IntegerField(null=True, blank=True)
    years_completed = models.IntegerField(null=True, blank=True)
    enrollment_status = models.CharField(max_length=32, blank=True, default="")
    university = models.CharField(max_length=255, blank=True, default="")

    class Meta:
        ordering = ["credential_type"]

    def __str__(self) -> str:
        return f"{self.student.student_id} - {self.credential_type}"
