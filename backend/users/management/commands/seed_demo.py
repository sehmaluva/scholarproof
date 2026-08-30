from datetime import date

from django.core.management.base import BaseCommand

from credentials.models import Credential
from scholarships.models import Requirement, Scholarship
from users.models import User


class Command(BaseCommand):
    help = "Seed demo data for ScholarProof"

    def handle(self, *args, **options):
        provider, _ = User.objects.update_or_create(
            username="provider",
            defaults={
                "email": "provider@scholarproof.demo",
                "role": User.Role.PROVIDER,
            },
        )
        provider.set_password("demo12345")
        provider.save()

        university, _ = User.objects.update_or_create(
            username="university",
            defaults={
                "email": "university@scholarproof.demo",
                "role": User.Role.UNIVERSITY,
                "university_name": "Bindura University of Science Education",
            },
        )
        university.set_password("demo12345")
        university.save()

        student, _ = User.objects.update_or_create(
            username="student",
            defaults={
                "email": "student@scholarproof.demo",
                "role": User.Role.STUDENT,
                "student_id": "SP-1042",
            },
        )
        student.set_password("demo12345")
        student.save()

        future_leaders, _ = Scholarship.objects.update_or_create(
            name="Future Leaders Scholarship",
            provider=provider,
            defaults={
                "description": (
                    "Applicants must currently be enrolled at an accredited university, "
                    "have a GPA of at least 3.5, be younger than 26, have completed at least "
                    "two years of study, and have a household income below $10,000."
                ),
                "deadline": date(2026, 12, 31),
                "policy_id": "future-leaders-v1",
                "policy_version": "1.0.0",
            },
        )
        Requirement.objects.filter(scholarship=future_leaders).delete()
        for field, operator, value in [
            ("gpa", ">=", "3.5"),
            ("household_income", "<", "10000"),
            ("age", "<", "26"),
            ("years_completed", ">=", "2"),
            ("enrollment_status", "equals", "active"),
        ]:
            Requirement.objects.create(
                scholarship=future_leaders, field=field, operator=operator, value=value
            )

        excellence, _ = Scholarship.objects.update_or_create(
            name="Academic Excellence Scholarship",
            provider=provider,
            defaults={
                "description": (
                    "Requires GPA of at least 3.9 and active enrollment. "
                    "For top-performing students only."
                ),
                "deadline": date(2026, 11, 30),
                "policy_id": "excellence-v1",
                "policy_version": "1.0.0",
            },
        )
        Requirement.objects.filter(scholarship=excellence).delete()
        for field, operator, value in [
            ("gpa", ">=", "3.9"),
            ("enrollment_status", "equals", "active"),
        ]:
            Requirement.objects.create(
                scholarship=excellence, field=field, operator=operator, value=value
            )

        Credential.objects.filter(student=student).delete()
        Credential.objects.create(
            student=student,
            credential_type=Credential.CredentialType.ACADEMIC,
            issuer="Bindura University of Science Education",
            gpa=3.82,
            years_completed=3,
            university="Bindura University of Science Education",
        )
        Credential.objects.create(
            student=student,
            credential_type=Credential.CredentialType.ENROLLMENT,
            issuer="Bindura University of Science Education",
            enrollment_status="active",
            university="Bindura University of Science Education",
        )
        Credential.objects.create(
            student=student,
            credential_type=Credential.CredentialType.FINANCIAL,
            issuer="Bindura University of Science Education",
            household_income=4500,
        )
        Credential.objects.create(
            student=student,
            credential_type=Credential.CredentialType.IDENTITY,
            issuer="Bindura University of Science Education",
            age=22,
        )

        for cred in Credential.objects.filter(student=student):
            cred.commitment = f"commit-{cred.id}"
            cred.save(update_fields=["commitment"])

        self.stdout.write(self.style.SUCCESS("Demo data seeded successfully."))
        self.stdout.write("  student / provider / university — password: demo12345")
