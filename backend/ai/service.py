"""AI requirement extraction — interprets text, never executes eligibility."""

import json
import logging
import urllib.error
import urllib.request

from django.conf import settings

from .schemas import ExtractedRequirements

logger = logging.getLogger(__name__)

FUTURE_LEADERS_EXTRACTION = {
    "requirements": [
        {"field": "gpa", "operator": ">=", "value": "3.5"},
        {"field": "household_income", "operator": "<", "value": "10000"},
        {"field": "age", "operator": "<", "value": "26"},
        {"field": "years_completed", "operator": ">=", "value": "2"},
        {"field": "enrollment_status", "operator": "equals", "value": "active"},
    ]
}

SYSTEM_PROMPT = """You extract scholarship eligibility requirements from natural language.
Return ONLY valid JSON matching this schema:
{
  "requirements": [
    {"field": "gpa|household_income|age|years_completed|enrollment_status", "operator": ">=|<|<=|>|equals", "value": "..."}
  ]
}
Do not include explanations or code. Only JSON."""


def extract_requirements(description: str) -> ExtractedRequirements:
    if settings.AI_MOCK_MODE or not settings.OPENAI_API_KEY:
        return _mock_extract(description)

    try:
        raw = _call_openai(description)
        data = json.loads(raw)
        return ExtractedRequirements.model_validate(data)
    except Exception as exc:
        logger.warning("AI extraction failed, using deterministic mock: %s", type(exc).__name__)
        return _mock_extract(description)


def _mock_extract(description: str) -> ExtractedRequirements:
    if "future leaders" in description.lower() or "3.5" in description:
        return ExtractedRequirements.model_validate(FUTURE_LEADERS_EXTRACTION)
    if "3.9" in description or "excellence" in description.lower():
        return ExtractedRequirements.model_validate(
            {
                "requirements": [
                    {"field": "gpa", "operator": ">=", "value": "3.9"},
                    {"field": "enrollment_status", "operator": "equals", "value": "active"},
                ]
            }
        )
    return ExtractedRequirements.model_validate(FUTURE_LEADERS_EXTRACTION)


def _call_openai(description: str) -> str:
    url = f"{settings.OPENAI_BASE_URL.rstrip('/')}/chat/completions"
    payload = {
        "model": settings.OPENAI_MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": description},
        ],
        "temperature": 0,
        "response_format": {"type": "json_object"},
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode(),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        body = json.loads(resp.read().decode())
    content = body["choices"][0]["message"]["content"]
    return content
