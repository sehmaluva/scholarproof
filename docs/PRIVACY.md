# Privacy Model

## Private (student only)

- GPA, household income, age, years completed, enrollment status
- Full academic record details
- Credential payloads in the credentials API (student role)

## Public / provider-visible

- Scholarship ID, policy ID/version
- Proof reference (hash/commitment)
- ELIGIBLE / NOT ELIGIBLE
- Per-requirement VERIFIED status (boolean)
- Midnight proof VALID / INVALID

## What providers receive

Providers see that requirements were satisfied, not the underlying values:

```
GPA requirement       VERIFIED ✓
Income requirement    VERIFIED ✓
Exact GPA             PRIVATE 🔒
Exact income          PRIVATE 🔒
```

## Midnight role

The Compact contract in `midnight/scholarproof-eligibility/contracts/` defines private witnesses (student attributes) and public policy thresholds. The proof service generates cryptographic proof references via the Midnight proof server when available.

Install the `compact` CLI from [midnightntwrk/compact releases](https://github.com/midnightntwrk/compact/releases) for full circuit compilation.
