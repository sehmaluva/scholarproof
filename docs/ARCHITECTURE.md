# Architecture

## Flow

```
Student credentials (private) + Scholarship policy
        ↓
AI extracts requirements → validated JSON schema
        ↓
Deterministic eligibility engine (Django)
        ↓
Midnight proof service (TypeScript) + proof server
        ↓
Application with proof_reference only
        ↓
Provider sees ELIGIBLE / requirement verification — no raw values
```

## Components

| Layer | Technology | Role |
|-------|------------|------|
| frontend/ | React + Vite | Student, provider, university UIs |
| backend/ | Django + DRF | Auth, data, eligibility engine, AI validation |
| midnight/ | Compact + TS SDK | Proof generation service |
| PostgreSQL | Docker | Metadata, policies, applications |

## Privacy boundary

- **Student-only:** GPA, income, age, enrollment values in `credentials` app
- **Provider-facing:** `proof_reference`, boolean eligibility, per-requirement satisfaction
- **Never logged:** sensitive credential payloads
