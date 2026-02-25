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

## Coding Style

To maintain consistency and quality across the codebase, follow these coding style guidelines. Always review the necessary files line by line before making changes, and scour other files for relevant information to ensure your changes are well-informed and do not introduce unnecessary complexity.

### General
- Follow the **KISS (Keep It Simple, Stupid)** principle: Write code that is simple, clear, and easy to understand.
- Avoid duplicating code by adhering to the **DRY (Don't Repeat Yourself)** principle. Refactor common logic into reusable functions or modules.
- Design code with **SOLID** principles in mind:
  - **S**ingle Responsibility: Each function, class, or module should have one clear responsibility.
  - **O**pen/Closed: Code should be open for extension but closed for modification.
  - **L**iskov Substitution: Subtypes should be replaceable without altering the correctness of the program.
  - **I**nterface Segregation: Avoid forcing classes to implement unnecessary methods.
  - **D**ependency Inversion: Depend on abstractions, not concrete implementations.
- Avoid adding features or code that is not immediately necessary, following the **YAGNI (You Aren't Gonna Need It)** principle.
- Use meaningful and descriptive variable, function, and class names.
- Write comments for complex logic or non-obvious code, but avoid unnecessary comments. Let the code speak for itself.
- Keep functions and methods small and focused on a single responsibility.

### Frontend (web/)
- Follow the ESLint and Prettier rules configured in the project.
- Use TypeScript for type safety and avoid using `any` unless absolutely necessary.
- Prefer functional components over class components in React.
- Use Tailwind CSS utility classes for styling, and avoid inline styles unless necessary.
- Organize components in the `components/` directory and group related files together.
- Avoid over-engineering components. Start with the simplest solution and refactor only when necessary.

### Backend (server/)
- Follow the Black and Flake8 rules configured in the project.
- Use type hints in Python wherever possible to improve readability and maintainability.
- Keep functions and methods small and modular, adhering to the **Single Responsibility Principle**.
- Follow the PEP 8 style guide for Python code.
- Use SQLAlchemy ORM for database interactions and avoid raw SQL queries unless absolutely necessary.
- Avoid premature optimization. Focus on writing clear and correct code first.

### File and Directory Structure
- Use kebab-case for filenames in the frontend (e.g., `my-component.tsx`).
- Use snake_case for Python files in the backend (e.g., `my_module.py`).
- Place test files in the `tests/` directory at the root level, mirroring the structure of the `src/` directory.
- Keep related files grouped together to improve discoverability and maintainability.

### Commit Messages
- Use clear and concise commit messages that describe the purpose of the change.
- Follow the PR title format: `[web] <Title>` or `[server] <Title>`.

> **Note:** Always run the linters and formatters (`pnpm lint`, `black`, etc.) before committing to ensure adherence to the coding style.