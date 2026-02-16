# AGENTS.md

## Dev Environment Tips

- Use `pnpm install --filter ./web` to install dependencies for the web frontend.
- Use `pnpm dlx turbo run where` only in the `web` directory to quickly locate the workspace package.
- Use a Python virtual environment in `server/` (`python -m venv .venv`).
- The `.env.example` file contains a format on how the environment variables should look like

## Tech Stack

| Component   | Technology           | Integrated? |
|-------------|----------------------|:-----------:|
| Frontend    | Next.js (TypeScript) |    [X]      |
| Frontend    | Tailwind CSS         |    [X]      |
| Frontend    | ESLint               |    [X]      |
| Frontend    | Prettier             |    [X]      |
| Frontend    | Vitest               |    [X]      |
| Frontend    | Playwright           |    [X]      |
| Backend     | Flask                |    [X]      |
| Backend     | SQLAlchemy           |    [X]      |
| Backend     | MySQL                |    [X]      |
| Backend     | Pytest               |    [X]      |
| Backend     | Black                |    [X]      |
| Backend     | Flake8               |    [X]      |
| DevOps      | Docker               |    [X]      |
| DevOps      | Docker Compose       |    [X]      |
| DevOps      | pnpm                 |    [X]      |
| Cloud       | AWS EC2              |    [X]      |

<!-- Future additions include but not limited to: Kubernetes, Terraform, Pydantic AI, More AWS Services -->

## Testing & Linting Instructions

- CI plans are in [`.github/workflows/`](.github/workflows/).

### Frontend (web/)
- **Run all tests:**  
  `pnpm test`
- **Run component tests:**  
  `pnpm test:component`
- **Run E2E tests:**  
  `pnpm test:e2e`
- **Focus a Vitest test:**  
  `pnpm vitest run -t "<test name>"`
- **Lint code:**  
  `pnpm lint`
- **Auto-fix lint issues:**  
  `pnpm lint:fix`
- **Check formatting:**  
  `pnpm format`
- **Auto-fix formatting:**  
  `pnpm format:fix`

### Backend (server/)
- **Run all unit, integration, and E2E tests:**  
  `pytest`
- **Lint with Black:**  
  `black .`
- **Lint with Flake8:**  
  `flake8 .`

> **Note:**  
> - Black and Flake8 configurations are set in `pyproject.toml` for line length, exclusions, and ignore rules.

- Fix all test and type errors before merging.
- After moving files or changing imports, run `pnpm lint --filter web` to check ESLint and TypeScript rules.
- Add or update tests for any code you change.

## PR Instructions

- **Title format:** `[web] <Title>` or `[server] <Title>`
- **Before committing:**
  - In `web/`:
    - Run `pnpm lint` to check for lint issues.
    - Run `pnpm lint:fix` to auto-fix lint issues if needed.
    - Run `pnpm format` to check formatting.
    - Run `pnpm format:fix` to auto-fix formatting.
    - Run `pnpm test` for all tests.
    - Run `pnpm test:component` for component tests.
    - Run `pnpm test:e2e` for E2E tests.
  - In `server/`:
    - Run `black .` to check and auto-format Python code.
    - Run `flake8 .` to check for lint issues.
    - Run `pytest` for all unit, integration, and E2E tests.
- **Before merging:**
  - Ensure all CI checks pass on GitHub.
