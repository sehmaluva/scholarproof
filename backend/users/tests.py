import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def student_user(db):
    user = User.objects.create_user(
        username="teststudent",
        password="testpass123",
        role="student",
        student_id="SP-9999",
    )
    return user


@pytest.fixture
def provider_user(db):
    return User.objects.create_user(
        username="testprovider",
        password="testpass123",
        role="provider",
    )


@pytest.mark.django_db
def test_health_endpoint(api_client):
    response = api_client.get("/api/health/")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


@pytest.mark.django_db
def test_student_cannot_access_provider_endpoints(api_client, student_user, provider_user):
    from scholarships.models import Scholarship

    scholarship = Scholarship.objects.create(
        name="Test Scholarship",
        description="Test",
        provider=provider_user,
        policy_id="test-v1",
        policy_version="1.0.0",
    )
    api_client.force_authenticate(user=student_user)
    response = api_client.get("/api/eligibility/provider/applications/")
    assert response.status_code == 403
