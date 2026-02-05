# 🚀 Initial Project Module: Infrastructure & DevOps Prototype 
**Rationale for Creation**: Developer wishes to learn about the practice of DevOps development, quality assurance, automation, SDLC integration, and more to expand his skillset towards quality software engineering.
**Objective:** Create a project that's less on development-focused but rather infrastructure or automation-focused this time.

## 🛠 Tech Stack
*   **Frontend:** Next.js (TypeScript) + Tailwind CSS
*   **Backend:** Flask (Python)
*   **ORM:** SQLAlchemy
*   **Database:** SQLite
*   **Package Manager:** pnpm (Performance NPM)

---

## 🦴 Phase 1: The "Walking Skeleton" (Local Build)
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

## 🧹 Phase 2: Standardization (Linting & Quality)
*Goal: Decouple code quality tools from the IDE so they work on any machine (and robots).*

- [X] **Frontend Quality Tools**
    - [X] Install `prettier` and `eslint-config-prettier` as dev dependencies using `pnpm add -D ...`.
    - [X] Configure `.prettierrc`.
    - [X] Add scripts to `package.json`: `"format": "prettier --write ."` and `"check-format": "prettier --check ."`.
    - [X] **Test:** Run `pnpm run format` locally to verify it works.
- [X] **Backend Quality Tools**
    - [X] Install `black` (formatting) and `flake8` (logic/errors) in the Python virtual environment.
    - [X] Create `pyproject.toml` for Black configuration.
    - [X] Freeze dependencies: `pip freeze > requirements.txt`.

---


## 🐳 Phase 3: Containerization (Docker)
*Goal: Solve "It works on my machine" by creating isolated environments.*

- [X] **Backend Dockerfile**
    - [X] Base Image: `python:3.9-slim`.
    - [X] Steps: Copy `requirements.txt` -> Run `pip install` -> Copy source code -> Run Flask command.
- [X] **Frontend Dockerfile (pnpm Challenge)**
    - [X] Base Image: `node:18-alpine`.
    - **Hint 1:** The Alpine image does not have pnpm installed. Look up Node's **"Corepack"** feature to enable it before installing dependencies.
    - **Hint 2:** You must copy `pnpm-lock.yaml` alongside `package.json`.
    - **Hint 3:** Instead of `npm install`, look for the pnpm command that ensures the installed versions match the lockfile exactly (similar to `npm ci`).
- [X] **Orchestration (Docker Compose)**
    - [X] Create `docker-compose.yml`.
    - [X] Define Services: Backend, Frontend

---


## 🤖 Phase 4: Automation (CI/CD Pipeline)
*Goal: Create a "Robot" (GitHub Actions) that rejects bad code automatically.*

- [X] **Workflow Setup**
    - [X] Create file: `.github/workflows/quality-assurance.yml`.
    - [X] Set Trigger: Run on `push` to `main` branch and `pull_request`.
- [X] **Job 1: Backend Quality**
    1.  [X] Spin up Ubuntu VM (`runs-on: ubuntu-latest`).
    2.  [X] Checkout code.
    3.  [X] Set up Python environment.
    4.  [X] Install dependencies (`pip install -r backend/requirements.txt`).
    5.  [X] **Run Linter:** `black ./backend --check`.
    6.  [X] **Run Logic Check:** `flake8 ./backend`.
- [X] **Job 2: Frontend Quality (pnpm Challenge)**
    1.  [X] Spin up Ubuntu VM.
    2.  [X] Set up Node.js environment.
    3.  **Hint 1:** The GitHub Action runner is a fresh VM. You need to enable pnpm here just like you did in Docker.
    4.  **Hint 2 (Optimization):** In the `actions/setup-node` step, look for the `cache` option. Configure it to cache `pnpm` dependencies so your pipeline runs faster on the second try.
    5.  [X] Install dependencies using the frozen lockfile command.
    6.  [X] **Run Linter:** `pnpm run check-format`.
    7.  [X] **Run Build:** `pnpm run build`.

---

## 🏁 Phase 5: Project Finish
- [X] Project is done 🎉


## 📝 Concepts & Notes


**Linting:** The automated process of analyzing source code to flag programming errors, bugs, stylistic errors, and suspicious constructs. Linting tools help maintain code quality and consistency across a codebase.
| Tool      | Definition & Purpose                                                                 | Industry Usage (2026)                                                                 |
|-----------|--------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------|
| Prettier  | Code formatter for JS/TS and more; enforces consistent style                        | Ubiquitous in JS/TS projects; default in many frameworks (React, Next.js, etc.)       |
| ESLint    | Linter for JS/TS; finds errors, enforces standards, highly configurable             | Industry standard for JS/TS linting; integrated in most modern web dev toolchains     |
| Flake8    | Python linter for style (PEP 8), errors, complexity                                 | Common in Python open source and enterprise; often paired with Black                  |
| Black     | Python code formatter; auto-formats to a consistent style                           | Rapidly adopted in Python community; default in many new Python repos                 |


**Infrastructure as Code (IaC):** The practice of managing and provisioning infrastructure through code and configuration files, rather than manual processes. IaC enables repeatable, consistent, and automated environment setup, reducing human error and improving scalability.

**(IaC) Local Repository Example:**
- This project uses Dockerfiles and docker-compose.yml to define and orchestrate both backend and frontend services. All environment setup, dependencies, and service definitions are version-controlled and reproducible by anyone with Docker and Docker Compose.
- Example files: `server/Dockerfile`, `web/Dockerfile`, `docker-compose.yml`.

**(IaC) Modern Industry-Grade Examples:**
- **Terraform:** Widely used for provisioning cloud infrastructure (AWS, Azure, GCP) as code. Example: Defining a scalable Kubernetes cluster or managed database in a .tf file, then applying it with `terraform apply`.
- **Azure Bicep:** A domain-specific language for deploying Azure resources, used in enterprise environments for declarative, repeatable deployments.
- **AWS CloudFormation:** YAML/JSON templates to automate AWS resource creation, used by organizations for infrastructure automation and compliance.
- **GitOps:** Modern IaC practice where infrastructure changes are managed via Git repositories and automatically applied by CI/CD pipelines (e.g., using ArgoCD or Flux for Kubernetes).

**(IaC) Best Practices:**
- Store all infrastructure definitions in version control (Git).
- Use automated CI/CD pipelines to apply infrastructure changes.
- Prefer declarative tools (Terraform, Bicep, CloudFormation) for cloud resources.
- Use Docker Compose or Kubernetes manifests for container orchestration.

**.yaml / .yml:** Both are file extensions for YAML (YAML Ain't Markup Language), a human-readable data serialization format used for configuration files. `.yml` and `.yaml` are functionally identical; usage is a matter of convention.

**Docker:** A platform for developing, shipping, and running applications in lightweight, portable containers. It enables consistent environments across development, testing, and production.

**Docker Image:** A read-only template with instructions for creating a Docker container. Images are built from Dockerfiles and can be shared via registries.

**Docker Container:** A runnable instance of a Docker image. Containers are isolated, lightweight, and ephemeral, running the application and its dependencies.

**Docker Compose / Orchestration:** Docker Compose is a tool for defining and running multi-container Docker applications using a YAML file (`docker-compose.yml`). Orchestration refers to managing multiple containers/services together, including networking and volumes.

**GitHub Actions:** A CI/CD platform that automates workflows for building, testing, and deploying code directly from GitHub repositories. Workflows are defined in YAML files under `.github/workflows/`.

**GitHub Actions Jobs:** Individual units of work within a workflow. Each job runs in its own virtual environment and can have multiple steps (e.g., install, lint, test, build).

**GitHub Actions vs Local Machine Checking:** GitHub Actions run workflows in isolated, clean virtual machines, ensuring consistency and catching issues that may not appear on a developer's local setup. Local checks may pass due to cached dependencies or environment differences.

**pnpm-lock.yaml:** Lockfile generated by pnpm to ensure consistent dependency versions across all environments. It records the exact versions installed, enabling reproducible builds.

**pnpm-workspace.yaml:** Configuration file for pnpm workspaces, allowing management of multiple packages/projects in a monorepo. It defines which directories are part of the workspace and enables shared dependency management.