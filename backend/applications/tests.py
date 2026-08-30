import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from credentials.models import Credential
from scholarships.models import Requirement, Scholarship

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def demo_users(db):
    provider = User.objects.create_user(username="prov", password="testpass123", role="provider")
    student = User.objects.create_user(
        username="stud", password="testpass123", role="student", student_id="SP-TEST"
    )
    return provider, student


@pytest.mark.django_db
def test_provider_cannot_list_student_credentials(api_client, demo_users):
    provider, student = demo_users
    Credential.objects.create(
        student=student,
        credential_type=Credential.CredentialType.ACADEMIC,
        issuer="Test Uni",
        gpa=3.8,
    )
    api_client.force_authenticate(user=provider)
    response = api_client.get("/api/students/me/credentials/")
    assert response.status_code in (403, 404)


@pytest.mark.django_db
def test_eligibility_check_for_seeded_future_leaders(api_client, demo_users):
    provider, student = demo_users
    scholarship = Scholarship.objects.create(
        name="Future Leaders",
        description="GPA 3.5 income 10000",
        provider=provider,
        policy_id="fl-v1",
        policy_version="1.0.0",
    )
    Requirement.objects.create(scholarship=scholarship, field="gpa", operator=">=", value="3.5")
    Requirement.objects.create(
        scholarship=scholarship, field="household_income", operator="<", value="10000"
    )
    Credential.objects.create(
        student=student,
        credential_type=Credential.CredentialType.ACADEMIC,
        issuer="Test",
        gpa=3.82,
        household_income=4500,
        age=22,
        years_completed=3,
        enrollment_status="active",
    )
    api_client.force_authenticate(user=student)
    response = api_client.post(
        "/api/eligibility/check/",
        {"scholarship_id": scholarship.id},
        format="json",
    )
    assert response.status_code == 200
    assert response.json()["eligible"] is True
