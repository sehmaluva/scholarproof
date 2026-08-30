import pytest
from pydantic import ValidationError

from ai.schemas import ExtractedRequirements
from ai.service import extract_requirements


def test_extract_future_leaders_mock():
    text = (
        "Applicants must have GPA of at least 3.5, income below $10,000, "
        "age under 26, two years study, and active enrollment."
    )
    result = extract_requirements(text)
    fields = {r.field for r in result.requirements}
    assert "gpa" in fields
    assert "household_income" in fields
    assert "age" in fields


def test_schema_rejects_hallucinated_field():
    with pytest.raises(ValidationError):
        ExtractedRequirements.model_validate(
            {"requirements": [{"field": "social_security_number", "operator": ">=", "value": "1"}]}
        )


def test_schema_rejects_invalid_operator():
    with pytest.raises(ValidationError):
        ExtractedRequirements.model_validate(
            {"requirements": [{"field": "gpa", "operator": "contains", "value": "3.5"}]}
        )


def test_schema_rejects_empty_requirements():
    with pytest.raises(ValidationError):
        ExtractedRequirements.model_validate({"requirements": []})
