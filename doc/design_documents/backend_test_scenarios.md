# 🧪 Backend Test Scenarios (Flask + SQLAlchemy)

## Unit Tests

| #  | Component/Function | Type      | Scenario (Path) | Description |
|----|--------------------|-----------|-----------------|-------------|
| 1  | User Model         | 🟢 Happy  | Create user     | User instance is created with valid data. |
| 2  | User Model         | 🔴 Sad    | Invalid email   | Creating user with invalid email raises error. |
| 3  | User Model         | 🔴 Sad    | Duplicate email | Creating user with duplicate email fails. |
| 4  | Auth Utils         | 🟢 Happy  | Hash password   | Password is hashed and can be verified. |
| 5  | Auth Utils         | 🔴 Sad    | Wrong password  | Verifying with wrong password fails. |
| 6  | Token Utils        | 🟢 Happy  | Generate JWT    | JWT is generated for valid user. |
| 7  | Token Utils        | 🔴 Sad    | Expired token   | Expired JWT is rejected. |
| 8  | Token Utils        | 🔴 Sad    | Invalid token   | Malformed JWT raises error. |
| 9  | DB Session         | 🟢 Happy  | Commit success  | DB session commits valid transaction. |
| 10 | DB Session         | 🔴 Sad    | Commit fail     | DB session fails on invalid transaction. |
| 11 | User CRUD          | 🟢 Happy  | Update user     | User fields update correctly. |
| 12 | User CRUD          | 🔴 Sad    | Update missing  | Updating non-existent user raises error. |
| 13 | User CRUD          | 🔴 Sad    | Delete missing  | Deleting non-existent user raises error. |
| 14 | Validation Utils   | 🟢 Happy  | Valid input     | Input passes all validation checks. |
| 15 | Validation Utils   | 🔴 Sad    | Invalid input   | Invalid input triggers validation error. |
| 16 | Role Logic         | 🔴 Sad    | Unauthorized    | Unauthorized role cannot perform admin action. |
| 17 | Email Utils        | 🔴 Sad    | Email fail      | Email sending fails gracefully. |
| 18 | Model Serialization| 🟢 Happy  | To dict         | Model serializes to dict as expected. |
| 19 | Model Serialization| 🔴 Sad    | Bad data        | Serialization fails on corrupt data. |


## Integration Tests

| #  | Endpoint/Module      | Type      | Scenario (Path)         | Description |
|----|----------------------|-----------|-------------------------|-------------|
| 1  | /auth/register       | 🟢 Happy  | Register user           | Registers new user with valid data. |
| 2  | /auth/register       | 🔴 Sad    | Duplicate email         | Registering with existing email fails. |
| 3  | /auth/register       | 🔴 Sad    | Invalid fields          | Registering with missing/invalid fields fails. |
| 4  | /auth/register       | 🔴 Sad    | Invalid role            | Registering with invalid role fails. |
| 5  | /auth/register       | 🔴 Sad    | Weak password           | Registering with weak password fails (if enforced). |
| 6  | /auth/login          | 🟢 Happy  | Login user              | Logs in user with correct credentials. |
| 7  | /auth/login          | 🔴 Sad    | Wrong password          | Login fails with incorrect password. |
| 8  | /auth/login          | 🔴 Sad    | User not found          | Login fails for non-existent user. |
| 9  | /auth/login          | 🔴 Sad    | Missing fields          | Login fails with missing email or password. |
| 10 | /auth/login          | 🔴 Sad    | Invalid email format    | Login fails with invalid email format. |
| 11 | /auth/logout         | 🟢 Happy  | Logout user             | User logs out and token is invalidated. |
| 12 | /auth/logout         | 🔴 Sad    | No session/cookie       | Logout with no session or cookie returns error. |
| 13 | /auth/logout         | 🔴 Sad    | Invalid token           | Logout with invalid/expired token fails. |
| 14 | /auth/refresh        | 🟢 Happy  | Refresh token           | User refreshes access token with valid refresh token. |
| 15 | /auth/refresh        | 🔴 Sad    | No refresh cookie       | Refresh fails with missing refresh token cookie. |
| 16 | /auth/refresh        | 🔴 Sad    | Invalid refresh token   | Refresh fails with invalid/expired refresh token. |
| 17 | /auth/session        | 🟢 Happy  | Get session info        | Authenticated user fetches session info. |
| 18 | /auth/session        | 🔴 Sad    | No refresh cookie       | Fetching session info without refresh token fails. |
| 19 | /auth/session        | 🔴 Sad    | Invalid refresh token   | Fetching session info with invalid/expired token fails. |
| 20 | /auth/login          | 🔴 Sad    | Login after logout      | Login fails if user tries to use revoked session. |
| 21 | /auth/logout         | 🔴 Sad    | Double logout           | Logging out twice returns error. |
| 22 | /auth/register       | 🔴 Sad    | Register with existing username | Registering with existing username fails. |
| 23 | /auth/login          | 🔴 Sad    | Login with empty payload| Login fails with empty request body. |
| 24 | /auth/register       | 🔴 Sad    | Register with empty payload | Register fails with empty request body. |



## E2E Tests

| #  | Scenario                  | Type      | Path              | Description |
|----|---------------------------|-----------|-------------------|-------------|
| 1  | Register                  | 🟢 Happy  | /auth/register    | User registers with valid data. |
| 2  | Login                     | 🟢 Happy  | /auth/login       | User logs in with valid credentials. |
| 3  | Refresh Token             | 🟢 Happy  | /auth/refresh     | User refreshes access token with valid refresh token. |
| 4  | Logout                    | 🟢 Happy  | /auth/logout      | User logs out and token is invalidated. |
| 5  | Session Info              | 🟢 Happy  | /auth/session     | Authenticated user fetches session info. |
| 6  | Register Duplicate Email  | 🔴 Sad    | /auth/register    | Registering with duplicate email fails. |
| 7  | Register Duplicate Username| 🔴 Sad   | /auth/register    | Registering with duplicate username fails. |
| 8  | Register Invalid Fields   | 🔴 Sad    | /auth/register    | Registering with missing/invalid fields fails. |
| 9  | Register Invalid Role     | 🔴 Sad    | /auth/register    | Registering with invalid role fails. |
| 10 | Register Empty Payload    | 🔴 Sad    | /auth/register    | Register fails with empty request body. |
| 11 | Login Wrong Password      | 🔴 Sad    | /auth/login       | Login fails with wrong password. |
| 12 | Login User Not Found      | 🔴 Sad    | /auth/login       | Login fails for non-existent user. |
| 13 | Login Missing Fields      | 🔴 Sad    | /auth/login       | Login fails with missing fields. |
| 14 | Login Invalid Email       | 🔴 Sad    | /auth/login       | Login fails with invalid email format. |
| 15 | Login Empty Payload       | 🔴 Sad    | /auth/login       | Login fails with empty request body. |
| 16 | Refresh No Cookie        | 🔴 Sad    | /auth/refresh     | Refresh fails with missing refresh token cookie. |
| 17 | Refresh Invalid Token    | 🔴 Sad    | /auth/refresh     | Refresh fails with invalid/expired refresh token. |
| 18 | Logout No Session        | 🔴 Sad    | /auth/logout      | Logout with no session or cookie returns error. |
| 19 | Logout Invalid Token     | 🔴 Sad    | /auth/logout      | Logout with invalid/expired token fails. |
| 20 | Double Logout            | 🔴 Sad    | /auth/logout      | Logging out twice returns error. |
| 21 | Session No Cookie        | 🔴 Sad    | /auth/session     | Fetching session info without refresh token fails. |
| 22 | Session Invalid Token    | 🔴 Sad    | /auth/session     | Fetching session info with invalid/expired token fails. |
| 23 | Login After Logout       | 🔴 Sad    | /auth/login       | Login fails if user tries to use revoked session. |
| 24 | Server Error Sim         | 🔴 Sad    | /auth/login       | Simulate server error and verify error handling. |

---
- 🟢 Happy Path: Expected/valid use cases.
- 🔴 Sad Path: Invalid, error, or edge cases (should be more numerous).
