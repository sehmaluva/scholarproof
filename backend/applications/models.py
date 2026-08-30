from django.db import models


class Application(models.Model):
    class VerificationStatus(models.TextChoices):
        PENDING = "pending", "Pending"
        VERIFIED = "verified", "Verified"
        INVALID = "invalid", "Invalid"
        NOT_ELIGIBLE = "not_eligible", "Not Eligible"

    student = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        related_name="applications",
        limit_choices_to={"role": "student"},
    )
    scholarship = models.ForeignKey(
        "scholarships.Scholarship",
        on_delete=models.CASCADE,
        related_name="applications",
    )
    proof_reference = models.CharField(max_length=256, blank=True, default="")
    verification_status = models.CharField(
        max_length=32,
        choices=VerificationStatus.choices,
        default=VerificationStatus.PENDING,
    )
    eligible = models.BooleanField(default=False)
    requirement_results = models.JSONField(default=list, blank=True)
    policy_id = models.CharField(max_length=64, blank=True, default="")
    policy_version = models.CharField(max_length=32, blank=True, default="")
    midnight_proof_valid = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        unique_together = ("student", "scholarship")

    def __str__(self) -> str:
        return f"{self.student.student_id} -> {self.scholarship.name}"
