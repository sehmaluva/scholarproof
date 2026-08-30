"""Deterministic eligibility engine — AI is NOT the source of truth."""

from dataclasses import dataclass
from decimal import Decimal
from typing import Any


@dataclass
class RequirementResult:
    requirement: str
    satisfied: bool
    field: str

    def to_dict(self) -> dict[str, Any]:
        return {
            "requirement": self.requirement,
            "satisfied": self.satisfied,
            "field": self.field,
        }


def _get_credential_values(credentials: list[dict[str, Any]]) -> dict[str, Any]:
    values: dict[str, Any] = {}
    for cred in credentials:
        if cred.get("gpa") is not None:
            values["gpa"] = Decimal(str(cred["gpa"]))
        if cred.get("household_income") is not None:
            values["household_income"] = int(cred["household_income"])
        if cred.get("age") is not None:
            values["age"] = int(cred["age"])
        if cred.get("years_completed") is not None:
            values["years_completed"] = int(cred["years_completed"])
        if cred.get("enrollment_status"):
            values["enrollment_status"] = str(cred["enrollment_status"]).lower()
        if cred.get("university"):
            values["university"] = cred["university"]
    return values


def _format_requirement(field: str, operator: str, value: str) -> str:
    labels = {
        "gpa": "GPA",
        "household_income": "Income",
        "age": "Age",
        "years_completed": "Study years",
        "enrollment_status": "Enrollment",
    }
    label = labels.get(field, field)
    if field == "household_income":
        return f"{label} {operator} ${value}"
    if field == "enrollment_status":
        return f"{label} {operator} {value}"
    return f"{label} {operator} {value}"


def _evaluate(field: str, operator: str, expected: str, actual: Any) -> bool:
    if actual is None:
        return False

    if field == "enrollment_status":
        return str(actual).lower() == str(expected).lower()

    if field in ("gpa",):
        actual_num = Decimal(str(actual))
        expected_num = Decimal(str(expected))
    else:
        actual_num = Decimal(str(actual))
        expected_num = Decimal(str(expected))

    if operator == ">=":
        return actual_num >= expected_num
    if operator == ">":
        return actual_num > expected_num
    if operator == "<":
        return actual_num < expected_num
    if operator == "<=":
        return actual_num <= expected_num
    if operator == "equals":
        return str(actual).lower() == str(expected).lower()
    return False


def check_eligibility(
    requirements: list[dict[str, str]],
    credentials: list[dict[str, Any]],
) -> dict[str, Any]:
    values = _get_credential_values(credentials)
    results: list[RequirementResult] = []

    for req in requirements:
        field = req["field"]
        operator = req["operator"]
        value = req["value"]
        actual = values.get(field)
        satisfied = _evaluate(field, operator, value, actual)
        results.append(
            RequirementResult(
                requirement=_format_requirement(field, operator, value),
                satisfied=satisfied,
                field=field,
            )
        )

    eligible = all(r.satisfied for r in results) if results else False
    return {
        "eligible": eligible,
        "requirements": [r.to_dict() for r in results],
    }


def build_policy_from_requirements(
    requirements: list[dict[str, str]],
    policy_id: str,
    policy_version: str,
) -> dict[str, Any]:
    policy: dict[str, Any] = {
        "policyId": policy_id,
        "policyVersion": policy_version,
        "gpaThreshold": 0.0,
        "incomeThreshold": 0,
        "maxAge": 0,
        "minimumStudyYears": 0,
        "requiresEnrollment": False,
    }
    for req in requirements:
        field = req["field"]
        value = req["value"]
        if field == "gpa" and req["operator"] in (">=", ">"):
            policy["gpaThreshold"] = float(value)
        elif field == "household_income" and req["operator"] in ("<", "<="):
            policy["incomeThreshold"] = int(value)
        elif field == "age" and req["operator"] in ("<", "<="):
            policy["maxAge"] = int(value)
        elif field == "years_completed" and req["operator"] in (">=", ">"):
            policy["minimumStudyYears"] = int(value)
        elif field == "enrollment_status" and req["operator"] == "equals":
            policy["requiresEnrollment"] = str(value).lower() == "active"
    return policy
