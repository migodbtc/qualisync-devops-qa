
# Copilot Instructions for AI Coding Agents

## Project Overview
This project is a two-service web application managed by Docker Compose:
- **Frontend**: Next.js (TypeScript) in `web/` (port 3000)
- **Backend**: Flask (Python) API in `server/` (port 5821), using SQLite for persistence

## Architecture & Data Flow
- Frontend and backend are fully decoupled; all cross-service communication is via HTTP REST API.
- The frontend uses the `NEXT_PUBLIC_FLASK_API_URL` environment variable to connect to the backend (default: `http://127.0.0.1:5821`).
- Backend exposes `/auth_users` endpoints for CRUD operations, with password hashing (bcrypt) and SQLAlchemy ORM for DB access.
- Docker Compose (`docker-compose.yml`) orchestrates both services and mounts `server/db` for persistent SQLite storage.

## Developer Workflows
- **Start all services**: `docker-compose up --build`
- **Frontend only**: In `web/`, use `pnpm dev` (or `npm run dev`, `yarn dev`, `bun dev`)
- **Backend only**: In `server/`, use `python main.py` (or run via Docker)
- **Lint/Format (web)**: `pnpm lint`, `pnpm lint:fix`, `pnpm format`, `pnpm check-format`
- **Backend dependencies**: Use `requirements.txt` and `pyproject.toml` with a virtual environment (`python -m venv .venv`)
- **Frontend hot-reload**: Edit files in `web/src/app/` (e.g., `page.tsx`) for instant updates

## Project-Specific Conventions
- **Frontend**: Next.js App Router (`src/app/`), Tailwind CSS, Prettier, custom ESLint configs (`web/`)
- **Backend**: Flask with CORS enabled, SQLite DB at `server/db/database.db`, mock users seeded on startup
- **Environment Variables**: Frontend expects `NEXT_PUBLIC_FLASK_API_URL` for API base URL
- **Docker**: Each service has its own Dockerfile; volumes and ports mapped in `docker-compose.yml`
- **Frontend linting**: See `eslint.config.mjs`, `eslint-config-log.json` in `web/`
- **Frontend styles**: Tailwind CSS, see `web/src/app/globals.css`

## Integration Points
- **API Contract**: Frontend expects backend to provide `/auth_users` endpoints (GET, POST, GET by ID)
- **Database**: Backend uses SQLite, schema in SQLAlchemy models in `server/main.py`
- **Cross-Service Communication**: All API calls from frontend use the configured Flask API URL
- **Frontend expects backend to be available at `NEXT_PUBLIC_FLASK_API_URL`**; update `.env` or Docker Compose as needed

## Key Files & Directories
- `docker-compose.yml`: Service orchestration and integration
- `server/main.py`: Flask app, API routes, DB models
- `server/requirements.txt`, `server/pyproject.toml`: Python dependencies
- `server/Dockerfile`: Backend container setup
- `server/db/`: SQLite database location
- `web/`: Next.js frontend, custom ESLint and Prettier configs
- `web/Dockerfile`: Frontend container setup
- `web/package.json`: Scripts and dependencies
- `web/src/app/`: Main Next.js app code
- `web/src/app/portal/page.tsx`: Example of a sub-route/page

## Examples
- To add a new API route, update `server/main.py` and ensure CORS is configured for frontend access
- To add a new frontend page, create a file in `web/src/app/` and link it via Next.js routing (see `web/src/app/portal/page.tsx`)
- To persist new data, update SQLAlchemy models and DB logic in `server/main.py`
- To change frontend styles, edit `web/src/app/globals.css` (Tailwind CSS)

---
If any conventions or workflows are unclear, please request clarification or examples from the maintainers.
If you discover missing or outdated instructions, update this file with actionable, codebase-specific guidance.
