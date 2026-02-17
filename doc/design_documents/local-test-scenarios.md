# 🧪 Web - Unit Tests

| Test Case ID | Test Name | Description | Success Criteria | Actual Output | Notes |
|--------------|-----------|-------------|------------------|---------------|-------|
| WU-01 | useLogin Hook Validation | Validate login hook handles state, errors, and success correctly | State updates, error handling, and success callback work as expected |  |  |
| WU-02 | useRegister Hook Validation | Validate register hook handles state, errors, and success correctly | State updates, error handling, and success callback work as expected |  |  |
| WU-03 | Auth State Management | Test authentication state logic for login/logout transitions | State reflects correct auth status after login/logout |  |  |
| WU-04 | Input Validation Utility | Test input validation for login/register forms | Invalid inputs are rejected, valid inputs pass |  |  |
| WU-05 | Token Storage Utility | Test token storage and retrieval logic | Tokens are stored, retrieved, and cleared correctly |  |  |
| WU-06 | Error Handling Utility | Test error handling logic for auth flows | Errors are caught and displayed properly |  |  |
| WU-07 | Password Hash Utility | Test password hashing logic (if present) | Hashing produces expected output, rejects invalid input |  |  |
| WU-08 | Auth Redirect Logic | Test redirect logic for protected routes | Unauthenticated users are redirected, authenticated users access |  |  |

---

# 🧩 Web - Component Tests

| Test Case ID | Test Name | Description | Success Criteria | Actual Output | Notes |
|--------------|-----------|-------------|------------------|---------------|-------|
| WC-01 | Login Form Interaction | Test login form input, error display, and submit | Inputs update, errors show, submit triggers login |  |  |
| WC-02 | Register Form Interaction | Test register form input, error display, and submit | Inputs update, errors show, submit triggers register |  |  |
| WC-03 | Login Button State | Test login button enabled/disabled based on input validity | Button disables for invalid input, enables for valid |  |  |
| WC-04 | Register Button State | Test register button enabled/disabled based on input validity | Button disables for invalid input, enables for valid |  |  |
| WC-05 | Auth Error Modal | Test modal displays for auth errors | Modal appears for errors, closes on action |  |  |
| WC-06 | Password Visibility Toggle | Test password field visibility toggle in forms | Toggle switches input type, maintains value |  |  |
| WC-07 | Auth Loading Spinner | Test spinner appears during login/register | Spinner shows during async, hides after |  |  |
| WC-08 | Auth Redirect Component | Test redirect component for protected routes | Redirects unauthenticated, allows authenticated |  |  |

---

# 🌐 Web - E2E Tests

| Test Case ID | Test Name | Description | Success Criteria | Actual Output | Notes |
|--------------|-----------|-------------|------------------|---------------|-------|
| WE-01 | Login Success Flow | User logs in with valid credentials | Redirects to dashboard, token stored |  |  |
| WE-02 | Login Failure Flow | User attempts login with invalid credentials | Error message shown, no redirect |  |  |
| WE-03 | Register Success Flow | User registers with valid data | Redirects to login, success message shown |  |  |
| WE-04 | Register Failure Flow | User registers with invalid data | Error message shown, no account created |  |  |
| WE-05 | Logout Flow | User logs out from authenticated session | Token cleared, redirected to login |  |  |
| WE-06 | Protected Route Access | Unauthenticated user tries to access dashboard | Redirected to login, no access |  |  |
| WE-07 | Session Persistence | User remains logged in after refresh | Token persists, dashboard accessible |  |  |
| WE-08 | Password Reset Request | User requests password reset (if present) | Reset email sent, confirmation shown |  |  |

---

# 🔬 Server - Unit Tests

| Test Case ID | Test Name | Description | Success Criteria | Actual Output | Notes |
|--------------|-----------|-------------|------------------|---------------|-------|
| SU-01 | Login Logic Function | Test login function for valid/invalid credentials | Returns token for valid, error for invalid |  |  |
| SU-02 | Register Logic Function | Test register function for valid/invalid input | Creates user for valid, error for invalid |  |  |
| SU-03 | Password Hash Function | Test password hashing and verification | Hashes and verifies passwords correctly |  |  |
| SU-04 | Token Generation Function | Test JWT token generation logic | Generates valid token for user |  |  |
| SU-05 | Token Validation Function | Test JWT token validation logic | Validates token, rejects invalid/expired |  |  |
| SU-06 | Input Validation Function | Test input validation for auth endpoints | Rejects invalid input, accepts valid |  |  |
| SU-07 | Error Handling Function | Test error handling for auth logic | Returns correct error messages |  |  |
| SU-08 | Auth State Transition Function | Test state transitions for login/logout | State updates correctly on login/logout |  |  |

---

# 🗄️ Server - Integration Tests

| Test Case ID | Test Name | Description | Success Criteria | Actual Output | Notes |
|--------------|-----------|-------------|------------------|---------------|-------|
| SI-01 | Login Endpoint DB Mutation | Test login endpoint updates session/token in DB | DB updated, token returned |  |  |
| SI-02 | Register Endpoint DB Mutation | Test register endpoint creates user in DB | User created, DB updated |  |  |
| SI-03 | Token Validation Endpoint | Test token validation endpoint with valid/invalid token | Valid token accepted, invalid rejected |  |  |
| SI-04 | Logout Endpoint DB Mutation | Test logout endpoint clears session/token | DB updated, session cleared |  |  |
| SI-05 | Auth Error Response | Test error responses for auth endpoints | Returns correct error codes/messages |  |  |
| SI-06 | Input Validation Endpoint | Test input validation for login/register endpoints | Invalid input rejected, valid accepted |  |  |
| SI-07 | Password Reset Endpoint | Test password reset endpoint (if present) | DB updated, reset token sent |  |  |
| SI-08 | Auth Rate Limiting | Test rate limiting on auth endpoints | Excess requests blocked, error returned |  |  |

---

# 🚀 Server - E2E Tests

| Test Case ID | Test Name | Description | Success Criteria | Actual Output | Notes |
|--------------|-----------|-------------|------------------|---------------|-------|
| SE-01 | Register → Login → Dashboard | User registers, logs in, accesses dashboard | All steps succeed, token persists |  |  |
| SE-02 | Login → Protected Route | User logs in, accesses protected route | Access granted, data returned |  |  |
| SE-03 | Invalid Login Attempt | User attempts login with invalid credentials | Error returned, no access |  |  |
| SE-04 | Token Expiry Flow | User token expires, access denied | Access denied, error shown |  |  |
| SE-05 | Logout Flow | User logs out, session cleared | Session/token cleared, access denied |  |  |
| SE-06 | Password Reset Flow | User requests password reset, completes flow | Reset succeeds, user can login |  |  |
| SE-07 | Register Duplicate Email | User registers with existing email | Error returned, no account created |  |  |
| SE-08 | Auth Error Handling | User triggers auth errors, receives correct responses | Correct error codes/messages returned |  |  |

---

# Note: Leave fields for actual output and notes blank for future use.
# 