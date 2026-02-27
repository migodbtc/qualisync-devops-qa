# 🦾 Project Module 3A: Agentic Architecture, Platform Engineering & Continuous Compliance

**Rationale for Creation**: Advance Qualisync with agent-driven automation, platform engineering, and DevSecOps best practices. This module focuses on architectural rules, AI-powered QA, and supply chain security.

**Objective:** Integrate agentic design, platform resilience, and continuous compliance into the project.


## 🛠 Tech Stack Context

*   **Frontend:** Next.js (TypeScript) + Tailwind CSS
*   **Backend:** Flask (Python) + SQLAlchemy + Pydantic
*   **QA:** Playwright (AI-powered)
*   **Platform:** Kubernetes (CloudNativePG)
*   **DevOps:** Pre-commit, SBOM, GitHub Actions

## Phase 1: Agentic Architecture & Copilot Integration
*Goal: Codify architectural rules and enable Copilot to act as a senior engineer, with explicit test scenario generation and automation.*

- [ ] **Create AGENTS.md in root directory**
    - [ ] Explicitly state architectural rules (e.g., Flask + SQLAlchemy, Pydantic for validation, Next.js functional components)
- [ ] **Guide Copilot to generate test scenarios for the project**
    - [ ] Generate test scenarios for component tests and e2e tests of the frontend (Next.js)
        - [ ] Finish component test scenarios
        - [ ] Finish e2e test scenarios
    - [ ] Generate test scenarios for unit, integration, and e2e tests of the backend (Flask)
        - [ ] Finish unit test scenarios
        - [ ] Finish integration test scenarios
        - [ ] Finish e2e test scenarios
- [ ] **Generate and automate test cases based on scenarios**
    - [ ] Implement test cases in Next.js under web/src/tests/ for component and e2e tests
    - [ ] Implement test cases in Flask under server/tests/ for unit, integration, and e2e tests
    - [ ] Ensure test cases reference and cover the generated   test scenarios
- [ ] Review code to familiarize with test libraries and syntax (Next.js and Flask)

---

## Phase 2: Pydantic AI for Flask API
*Goal: Adopt Pydantic AI for agent-driven API responses and schema enforcement.*

- [ ] **Define Pydantic model classes (e.g., TenantPaymentStatus)**
- [ ] **Implement agentic Flask routes**
    - [ ] Use Pydantic AI agent to interpret user goals and call SQLAlchemy tools
    - [ ] Enforce output to match Pydantic schema (structured JSON)
- [ ] **Integrate with Next.js frontend for reliable rendering**

---

## Phase 3: Platform Engineering with Kubernetes & CloudNativePG
*Goal: Demonstrate platform engineering skills by running stateful apps on Kubernetes.*

- [ ] **Deploy PostgreSQL using CloudNativePG Operator**
- [ ] **Automate failover, backups, and self-healing**
- [ ] **Showcase stateful orchestration in cloud-native environment**

---

## Phase 4: Agentic QA Automation (Playwright MCP)
*Goal: Integrate AI-powered UI testing for self-healing QA pipelines.*

- [ ] **Adopt Playwright MCP features for agentic QA**
- [ ] **Define QA goals (e.g., "Log in as admin and delete a tenant")**
- [ ] **Enable agent to interact with UI elements dynamically**
- [ ] **Achieve resilient, self-healing QA pipelines**

---

## Phase 5: Continuous Compliance & DevSecOps
*Goal: Automate supply chain security and enforce compliance in CI/CD.*

- [ ] **Install pre-commit hooks**
    - [ ] Block commits with secrets or failed linting
- [ ] **Generate SBOM in GitHub Actions**
    - [ ] List all libraries used by the app
- [ ] **Demonstrate supply chain security and DevSecOps maturity**

---

## 📝 Concepts & Notes

**Agentic Architecture:** Codifies rules for Copilot and other AI agents, ensuring code generation fits project style and requirements.

**Pydantic AI:** Enables natural language-driven API responses, enforcing strict schema validation for reliable frontend integration.

**CloudNativePG:** Kubernetes Operator for PostgreSQL, automating platform resilience (failover, backups, self-healing).

**Agentic QA:** Playwright MCP allows AI agents to perform UI testing based on goals, not brittle selectors, resulting in self-healing pipelines.

**Continuous Compliance:** Pre-commit and SBOM generation automate supply chain security, blocking risky commits and documenting dependencies for DevSecOps.