from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ai.service import extract_requirements
from applications.models import Application
from credentials.models import Credential
from eligibility.engine import build_policy_from_requirements, check_eligibility
from eligibility.midnight import generate_proof_reference, verify_proof
from scholarships.models import Scholarship
from users.permissions import IsProvider, IsStudent

from applications.serializers import ApplicationSerializer, ProviderApplicationSerializer


class EligibilityCheckView(APIView):
    permission_classes = [IsStudent]

    def post(self, request):
        scholarship_id = request.data.get("scholarship_id")
        if not scholarship_id:
            return Response({"error": "scholarship_id required"}, status=status.HTTP_400_BAD_REQUEST)

        scholarship = Scholarship.objects.prefetch_related("requirements").get(id=scholarship_id)
        requirements = [
            {"field": r.field, "operator": r.operator, "value": r.value}
            for r in scholarship.requirements.all()
        ]
        credentials = []
        for cred in Credential.objects.filter(student=request.user):
            credentials.append(
                {
                    "gpa": float(cred.gpa) if cred.gpa is not None else None,
                    "household_income": cred.household_income,
                    "age": cred.age,
                    "years_completed": cred.years_completed,
                    "enrollment_status": cred.enrollment_status,
                    "university": cred.university,
                }
            )
        result = check_eligibility(requirements, credentials)
        extracted = extract_requirements(scholarship.description)
        return Response(
            {
                "eligible": result["eligible"],
                "requirements": result["requirements"],
                "ai_extracted": extracted.to_engine_format(),
                "ai_note": "AI interpretation only — deterministic engine is the authority.",
                "scholarship_id": scholarship.id,
            }
        )


class GenerateProofView(APIView):
    permission_classes = [IsStudent]

    def post(self, request):
        scholarship_id = request.data.get("scholarship_id")
        if not scholarship_id:
            return Response({"error": "scholarship_id required"}, status=status.HTTP_400_BAD_REQUEST)

        scholarship = Scholarship.objects.prefetch_related("requirements").get(id=scholarship_id)
        requirements = [
            {"field": r.field, "operator": r.operator, "value": r.value}
            for r in scholarship.requirements.all()
        ]
        credentials = []
        for cred in Credential.objects.filter(student=request.user):
            credentials.append(
                {
                    "gpa": float(cred.gpa) if cred.gpa is not None else None,
                    "household_income": cred.household_income,
                    "age": cred.age,
                    "years_completed": cred.years_completed,
                    "enrollment_status": cred.enrollment_status,
                    "university": cred.university,
                }
            )
        result = check_eligibility(requirements, credentials)
        policy = build_policy_from_requirements(
            requirements, scholarship.policy_id, scholarship.policy_version
        )

        try:
            proof = generate_proof_reference(policy, credentials, result["eligible"])
        except RuntimeError as exc:
            return Response({"error": str(exc)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        application, _ = Application.objects.update_or_create(
            student=request.user,
            scholarship=scholarship,
            defaults={
                "proof_reference": proof.get("proofReference", ""),
                "verification_status": (
                    Application.VerificationStatus.VERIFIED
                    if result["eligible"]
                    else Application.VerificationStatus.NOT_ELIGIBLE
                ),
                "eligible": result["eligible"],
                "requirement_results": result["requirements"],
                "policy_id": scholarship.policy_id,
                "policy_version": scholarship.policy_version,
                "midnight_proof_valid": bool(proof.get("valid")),
            },
        )

        return Response(
            {
                "proof_reference": application.proof_reference,
                "eligible": application.eligible,
                "verification_status": application.verification_status,
                "requirement_results": application.requirement_results,
                "midnight_mode": proof.get("mode", "MIDNIGHT"),
                "midnight_proof_valid": application.midnight_proof_valid,
                "application_id": application.id,
            }
        )


class ApplicationListCreateView(generics.ListCreateAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsStudent]

    def get_queryset(self):
        return Application.objects.filter(student=self.request.user).select_related("scholarship")

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)


class ProviderApplicationListView(generics.ListAPIView):
    serializer_class = ProviderApplicationSerializer
    permission_classes = [IsProvider]

    def get_queryset(self):
        return Application.objects.filter(
            scholarship__provider=self.request.user
        ).select_related("student", "scholarship")


class ProviderVerificationView(APIView):
    permission_classes = [IsProvider]

    def get(self, request, pk):
        application = Application.objects.select_related("student", "scholarship").get(
            pk=pk, scholarship__provider=request.user
        )
        policy = {
            "policyId": application.policy_id,
            "policyVersion": application.policy_version,
        }
        verification = verify_proof(application.proof_reference, policy)
        return Response(
            {
                "application_id": application.id,
                "student_id": application.student.student_id,
                "scholarship": application.scholarship.name,
                "eligible": application.eligible,
                "verification_status": application.verification_status,
                "requirement_results": application.requirement_results,
                "midnight_proof_valid": verification.get("valid", application.midnight_proof_valid),
                "midnight_mode": verification.get("mode", "MIDNIGHT"),
                "proof_reference": application.proof_reference,
                "private_fields": {
                    "gpa": "PRIVATE",
                    "income": "PRIVATE",
                    "age": "PRIVATE",
                    "academic_record": "PRIVATE",
                },
            }
        )
