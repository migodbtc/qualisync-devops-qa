import { test, expect } from '@playwright/test';

// WE-01: Login Success Flow
test('should successfully log in with valid credentials and redirect to dashboard', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="login-email"]', 'user@example.com');
  await page.fill('[data-testid="login-password"]', 'correctpassword');
  await page.click('[data-testid="login-submit"]');
  await expect(page).toHaveURL(/dashboard/);
  // Token should be stored (simulate by checking localStorage/cookie)
});

// WE-02: Login Failure Flow
test('should display an error and prevent redirect when logging in with invalid credentials', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="login-email"]', 'user@example.com');
  await page.fill('[data-testid="login-password"]', 'wrongpassword');
  await page.click('[data-testid="login-submit"]');
  await expect(page.locator('.text-red-500')).toBeVisible();
  await expect(page).not.toHaveURL(/dashboard/);
});

// WE-03: Register Success Flow
test('should register a new user with valid data, check all compliance boxes, and redirect to login', async ({ page }) => {
  await page.goto('/register');
  await page.fill('[data-testid="register-email"]', 'newuser@example.com');
  await page.fill('[data-testid="register-password"]', 'validpassword');
  await page.fill('[data-testid="register-confirm-password"]', 'validpassword');
  await page.fill('input[name="username"]', 'newuser');
  await page.check('[data-testid="register-tnc"]');
  await page.check('[data-testid="register-privacy"]');
  await page.click('[data-testid="register-submit"]');
  await expect(page).toHaveURL(/login/);
  // Success message is not rendered, as registration redirects to login
});

// WE-04: Register Failure Flow
test('should show an error and prevent registration when required fields or compliance boxes are missing or invalid', async ({ page }) => {
  await page.goto('/register');
  await page.fill('[data-testid="register-email"]', 'bademail');
  await page.fill('[data-testid="register-password"]', 'short');
  await page.fill('[data-testid="register-confirm-password"]', 'short');
  await page.fill('input[name="username"]', 'baduser');
  // Do not check TnC/Privacy to trigger error
  await page.click('[data-testid="register-submit"]');
  await expect(page.locator('.text-red-500')).toBeVisible();
  await expect(page).not.toHaveURL(/login/);
});

// WE-05: Logout Flow
test('should log out the user from an authenticated session and redirect to login', async ({ page }) => {
  // Assume user is logged in
  await page.goto('/dashboard');
  await page.click('button[aria-label="logout"]');
  await expect(page).toHaveURL(/auth\/login/);
  // Token should be cleared
});

// WE-06: Protected Route Access
test('should redirect unauthenticated users to login when accessing a protected route', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/auth\/login/);
});

// WE-07: Session Persistence
test('should persist user session after login and maintain dashboard access after page reload', async ({ page }) => {
  // Simulate login and refresh
  await page.goto('/login');
  await page.fill('[data-testid="login-email"]', 'user@example.com');
  await page.fill('[data-testid="login-password"]', 'correctpassword');
  await page.click('[data-testid="login-submit"]');
  await expect(page).toHaveURL(/dashboard/);
  await page.reload();
  await expect(page).toHaveURL(/dashboard/);
});

// WE-08: Password Reset Request
test('should allow a user to request a password reset and display confirmation', async ({ page }) => {
  await page.goto('/login');
  await page.click('text=Forgot Password');
  await page.fill('input[name="email"]', 'user@example.com');
  await page.click('button[type="submit"]');
  await expect(page.locator('.confirmation-message')).toBeVisible();
});
