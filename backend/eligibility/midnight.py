"""Midnight proof integration — delegates to Node midnight service."""

import hashlib
import json
import logging
import urllib.error
import urllib.request

from django.conf import settings

logger = logging.getLogger(__name__)


def generate_proof_reference(
    policy: dict,
    credentials: list[dict],
    eligible: bool,
) -> dict:
    if settings.MIDNIGHT_MOCK_MODE:
        return _mock_proof(policy, credentials, eligible)

    try:
        url = f"{settings.MIDNIGHT_SERVICE_URL.rstrip('/')}/proof/generate"
        payload = {"policy": policy, "credentials": credentials, "eligible": eligible}
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode(),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=120) as resp:
            return json.loads(resp.read().decode())
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
        logger.error("Midnight service unavailable: %s", type(exc).__name__)
        raise RuntimeError("Midnight proof service unavailable") from exc


def verify_proof(proof_reference: str, policy: dict) -> dict:
    if settings.MIDNIGHT_MOCK_MODE:
        return {"valid": True, "mode": "MOCK"}

    try:
        url = f"{settings.MIDNIGHT_SERVICE_URL.rstrip('/')}/proof/verify"
        payload = {"proofReference": proof_reference, "policy": policy}
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode(),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=60) as resp:
            return json.loads(resp.read().decode())
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
        logger.error("Midnight verify failed: %s", type(exc).__name__)
        return {"valid": False, "mode": "MIDNIGHT", "error": "verification_failed"}


def _mock_proof(policy: dict, credentials: list[dict], eligible: bool) -> dict:
    digest = hashlib.sha256(
        json.dumps({"policy": policy, "eligible": eligible}, sort_keys=True).encode()
    ).hexdigest()[:32]
    return {
        "proofReference": f"mock-proof-{digest}",
        "valid": eligible,
        "mode": "MOCK",
    }
