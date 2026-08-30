"""Strict schema for AI-extracted scholarship requirements."""

from typing import Literal

from pydantic import BaseModel, Field, field_validator

ALLOWED_FIELDS = frozenset(
    {"gpa", "household_income", "age", "years_completed", "enrollment_status"}
)
ALLOWED_OPERATORS = frozenset({">=", "<", "<=", ">", "equals"})


class RequirementItem(BaseModel):
    field: str
    operator: str
    value: str | float | int

    @field_validator("field")
    @classmethod
    def validate_field(cls, v: str) -> str:
        if v not in ALLOWED_FIELDS:
            raise ValueError(f"Unsupported field: {v}")
        return v

    @field_validator("operator")
    @classmethod
    def validate_operator(cls, v: str) -> str:
        if v not in ALLOWED_OPERATORS:
            raise ValueError(f"Unsupported operator: {v}")
        return v

    @field_validator("value", mode="before")
    @classmethod
    def coerce_value(cls, v: str | float | int) -> str:
        return str(v)


class ExtractedRequirements(BaseModel):
    requirements: list[RequirementItem] = Field(min_length=1)

    def to_engine_format(self) -> list[dict[str, str]]:
        return [
            {"field": r.field, "operator": r.operator, "value": r.value}
            for r in self.requirements
        ]
