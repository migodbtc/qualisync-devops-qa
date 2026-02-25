import { describe, it, expect, beforeAll } from 'vitest';

const BASE_URL = process.env.NEXT_WEB_APP_URL ?? 'http://localhost:5000';
const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL;
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD;

// Check if all required environment variables are loaded
if (!BASE_URL || !TEST_USER_EMAIL || !TEST_USER_PASSWORD) {
  describe('Auth Integration Tests', () => {
    it('should fail due to missing environment variables', () => {
      throw new Error(
        `Missing required environment variables. Ensure the following are set:
        - NEXT_WEB_APP_URL: ${BASE_URL ?? 'NOT SET'}
        - TEST_USER_EMAIL: ${TEST_USER_EMAIL ?? 'NOT SET'}
        - TEST_USER_PASSWORD: ${TEST_USER_PASSWORD ? 'SET' : 'NOT SET'}`
      );
    });
  });
}

describe('Auth Integration Tests', () => {

  describe('API reachability', () => {
    it('should have a BASE_URL defined', () => {
      expect(BASE_URL).toBeDefined();
      expect(BASE_URL.startsWith('http')).toBe(true);
    });
  });

  describe('POST /auth/login', () => {
    it('should return 400 when credentials are missing', async () => {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      expect(response.status).toBe(400);
    });

    it('should return 401 when credentials are invalid', async () => {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'nonexistent@example.com',
          password: 'wrongpassword',
        }),
      });

      expect(response.status).toBe(401);
    });

    it('should return 200 and a token when credentials are valid', async () => {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: process.env.TEST_USER_EMAIL ?? 'test@example.com',
          password: process.env.TEST_USER_PASSWORD ?? 'testpassword',
        }),
      });

      expect(response.status).toBe(200);

      const body = await response.json();
      expect(body).toHaveProperty('token');
      expect(typeof body.token).toBe('string');
    });
  });

  describe('POST /auth/register', () => {
    it('should return 400 when required fields are missing', async () => {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'incomplete@example.com' }),
      });

      expect(response.status).toBe(400);
    });

    it('should return 409 when email is already registered', async () => {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: process.env.TEST_USER_EMAIL ?? 'test@example.com',
          password: 'somepassword',
        }),
      });

      expect(response.status).toBe(409);
    });
  });

  describe('GET /auth/me', () => {
    let token: string;

    beforeAll(async () => {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: process.env.TEST_USER_EMAIL ?? 'test@example.com',
          password: process.env.TEST_USER_PASSWORD ?? 'testpassword',
        }),
      });

      if (response.ok) {
        const body = await response.json();
        token = body.token;
      }
    });

    it('should return 401 when no token is provided', async () => {
      const response = await fetch(`${BASE_URL}/auth/me`);
      expect(response.status).toBe(401);
    });

    it('should return 401 when token is invalid', async () => {
      const response = await fetch(`${BASE_URL}/auth/me`, {
        headers: { Authorization: 'Bearer invalidtoken' },
      });
      expect(response.status).toBe(401);
    });

    it('should return 200 and user data when token is valid', async () => {
      if (!token) {
        console.warn('Skipping: no valid token obtained in beforeAll');
        return;
      }

      const response = await fetch(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      expect(response.status).toBe(200);

      const body = await response.json();
      expect(body).toHaveProperty('email');
    });
  });

  describe('POST /auth/logout', () => {
    it('should return 401 when no token is provided', async () => {
      const response = await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
      });
      expect(response.status).toBe(401);
    });
  });
});