# Threat Model

## Malicious scholarship provider

- **Threat:** Provider tries to access student GPA/income via API
- **Mitigation:** Provider serializers exclude credential payloads; object-level permissions; student-only credential endpoints

## Malicious student

- **Threat:** Student claims eligibility without meeting requirements
- **Mitigation:** Deterministic engine + Midnight proof tied to policy; ineligible credentials fail verification

## Compromised frontend

- **Threat:** XSS exposes credentials in browser
- **Mitigation:** Credentials only shown to authenticated student; no sensitive data in URLs

## Invalid credentials

- **Threat:** Forged university credentials
- **Mitigation:** MVP uses mock issuer; architecture supports issuer commitments for production

## Tampered policies

- **Threat:** Policy changed after proof generation
- **Mitigation:** `policy_id` + `policy_version` stored with application; verification checks proof reference

## AI hallucination

- **Threat:** LLM invents wrong requirements
- **Mitigation:** Strict Pydantic schema validation; AI is not eligibility authority; seeded scholarships use DB requirements

## Replay / verification

- **Threat:** Reusing old proof for different scholarship
- **Mitigation:** Proof reference includes policy ID and commitment; verification endpoint validates reference format
