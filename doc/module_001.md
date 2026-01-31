# Initial Project Module: Infrastructure & DevOps Prototype
**Rationale for Creation**: Developer wishes to learn about the practice of DevOps development, quality assurance, automation, SDLC integration, and more to expand his skillset towards quality software engineering.
**Objective:** Create a project that's less on development-focused but rather infrastructure or automation-focused this time.

## 🛠 Tech Stack
*   **Frontend:** Next.js (TypeScript) + Tailwind CSS
*   **Backend:** Flask (Python)
*   **ORM:** SQLAlchemy
*   **Database:** SQLite
*   **Package Manager:** pnpm (Performance NPM)

---

## Phase 1: The "Walking Skeleton" (Local Build)
*Goal: Create a minimal functional app to serve as the base for infrastructure work.*

- [X] **Database & Backend Implementation (Code-First Approach)**
    - [x] Initialize Flask and SQLAlchemy.
    - [x] Define a Python Class `AuthUser` in `models.py`.
    - [x] **Challenge:** Do not create the table in MySQL Workbench. Use `db.create_all()` inside your Flask app context to generate the table automatically upon startup.
    - [X] Create endpoints: `GET /auth_users` and `POST /auth_users`.
- [X] **Frontend Implementation**
    - [X] Initialize Next.js using **pnpm** (`pnpm create next-app`).
    - [X] **Constraint:** Ensure you generate a `pnpm-lock.yaml` file, not `package-lock.json`.
    - [X] Create a simple UI to list users and a form to add a new user.
    - [X] Connect to the local Flask API.

---

## Phase 2: Standardization (Linting & Quality)
*Goal: Decouple code quality tools from the IDE so they work on any machine (and robots).*

- [X] **Frontend Quality Tools**
    - [X] Install `prettier` and `eslint-config-prettier` as dev dependencies using `pnpm add -D ...`.
    - [X] Configure `.prettierrc`.
    - [X] Add scripts to `package.json`: `"format": "prettier --write ."` and `"check-format": "prettier --check ."`.
    - [X] **Test:** Run `pnpm run format` locally to verify it works.
- [ ] **Backend Quality Tools**
    - [ ] Install `black` (formatting) and `flake8` (logic/errors) in the Python virtual environment.
    - [ ] Create `pyproject.toml` for Black configuration.
    - [ ] Freeze dependencies: `pip freeze > requirements.txt`.

---

## Phase 3: Containerization (Docker)
*Goal: Solve "It works on my machine" by creating isolated environments.*

- [ ] **Backend Dockerfile**
    - [ ] Base Image: `python:3.9-slim`.
    - [ ] Steps: Copy `requirements.txt` -> Run `pip install` -> Copy source code -> Run Flask command.
- [ ] **Frontend Dockerfile (pnpm Challenge)**
    - [ ] Base Image: `node:18-alpine`.
    - **Hint 1:** The Alpine image does not have pnpm installed. Look up Node's **"Corepack"** feature to enable it before installing dependencies.
    - **Hint 2:** You must copy `pnpm-lock.yaml` alongside `package.json`.
    - **Hint 3:** Instead of `npm install`, look for the pnpm command that ensures the installed versions match the lockfile exactly (similar to `npm ci`).
- [ ] **Orchestration (Docker Compose)**
    - [ ] Create `docker-compose.yml`.
    - [ ] Define Services: Backend, Frontend, DB (`mysql:8.0`).
- [ ] **Networking & Race Conditions**
    - [ ] Update Flask config: Change DB host from `localhost` to `db` (service name).
    - [ ] Implement a "Wait" strategy (e.g., `wait-for-it.sh` or health checks) to ensure MySQL is ready before Flask attempts to connect.

---

## Phase 4: Automation (CI/CD Pipeline)
*Goal: Create a "Robot" (GitHub Actions) that rejects bad code automatically.*

- [ ] **Workflow Setup**
    - [ ] Create file: `.github/workflows/quality-assurance.yml`.
    - [ ] Set Trigger: Run on `push` to `main` branch and `pull_request`.
- [ ] **Job 1: Backend Quality**
    1.  [ ] Spin up Ubuntu VM (`runs-on: ubuntu-latest`).
    2.  [ ] Checkout code.
    3.  [ ] Set up Python environment.
    4.  [ ] Install dependencies (`pip install -r backend/requirements.txt`).
    5.  [ ] **Run Linter:** `black ./backend --check`.
    6.  [ ] **Run Logic Check:** `flake8 ./backend`.
- [ ] **Job 2: Frontend Quality (pnpm Challenge)**
    1.  [ ] Spin up Ubuntu VM.
    2.  [ ] Set up Node.js environment.
    3.  **Hint 1:** The GitHub Action runner is a fresh VM. You need to enable pnpm here just like you did in Docker.
    4.  **Hint 2 (Optimization):** In the `actions/setup-node` step, look for the `cache` option. Configure it to cache `pnpm` dependencies so your pipeline runs faster on the second try.
    5.  [ ] Install dependencies using the frozen lockfile command.
    6.  [ ] **Run Linter:** `pnpm run check-format`.
    7.  [ ] **Run Build:** `pnpm run build`.

---

## Phase 5: Project Finish
- [ ] Project is done

## 📝 Concepts & Notes
*   **Linting:** It is "Grammarly for Code."
    *   *Prettier:* Fixes how the code looks (indentation, semicolons).
    *   *ESLint/Flake8:* Fixes how the code works (unused variables, logic errors).
*   **Infrastructure as Code:** Moving configurations out of VS Code and into files (`Dockerfile`, `.yml`) ensures the project runs identically for every developer and server.
*   **Phantom Dependencies:** pnpm is stricter than npm. It won't let you use libraries you haven't explicitly installed in `package.json`.