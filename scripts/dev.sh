#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

export DATABASE_URL="${DATABASE_URL:-sqlite:///$ROOT/backend/db.sqlite3}"
export MIDNIGHT_MOCK_MODE="${MIDNIGHT_MOCK_MODE:-false}"

echo "Starting ScholarProof..."
echo "  Backend:    http://127.0.0.1:8000"
echo "  Midnight:   http://127.0.0.1:4000"
echo "  Frontend:   http://127.0.0.1:5173"

cd "$ROOT/backend" && uv run manage.py runserver 127.0.0.1:8000 &
cd "$ROOT/midnight/scholarproof-eligibility" && pnpm exec tsx src/server.ts &
cd "$ROOT/frontend" && pnpm dev --host 127.0.0.1 &
wait
