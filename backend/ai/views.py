from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .service import extract_requirements


class ExtractRequirementsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        description = request.data.get("description", "")
        if not description.strip():
            return Response({"error": "description required"}, status=status.HTTP_400_BAD_REQUEST)
        extracted = extract_requirements(description)
        return Response(
            {
                "requirements": extracted.to_engine_format(),
                "note": "Validated schema output — not executed as eligibility logic.",
            }
        )
