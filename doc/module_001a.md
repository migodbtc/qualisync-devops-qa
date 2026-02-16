# Sudden Module: Integrating ESLint into DevOps Pipeline
**Rationale for Creation**: Developer notices that there is something missing within the initial module, which is that ESLint is downloaded and mentioned but there are no instructions for integration and utilization.
**Objective:** Add ESLint to the project for code quality and logic checks, following a DevOps approach.

## 🛠 Tech Stack Context
*   **Frontend:** Next.js (TypeScript) + Tailwind CSS
*   **Backend:** Flask (Python)
*   **Package Manager:** pnpm

---


## Phase 1: ESLint Setup (Local)
*Goal: Add ESLint to the project and configure it for TypeScript/Next.js.*

- [X] **Install ESLint and Plugins**
    - [X] Use pnpm to add ESLint and recommended plugins as dev dependencies.
- [X] **Initialize ESLint Config**
    - [X] Run the ESLint init command and select options for Next.js/TypeScript.
    - [X] Adjust config to work with Prettier (extend eslint-config-prettier).
- [X] **Test ESLint Locally**
    - [X] Run ESLint on your codebase to check for issues.

---


## Phase 2: Automation Scripts
*Goal: Add scripts to package.json for easy linting.*

- [X] **Add Lint Scripts**
    - [X] Add a script to run ESLint on all relevant files.
    - [X] Add a script to auto-fix issues with ESLint.

---

## Phase 3: CI/CD Integration
*Goal: Ensure ESLint runs in the pipeline for every push/PR.*

- [X] **Update GitHub Actions Workflow**
    - [X] Add a step to run ESLint in the frontend quality job.
    - [X] Make the pipeline fail if lint errors are found.

---

## Phase 4: Project Finish
- [X] Module complete

## 📝 Notes
*   **ESLint:** Checks code for errors, best practices, and style issues beyond formatting.
*   **DevOps:** Integrating ESLint into scripts and CI/CD ensures code quality is enforced everywhere, not just in your editor.
