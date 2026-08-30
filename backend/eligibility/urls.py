from django.urls import path

from eligibility.views import (
    ApplicationListCreateView,
    EligibilityCheckView,
    GenerateProofView,
    ProviderApplicationListView,
    ProviderVerificationView,
)

urlpatterns = [
    path("check/", EligibilityCheckView.as_view(), name="eligibility-check"),
    path("generate-proof/", GenerateProofView.as_view(), name="generate-proof"),
    path("applications/", ApplicationListCreateView.as_view(), name="applications"),
    path("provider/applications/", ProviderApplicationListView.as_view(), name="provider-applications"),
    path(
        "provider/applications/<int:pk>/verification/",
        ProviderVerificationView.as_view(),
        name="provider-verification",
    ),
]
