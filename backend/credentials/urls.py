from django.urls import path

from credentials.views import IssueCredentialView, MyCredentialsView

urlpatterns = [
    path("me/credentials/", MyCredentialsView.as_view(), name="my-credentials"),
    path("issue/", IssueCredentialView.as_view(), name="issue-credential"),
]
