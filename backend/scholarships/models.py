from django.db import models


class Scholarship(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    provider = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        related_name="scholarships",
        limit_choices_to={"role": "provider"},
    )
    deadline = models.DateField(null=True, blank=True)
    policy_id = models.CharField(max_length=64, default="future-leaders-v1")
    policy_version = models.CharField(max_length=32, default="1.0.0")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.name


class Requirement(models.Model):
    class Operator(models.TextChoices):
        GTE = ">=", ">="
        LT = "<", "<"
        LTE = "<=", "<="
        GT = ">", ">"
        EQ = "equals", "equals"

    scholarship = models.ForeignKey(
        Scholarship, on_delete=models.CASCADE, related_name="requirements"
    )
    field = models.CharField(max_length=64)
    operator = models.CharField(max_length=16, choices=Operator.choices)
    value = models.CharField(max_length=128)

    class Meta:
        ordering = ["id"]

    def __str__(self) -> str:
        return f"{self.field} {self.operator} {self.value}"
