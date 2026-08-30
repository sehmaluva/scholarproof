"""Logging filters to avoid leaking sensitive credential data."""

import logging
import re

SENSITIVE_PATTERNS = [
    re.compile(r"gpa", re.I),
    re.compile(r"income", re.I),
    re.compile(r"household", re.I),
    re.compile(r"password", re.I),
    re.compile(r"secret", re.I),
    re.compile(r"credential", re.I),
]


class SensitiveDataFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        msg = str(record.getMessage())
        for pattern in SENSITIVE_PATTERNS:
            if pattern.search(msg):
                record.msg = "[REDACTED sensitive log]"
                record.args = ()
                break
        return True
