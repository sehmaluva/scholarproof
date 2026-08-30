"""Quick integration smoke test — run with servers up."""

import json
import urllib.request

BASE = "http://127.0.0.1:8000"


def post(path: str, data: dict, token: str | None = None) -> dict:
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(
        f"{BASE}{path}",
        data=json.dumps(data).encode(),
        headers=headers,
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=10) as resp:
        return json.loads(resp.read().decode())


def get(path: str, token: str) -> dict:
    req = urllib.request.Request(
        f"{BASE}{path}",
        headers={"Authorization": f"Bearer {token}"},
    )
    with urllib.request.urlopen(req, timeout=10) as resp:
        return json.loads(resp.read().decode())


token = post("/api/auth/login/", {"username": "student", "password": "demo12345"})["access"]
creds = get("/api/students/me/credentials/", token)
assert len(creds) >= 4, "expected seeded credentials"
check = post("/api/eligibility/check/", {"scholarship_id": 1}, token)
assert check["eligible"] is True, "SP-1042 should be eligible for Future Leaders"
proof = post("/api/eligibility/generate-proof/", {"scholarship_id": 1}, token)
assert proof["eligible"] is True
assert proof["proof_reference"].startswith("mn-") or proof["proof_reference"].startswith("mock-")
provider_token = post("/api/auth/login/", {"username": "provider", "password": "demo12345"})["access"]
apps = get("/api/eligibility/provider/applications/", provider_token)
app_list = apps if isinstance(apps, list) else apps.get("results", [])
assert len(app_list) >= 1
verify = get(f"/api/eligibility/provider/applications/{app_list[0]['id']}/verification/", provider_token)
assert verify["eligible"] is True
assert verify["private_fields"]["gpa"] == "PRIVATE"
print("smoke test passed")
