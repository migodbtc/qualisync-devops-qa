# Project Roadmap: Infrastructure & DevOps Prototype

## 🛠 Tech Stack
*   **Frontend:** Next.js (TypeScript) + Tailwind CSS
*   **Backend:** Flask (Python)
*   **ORM:** SQLAlchemy
*   **Database:** MySQL

---

## Phase 1: The "Walking Skeleton" (Local Build)
*Goal: Create a minimal functional app to serve as the base for infrastructure work.*

- [ ] **Database Setup**
    - Create a local MySQL database.
    - Create a simple table `auth_users` (migrated from previous projects).
- [ ] **Backend Implementation**
    - Initialize Flask.
    - Create endpoints: `GET /auth_users` and `POST /auth_users`.
    - Connect Flask to local MySQL using SQLAlchemy.
- [ ] **Frontend Implementation**
    - Initialize Next.js.
    - Create a simple UI to list users and a form to add a new user.
    - Connect to the local Flask API.

---

## Phase 2: Standardization (Linting & Quality)
*Goal: Decouple code quality tools from the IDE so they work on any machine (and robots).*

- [ ] **Frontend Quality Tools**
    - Install `prettier` and `eslint-config-prettier` as dev dependencies (`npm install -D ...`).
    - Configure `.prettierrc`.
    - Add scripts to `package.json`: `"format": "prettier --write ."` and `"check-format": "prettier --check ."`.
- [ ] **Backend Quality Tools**
    - Install `black` (formatting) and `flake8` (logic/errors) in the Python virtual environment.
    - Create `pyproject.toml` for Black configuration.
    - Freeze dependencies: `pip freeze > requirements.txt`.

---

## Phase 3: Containerization (Docker)
*Goal: Solve "It works on my machine" by creating isolated environments.*

- [ ] **Backend Dockerfile**
    - Base Image: `python:3.9-slim` (Low file size).
    - Steps: Copy `requirements.txt` -> Run `pip install` -> Copy source code -> Run Flask command.
- [ ] **Frontend Dockerfile**
    - Base Image: `node:18-alpine` (Lightweight Linux).
    - Steps: Copy `package.json` -> Run `npm install` -> Copy source code -> Run `npm run dev`.
- [ ] **Orchestration (Docker Compose)**
    - Create `docker-compose.yml`.
    - **Service 1: Backend** (Port 5000:5000).
    - **Service 2: Frontend** (Port 3000:3000).
    - **Service 3: DB** (Image `mysql:8.0`).
- [ ] **Networking & Race Conditions**
    - Update Flask config: Change DB host from `localhost` to `db` (service name).
    - Implement a "Wait" strategy (e.g., `wait-for-it.sh` or health checks) to ensure MySQL is ready before Flask attempts to connect.

---

## Phase 4: Automation (CI/CD Pipeline)
*Goal: Create a "Robot" (GitHub Actions) that rejects bad code automatically.*

- [ ] **Workflow Setup**
    - Create file: `.github/workflows/quality-assurance.yml`.
    - Set Trigger: Run on `push` to `main` branch and `pull_request`.
- [ ] **Job 1: Backend Quality**
    1.  Spin up Ubuntu VM (`runs-on: ubuntu-latest`).
    2.  Checkout code.
    3.  Set up Python environment.
    4.  Install dependencies (`pip install -r backend/requirements.txt`).
    5.  **Run Linter:** `black ./backend --check` (Fails if formatting is bad).
    6.  **Run Logic Check:** `flake8 ./backend` (Fails if logic errors exist).
- [ ] **Job 2: Frontend Quality**
    1.  Spin up Ubuntu VM.
    2.  Set up Node.js environment.
    3.  Install dependencies (`npm install` inside frontend dir).
    4.  **Run Linter:** `npm run check-format` (Executes the Prettier check script created in Phase 2).
    5.  **Run Build:** `npm run build` (Catches TypeScript errors and compilation issues).

---

## 📝 Concepts & Notes
*   **Linting:** It is "Grammarly for Code."
    *   *Prettier:* Fixes how the code looks (indentation, semicolons).
    *   *ESLint/Flake8:* Fixes how the code works (unused variables, logic errors).
*   **Infrastructure as Code:** Moving configurations out of VS Code and into files (`Dockerfile`, `.yml`) ensures the project runs identically for every developer and server.