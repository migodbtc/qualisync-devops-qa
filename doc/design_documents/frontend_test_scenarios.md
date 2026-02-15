

## 🧪 Vitest (Component Tests, Frontend)

| #  | Component | Path | Type of Path | Test Scenario | Description |
|----|-----------|------|--------------|---------------|-------------|
| 1  | RootLayout | /    | 🟢 Happy Path | Root layout happy path | Renders children properly and applies the correct font classes. |
| 2  | RootLayout | /    | 🔴 Sad Path   | Root layout sad path (no children) | Renders nothing if children are missing. |
| 3  | RootLayout | /    | 🔴 Sad Path   | Root layout sad path (invalid font) | Handles an invalid font name gracefully. |
| 4  | HomePage   | /    | 🟢 Happy Path | Root page happy path | Successfully redirects to the intended route. |
| 5  | HomePage   | /    | 🔴 Sad Path   | Root page sad path | Handles unsuccessful redirect attempts appropriately. |
| 6  | AuthLayout | /auth | 🟢 Happy Path | (auth)/layout happy path | Renders children and displays the split layout with title and subtitle. |
| 7  | AuthLayout | /auth | 🔴 Sad Path   | (auth)/layout sad path | Handles errors when rendering children. |
| 8  | LoginPage  | /auth/login | 🟢 Happy Path | (auth)/login/page.tsx happy path | Renders the login form with all expected fields and labels, allows the user to enter a valid email and password, submits the form and triggers the API call with the correct payload, displays a loading state while waiting for the response, stores the access token in localStorage upon successful login, redirects the user to the /home page after successful login, does not display an error message for valid credentials, disables the "Login" button during loading, and ensures the "Register" link is visible and navigable. |
| 9  | LoginPage  | /auth/login | 🔴 Sad Path   | (auth)/login/page.tsx sad path (fields/labels) | Renders the form with missing or incorrect fields and labels. |
| 10 | LoginPage  | /auth/login | 🔴 Sad Path   | (auth)/login/page.tsx sad path (invalid credentials) | Shows an error when the user enters an invalid email or password. |
| 11 | LoginPage  | /auth/login | 🔴 Sad Path   | (auth)/login/page.tsx sad path (API fail/payload) | Handles form submission when the API call fails or the payload is incorrect. |
| 12 | LoginPage  | /auth/login | 🔴 Sad Path   | (auth)/login/page.tsx sad path (loading) | Does not display or gets stuck in the loading state. |
| 13 | LoginPage  | /auth/login | 🔴 Sad Path   | (auth)/login/page.tsx sad path (no token) | Does not store the access token in localStorage when login fails. |
| 14 | LoginPage  | /auth/login | 🔴 Sad Path   | (auth)/login/page.tsx sad path (no redirect) | Does not redirect to /home after login failure. |
| 15 | LoginPage  | /auth/login | 🔴 Sad Path   | (auth)/login/page.tsx sad path (error for valid) | Displays an error message even for valid credentials. |
| 16 | LoginPage  | /auth/login | 🔴 Sad Path   | (auth)/login/page.tsx sad path (button) | Does not disable the "Login" button during loading. |
| 17 | LoginPage  | /auth/login | 🔴 Sad Path   | (auth)/login/page.tsx sad path (register link) | The "Register" link is missing or not navigable. |
| 18 | RegisterPage | /auth/register | 🟢 Happy Path | (auth)/register/page.tsx happy path | Renders the registration form with all expected fields, labels, and checkboxes; allows the user to enter a valid email, username, password, and confirm password; allows the user to select a role; requires the user to check both compliance checkboxes (Terms & Conditions, Privacy Policy); submits the form and triggers the API call with the correct payload; displays a loading state while waiting for the response; clears the form fields and checkboxes upon successful registration; automatically logs in the user after registration; stores the access token in localStorage upon successful auto-login; redirects the user to the /home page after successful registration and login; does not display an error message for valid input and successful registration; disables the "Register" button during loading; and ensures the "Login" link is visible and navigable. |
| 19 | RegisterPage | /auth/register | 🔴 Sad Path   | (auth)/register/page.tsx sad path (fields/labels/checkboxes) | Renders the form with missing or incorrect fields, labels, or checkboxes. |
| 20 | RegisterPage | /auth/register | 🔴 Sad Path   | (auth)/register/page.tsx sad path (invalid input) | Does not allow the user to enter a valid email, username, password, or confirm password. |
| 21 | RegisterPage | /auth/register | 🔴 Sad Path   | (auth)/register/page.tsx sad path (role) | Does not allow the user to select a role. |
| 22 | RegisterPage | /auth/register | 🔴 Sad Path   | (auth)/register/page.tsx sad path (compliance) | Does not require the user to check both compliance checkboxes, or allows submission without them. |
| 23 | RegisterPage | /auth/register | 🔴 Sad Path   | (auth)/register/page.tsx sad path (API fail/payload) | Submits the form but triggers the API call with an incorrect payload, or the API call fails. |
| 24 | RegisterPage | /auth/register | 🔴 Sad Path   | (auth)/register/page.tsx sad path (loading) | Does not display a loading state, or gets stuck in the loading state. |
| 25 | RegisterPage | /auth/register | 🔴 Sad Path   | (auth)/register/page.tsx sad path (clear fields) | Does not clear the form fields and checkboxes upon successful registration. |
| 26 | RegisterPage | /auth/register | 🔴 Sad Path   | (auth)/register/page.tsx sad path (auto-login) | Does not automatically log in the user after registration. |
| 27 | RegisterPage | /auth/register | 🔴 Sad Path   | (auth)/register/page.tsx sad path (no token) | Does not store the access token in localStorage upon successful auto-login. |
| 28 | RegisterPage | /auth/register | 🔴 Sad Path   | (auth)/register/page.tsx sad path (no redirect) | Does not redirect the user to the /home page after successful registration and login. |
| 29 | RegisterPage | /auth/register | 🔴 Sad Path   | (auth)/register/page.tsx sad path (error for valid) | Displays an error message for valid input and successful registration. |
| 30 | RegisterPage | /auth/register | 🔴 Sad Path   | (auth)/register/page.tsx sad path (button) | Does not disable the "Register" button during loading. |
| 31 | RegisterPage | /auth/register | 🔴 Sad Path   | (auth)/register/page.tsx sad path (login link) | The "Login" link is missing or not navigable. |

## 🎭 Playwright (E2E Tests, Frontend)

| #  | Path | Type of Path | Test Scenario | Description |
|----|------|--------------|---------------|-------------|
| 1  | /auth/login | 🟢 Happy Path | Login happy path | User enters valid credentials, logs in, and is redirected to /home. |
| 2  | /auth/login | 🔴 Sad Path   | Login sad path (invalid email format) | User enters invalid email format and sees a validation error, cannot submit. |
| 3  | /auth/login | 🔴 Sad Path   | Login sad path (invalid characters) | User enters invalid characters in email or password and sees a validation error. |
| 4  | /auth/login | 🔴 Sad Path   | Login sad path (user not found) | User enters a valid-looking but non-existent email and sees a "user not found" error. |
| 5  | /auth/login | 🔴 Sad Path   | Login sad path (wrong password) | User enters correct email but wrong password and sees an "invalid password" error. |
| 6  | /auth/login | 🔴 Sad Path   | Login sad path (empty fields) | User leaves fields empty and tries to submit, sees required field errors. |
| 7  | /auth/login | 🔴 Sad Path   | Login sad path (server error) | Login API returns server error and user sees a generic error message. |
| 8  | /auth/login | 🔴 Sad Path   | Login sad path (network error) | Login API is unreachable and user sees a network error. |
| 9  | /auth/register | 🟢 Happy Path | Register happy path | User fills all fields correctly, agrees to terms, registers, is auto-logged in, and is redirected to /home. |
| 10 | /auth/register | 🔴 Sad Path   | Register sad path (mismatched passwords) | User enters mismatched passwords and sees a "passwords do not match" error. |
| 11 | /auth/register | 🔴 Sad Path   | Register sad path (username taken) | User tries to register with an already-used username and sees a "username taken" error. |
| 12 | /auth/register | 🔴 Sad Path   | Register sad path (email taken) | User tries to register with an already-used email and sees an "email taken" error. |
| 13 | /auth/register | 🔴 Sad Path   | Register sad path (invalid characters) | User enters invalid characters in username or email and sees a validation error. |
| 14 | /auth/register | 🔴 Sad Path   | Register sad path (password too short) | User enters a password that is too short and sees a "password too short" error. |
| 15 | /auth/register | 🔴 Sad Path   | Register sad path (empty fields) | User leaves required fields empty and sees required field errors. |
| 16 | /auth/register | 🔴 Sad Path   | Register sad path (compliance) | User does not check one or both compliance checkboxes and sees a "must agree" error. |
| 17 | /auth/register | 🔴 Sad Path   | Register sad path (server error) | Registration API returns server error and user sees a generic error message. |
| 18 | /auth/register | 🔴 Sad Path   | Register sad path (network error) | Registration API is unreachable and user sees a network error. |