import pytest

from eligibility.engine import check_eligibility


@pytest.mark.parametrize(
    "gpa,expected",
    [
        (3.82, True),
        (3.1, False),
    ],
)
def test_eligibility_gpa_threshold(gpa, expected):
    requirements = [
        {"field": "gpa", "operator": ">=", "value": "3.5"},
        {"field": "household_income", "operator": "<", "value": "10000"},
        {"field": "age", "operator": "<", "value": "26"},
        {"field": "years_completed", "operator": ">=", "value": "2"},
        {"field": "enrollment_status", "operator": "equals", "value": "active"},
    ]
    credentials = [
        {
            "gpa": gpa,
            "household_income": 4500,
            "age": 22,
            "years_completed": 3,
            "enrollment_status": "active",
        }
    ]
    result = check_eligibility(requirements, credentials)
    assert result["eligible"] == expected


def test_ai_schema_rejects_invalid_field():
    from pydantic import ValidationError

    from ai.schemas import ExtractedRequirements

    with pytest.raises(ValidationError):
        ExtractedRequirements.model_validate(
            {"requirements": [{"field": "ssn", "operator": ">=", "value": "1"}]}
        )
