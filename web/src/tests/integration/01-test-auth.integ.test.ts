import { describe, it, expect, beforeAll, afterAll } from "vitest";

const BASE_URL =
  process.env.NEXT_PUBLIC_FLASK_API_URL
const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL ?? "testuser@example.com";
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD ?? "testpassword";

// Check if all required environment variables are loaded
if (!BASE_URL || !TEST_USER_EMAIL || !TEST_USER_PASSWORD) {
  describe("Auth Integration Tests", () => {
    it("should fail due to missing environment variables", () => {
      throw new Error(
        `Missing required environment variables. Ensure the following are set:
        - NEXT_WEB_APP_URL: ${BASE_URL ?? "NOT SET"}
        - TEST_USER_EMAIL: ${TEST_USER_EMAIL ?? "NOT SET"}
        - TEST_USER_PASSWORD: ${TEST_USER_PASSWORD ? "SET" : "NOT SET"}`,
      );
    });
  });
}

describe("Auth Integration Tests", () => {
  // Use a unique email per run so we never collide with a leftover DB record
  const runId = Date.now();
  const registeredEmail = `testuser+${runId}@example.com`;
  const registeredPassword = TEST_USER_PASSWORD;

  describe("POST /auth/register", () => {
    it("should return 400 when required fields are missing", async () => {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "incomplete@example.com" }),
      });

      expect(response.status).toBe(400);
    });

    it("should register a new user successfully", async () => {
      // beforeAll ensures the account is deleted; this registers it fresh
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: registeredEmail,
          password: registeredPassword,
        }),
      });

      expect(response.status).toBe(201);
    });

    it("should return 409 when email is already registered", async () => {
      // User was just registered in the previous test
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: registeredEmail,
          password: registeredPassword,
        }),
      });

      expect(response.status).toBe(409);
    });
  });

  describe("POST /auth/login", () => {
    it("should return 400 when credentials are missing", async () => {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      expect(response.status).toBe(400);
    });

    it("should return 401 when credentials are invalid", async () => {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "nonexistent@example.com",
          password: "wrongpassword",
        }),
      });

      expect(response.status).toBe(401);
    });

    it("should return 200 and a token when credentials are valid", async () => {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: registeredEmail,
          password: registeredPassword,
        }),
      });

      expect(response.status).toBe(200);

      const body = await response.json();
      expect(body).toHaveProperty("access_token");
      expect(typeof body.access_token).toBe("string");
    });
  });

  describe("GET /auth/me", () => {
    let token: string;

    beforeAll(async () => {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: registeredEmail,
          password: registeredPassword,
        }),
      });

      if (response.ok) {
        const body = await response.json();
        token = body.access_token;
      }
    });

    it("should return 401 when no token is provided", async () => {
      const response = await fetch(`${BASE_URL}/auth/me`);
      expect(response.status).toBe(401);
    });

    it("should return 401 when token is invalid", async () => {
      const response = await fetch(`${BASE_URL}/auth/me`, {
        headers: { Authorization: "Bearer invalidtoken" },
      });
      expect(response.status).toBe(401);
    });

    it("should return 200 and user data when token is valid", async () => {
      if (!token) {
        console.warn("Skipping: no valid token obtained in beforeAll");
        return;
      }

      const response = await fetch(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      expect(response.status).toBe(200);

      const body = await response.json();
      expect(body).toHaveProperty("email");
    });
  });

  describe("POST /auth/logout", () => {
    it("should return 401 when no token is provided", async () => {
      const response = await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
      });
      expect(response.status).toBe(401);
    });
  });

  afterAll(async () => {
    // Delete test account by credentials — no JWT dance needed
    const response = await fetch(`${BASE_URL}/auth/delete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: registeredEmail,
        password: registeredPassword,
      }),
    });

    if (response.status !== 200) {
      console.error(`Failed to delete test account: ${await response.text()}`);
    } else {
      console.log(
        `Test account with email ${registeredEmail} deleted successfully.`,
      );
    }
  });
});
