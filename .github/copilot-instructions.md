# Copilot Instructions for AI Coding Agents

## Project Overview
This codebase is a two-service web application orchestrated via Docker Compose:
- **Frontend**: Next.js (TypeScript) app in `web/` (port 3000)
- **Backend**: Flask (Python) API in `server/` (port 5821), using SQLite for persistence

## Architecture & Data Flow
- The frontend communicates with the backend via REST API (`NEXT_PUBLIC_FLASK_API_URL`), defaulting to `http://127.0.0.1:5821`.
- Backend exposes `/auth_users` endpoints for CRUD operations on users, with password hashing via bcrypt and SQLAlchemy ORM for database access.
- Docker Compose (`docker-compose.yml`) coordinates both services, mounting `server/db` for persistent SQLite storage.

## Developer Workflows
- **Start all services**: `docker-compose up --build`
- **Frontend only**: In `web/`, use `pnpm dev` (or `npm run dev`, `yarn dev`, `bun dev`)
- **Backend only**: In `server/`, use `python main.py` (or run via Docker)
- **Lint/Format (web)**: `pnpm lint`, `pnpm lint:fix`, `pnpm format`, `pnpm check-format`
- **Backend dependencies**: Managed via `requirements.txt` and `pyproject.toml`. Use a virtual environment (`python -m venv .venv`).

## Project-Specific Conventions
- **Frontend**: Uses Next.js App Router (`src/app/`), Tailwind CSS, Prettier, ESLint (custom configs in `web/`).
- **Backend**: Flask app with CORS enabled for frontend, SQLite DB file at `server/db/database.db`, mock users seeded on startup.
- **Environment Variables**: Frontend expects `NEXT_PUBLIC_FLASK_API_URL` for API base URL.
- **Docker**: Each service has its own Dockerfile. Volumes and ports are mapped in `docker-compose.yml`.

## Integration Points
- **API Contract**: Frontend expects backend to provide `/auth_users` endpoints (GET, POST, GET by ID).
- **Database**: Backend uses SQLite, schema defined via SQLAlchemy models in `main.py`.
- **Cross-Service Communication**: All API calls from frontend should use the configured Flask API URL.

## Key Files & Directories
- `docker-compose.yml`: Service orchestration and integration
- `server/main.py`: Flask app, API routes, DB models
- `server/requirements.txt`, `server/pyproject.toml`: Python dependencies
- `server/Dockerfile`: Backend container setup
- `web/`: Next.js frontend, with custom ESLint and Prettier configs
- `web/Dockerfile`: Frontend container setup
- `web/package.json`: Scripts and dependencies
- `web/src/app/`: Main Next.js app code

## Examples
- To add a new API route, update `server/main.py` and ensure CORS is configured for frontend access.
- To add a new frontend page, create a file in `web/src/app/` and link it via Next.js routing.
- To persist new data, update SQLAlchemy models and DB logic in `server/main.py`.

---
If any conventions or workflows are unclear, please request clarification or examples from the maintainers.
