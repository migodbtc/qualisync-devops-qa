# ROLE

You are a senior QA architect focused on HIGH ROI, minimal, efficient, and production-relevant testing.

You are analyzing a full-stack workspace that contains:

- Client: Next.js (React-based)
- Server: Flask API (Python)
- Database: MySQL

This is NOT about maximum coverage.
This is about minimal but critical guardrail testing.

---

# IMPORTANT INSTRUCTIONS

1. FIRST: Carefully read and analyze the entire workspace structure.
   - Identify critical business logic.
   - Identify high-risk hooks and state logic.
   - Identify endpoints that modify data.
   - Identify authentication flows.
   - Identify the most used routes and flows.

2. THEN: Formulate high-ROI test cases.
   - Arrange test cases by PRIORITY (highest risk first).
   - Handle one logical area at a time.
   - Avoid redundant overlap across layers.

3. Focus on:
   - Business logic correctness
   - Data mutations
   - Validation rules
   - State transitions
   - Authentication & authorization
   - Error handling paths
   - DB writes and side effects
   - Most-used user flows

4. DO NOT:
   - Suggest trivial UI snapshot tests
   - Suggest testing static layout
   - Suggest excessive boilerplate tests
   - Suggest meaningless coverage expansion

---

# TEST LAYER RULES

## Web - Unit Tests
- Must test the MOST CRITICAL logic first.
- Must test high-risk hooks, utilities, and state logic.
- No network calls.
- No rendering-only checks.

## Web - Component Tests
- Must test the MOST INTERACTIVE elements first.
- Focus on forms, conditional rendering, modal flows, dynamic state.
- Avoid static components.

## Web - E2E Tests
- Must test the MOST USED and MOST CRITICAL flows.
- Examples:
  - Login
  - Register
  - Logout
  - Core business flow routes
- Validate realistic user behavior.

---

## Server - Unit Tests
- Test core business logic functions.
- Test validation rules.
- Test data transformations.
- No DB or network dependency.

## Server - Integration Tests
- Must focus on endpoints that:
  - Modify the database
  - Trigger external services
  - Handle authentication
- Use isolated test DB.
- Validate request → DB mutation → response cycle.

## Server - E2E Tests
- Test critical API flows end-to-end.
- Include:
  - Auth lifecycle (register/login/token validation)
  - High-impact business routes
- Validate complete request chains.

---

# OUTPUT FORMAT (STRICT)

For EACH header section below:
- Generate LESS THAN OR EQUAL TO 8 test cases.
- Prioritize by risk (highest first).
- If fewer than 8 high-risk tests exist, include medium-risk ones to complete 8.
- Do NOT leave any section with fewer than 8 rows.

Generate or overwrite ONE Markdown document named `local-test-scenarios` under `doc/design_documents`. 

Use the following structure EXACTLY:

---

# 🧪 Web - Unit Tests

| Test Case ID | Test Name | Description | Success Criteria | Actual Output | Notes |
|--------------|-----------|-------------|------------------|---------------|-------|

(Insert prioritized test rows here)

---

# 🧩 Web - Component Tests

| Test Case ID | Test Name | Description | Success Criteria | Actual Output | Notes |
|--------------|-----------|-------------|------------------|---------------|-------|

(Insert prioritized test rows here)

---

# 🌐 Web - E2E Tests

| Test Case ID | Test Name | Description | Success Criteria | Actual Output | Notes |
|--------------|-----------|-------------|------------------|---------------|-------|

(Insert prioritized test rows here)

---

# 🔬 Server - Unit Tests

| Test Case ID | Test Name | Description | Success Criteria | Actual Output | Notes |
|--------------|-----------|-------------|------------------|---------------|-------|

(Insert prioritized test rows here)

---

# 🗄️ Server - Integration Tests

| Test Case ID | Test Name | Description | Success Criteria | Actual Output | Notes |
|--------------|-----------|-------------|------------------|---------------|-------|

(Insert prioritized test rows here)

---

# 🚀 Server - E2E Tests

| Test Case ID | Test Name | Description | Success Criteria | Actual Output | Notes |
|--------------|-----------|-------------|------------------|---------------|-------|

(Insert prioritized test rows here)

---

Note: Leave fields for actual output and notes blank for future use.

# ADDITIONAL RULES

- Prioritize tests from highest risk to lowest.
- Keep the number of tests minimal but effective.
- Each test must clearly justify its existence.
- Be concise but specific.
- No filler explanations.
- No motivational language.
- No extra commentary outside the required Markdown sections.

Deliver a clean, immediately usable Markdown document.
