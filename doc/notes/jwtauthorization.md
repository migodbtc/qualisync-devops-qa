# JWT Authorization Overview

## What is JWT Authorization?

**JWT (JSON Web Token)** is a compact, URL-safe means of representing claims to be transferred between two parties. JWTs are used for securely transmitting information as a JSON object, and are commonly used for authorization and authentication in modern web applications.

### Origins & Concept

JWT was introduced as part of the OAuth 2.0 and OpenID Connect ecosystems to solve stateless authentication and authorization. Before JWT, session-based authentication required server-side storage and management of session IDs. JWT enables stateless, scalable authentication by embedding user claims directly in the token, which is cryptographically signed.

A JWT consists of three parts:
- **Header**: Specifies the token type and signing algorithm.
- **Payload**: Contains claims (user data, permissions, etc.).
- **Signature**: Verifies the token’s integrity and authenticity.

### How JWT is Used in Modern Systems

Modern systems use JWTs for:
- **Authentication**: After login, a JWT is issued to the user and sent with each request to prove identity.
- **Authorization**: JWTs can include roles/permissions, allowing APIs to check access rights.
- **Statelessness**: No need for server-side session storage; the token itself contains all necessary info.
- **Microservices**: JWTs are ideal for distributed systems, as each service can validate tokens independently.

**Typical Flow:**
1. User logs in and receives an **access token** (JWT) and a **refresh token**.
2. Access token is sent in the `Authorization` header for API requests.
3. When the access token expires, the refresh token is used to obtain a new access token.
4. CSRF tokens are used to protect state-changing requests when cookies are involved.

### How JWT Is Utilized in This Architecture

In this project:
- **Access Token**: Issued on login, stored in localStorage, used for API authentication.
- **Refresh Token**: Issued as an HttpOnly cookie, used to refresh sessions and for logout.
- **CSRF Token**: Issued as a cookie, required for POST/PUT/DELETE requests to prevent CSRF attacks.

The backend uses Flask-JWT-Extended to manage tokens, set cookies, and enforce security. The frontend sends access tokens in headers and refresh tokens/csrf tokens in cookies/headers as needed.

Unlike some modern systems, this architecture uses refresh tokens in cookies for session management and access tokens in localStorage for API calls.

---

## Glossary

- **JWT (JSON Web Token)**: A signed token containing claims, used for authentication and authorization.
- **Access Token**: Short-lived JWT used for API access, sent in the `Authorization` header.
- **Refresh Token**: Long-lived JWT used to obtain new access tokens, usually stored as an HttpOnly cookie.
- **CSRF Token**: Random token used to protect against cross-site request forgery, sent in a header for state-changing requests.
- **Authorization**: The process of determining if a user has permission to access a resource.
- **Authentication**: The process of verifying a user's identity.
- **HttpOnly Cookie**: A cookie that cannot be accessed via JavaScript, used for security.
- **Stateless Authentication**: Authentication that does not require server-side session storage.
- **Claims**: Information about a user or entity embedded in a JWT.
- **Signature**: Cryptographic proof that a JWT has not been tampered with.
- **Bearer Token**: A token sent in the `Authorization` header, typically an access token.
- **Session**: A period during which a user interacts with an application, often managed with tokens.
- **OpenID Connect**: An authentication protocol built on OAuth 2.0, often uses JWTs.
- **OAuth 2.0**: An authorization framework for granting access to resources, often uses JWTs.

---

## References

- [JWT Introduction](https://jwt.io/introduction/)
- [Flask-JWT-Extended Documentation](https://flask-jwt-extended.readthedocs.io/en/stable/)
- [OAuth 2.0 RFC](https://tools.ietf.org/html/rfc6749)
- [OpenID Connect](https://openid.net/connect/)
