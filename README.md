# ScholarProof

Privacy-preserving scholarship eligibility platform. **Prove you're qualified. Don't reveal why.**

## Problem

Students upload sensitive documents (transcripts, income proof, IDs) just to prove a few eligibility facts.

## Solution

ScholarProof lets students hold credentials privately and generate a privacy-preserving proof that they satisfy scholarship requirements. Providers see ELIGIBLE / NOT ELIGIBLE — not GPA, income, or age.

## Stack

- **Frontend:** React, TypeScript, Vite, Tailwind, React Query
- **Backend:** Django, DRF, PostgreSQL (Python 3.12 via **uv**)
- **Privacy:** Midnight Compact contract + proof service (TypeScript)

## Quick start

### 1) Install Python tooling

If you want to use the project the same way it is configured for the backend, install uv first:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
source $HOME/.local/bin/env
uv --version
```

If you are using pip instead, install the backend dependencies from the requirements file:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```


#### Pre-requisits
```bash
# 1. Update the Linux package index
sudo apt update && sudo apt install curl -y

# 2. Download and run the official Compact installer script
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/midnightntwrk/compact/releases/latest/download/compact-installer.sh | sh

# 3. Reload your environment to add Compact to your active PATH
source $HOME/.local/bin/env
source ~/.bashrc

# 4. Update the CLI manager tool to the latest stable edition
compact self update

# 5. Download and set the active Compact compiler version
compact update

# 6. Verify the installation works inside WSL
compact --version

```

### 2) Run the app using the repo script

From the project root, start the backend, Midnight service, and frontend together:

```bash
chmod +x scripts/dev.sh
./scripts/dev.sh
```

This script starts:
- Backend at http://127.0.0.1:8000
- Midnight service at http://127.0.0.1:4000
- Frontend at http://127.0.0.1:5173

### 3) Manual startup (if you want to run each service separately)

```bash
# Postgres (optional — sqlite works for local dev)
docker compose up -d postgres

# Backend
cp .env.example .env
cd backend
uv sync
DATABASE_URL=sqlite:///db.sqlite3 uv run manage.py migrate
DATABASE_URL=sqlite:///db.sqlite3 uv run manage.py seed_demo
DATABASE_URL=sqlite:///db.sqlite3 uv run manage.py runserver

# Midnight proof service
cd midnight/scholarproof-eligibility
pnpm install
pnpm server

# Frontend
cd frontend
pnpm install
pnpm dev
```

Open http://localhost:5173

### 4) Pip-only alternative

If you prefer plain pip instead of uv, run:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 127.0.0.1:8000
```

The backend dependency file is at [backend/requirements.txt](backend/requirements.txt) and is kept in sync with the uv project configuration in [backend/pyproject.toml](backend/pyproject.toml).

## Demo credentials

| Role | Username | Password |
|------|----------|----------|
| Student SP-1042 | student | demo12345 |
| Provider | provider | demo12345 |
| University | university | demo12345 |

## Testing

```bash
cd backend && DATABASE_URL=sqlite:///db.sqlite3 uv run pytest
cd midnight/scholarproof-eligibility && pnpm test
cd frontend && pnpm test
cd backend && uv run python scripts/smoke_test.py  # integration (servers must be running)
```

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/PRIVACY.md](docs/PRIVACY.md), [docs/THREAT_MODEL.md](docs/THREAT_MODEL.md), [docs/DEMO.md](docs/DEMO.md).
