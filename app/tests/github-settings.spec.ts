import { test, expect } from '@playwright/test';

test.describe('GitHub Settings Panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.github-settings', { timeout: 10000 });
  });

  test('renders login form when unauthenticated', async ({ page }) => {
    const loginForm = page.locator('.github-settings');

    await expect(loginForm).toBeVisible();
    await expect(page.locator('#github-token')).toBeVisible();
    await expect(page.locator('#github-login')).toBeVisible();
    await expect(page.locator('#github-login')).toHaveText('Login');

    const logoutBtn = page.locator('#github-logout');
    await expect(logoutBtn).not.toBeVisible();
  });

  test('shows error when login with empty token', async ({ page }) => {
    await page.locator('#github-token').fill('');
    await page.locator('#github-login').click();

    const errorDiv = page.locator('#github-login-error');
    await expect(errorDiv).toBeVisible();
    await expect(errorDiv).toHaveText('Please enter a token');
  });

  test('clears token from input after successful login', async ({ page }) => {
    const tokenInput = page.locator('#github-token');
    await tokenInput.fill('ghp_test_token');

    await page.evaluate(() => {
      (window as unknown as { github: { authenticate: (token: string) => Promise<{ success: boolean; state: { isAuthenticated: boolean; username: string } }> } }).github = {
        authenticate: async () => ({
          success: true,
          state: { isAuthenticated: true, username: 'testuser' }
        }),
        logout: async () => ({ success: true }),
        getAuthState: async () => ({ isAuthenticated: false, username: null }),
        setRepository: async () => ({ success: true }),
      };
    });

    await page.locator('#github-login').click();

    await page.waitForTimeout(500);
    await expect(tokenInput).toHaveValue('');
  });

  test('displays username after successful authentication', async ({ page }) => {
    await page.evaluate(() => {
      (window as unknown as { github: { authenticate: (token: string) => Promise<{ success: boolean; state: { isAuthenticated: boolean; username: string } }> } }).github = {
        authenticate: async () => ({
          success: true,
          state: { isAuthenticated: true, username: 'testuser' }
        }),
        logout: async () => ({ success: true }),
        getAuthState: async () => ({ isAuthenticated: false, username: null }),
        setRepository: async () => ({ success: true }),
      };
    });

    await page.locator('#github-token').fill('ghp_valid_token');
    await page.locator('#github-login').click();

    await expect(page.locator('.auth-info')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.auth-info strong')).toContainText('testuser');
  });

  test('renders logout button when authenticated', async ({ page }) => {
    await page.evaluate(() => {
      (window as unknown as { github: { authenticate: (token: string) => Promise<{ success: boolean; state: { isAuthenticated: boolean; username: string } }> } }).github = {
        authenticate: async () => ({
          success: true,
          state: { isAuthenticated: true, username: 'testuser' }
        }),
        logout: async () => ({ success: true }),
        getAuthState: async () => ({ isAuthenticated: false, username: null }),
        setRepository: async () => ({ success: true }),
      };
    });

    await page.locator('#github-token').fill('ghp_valid_token');
    await page.locator('#github-login').click();

    await expect(page.locator('#github-logout')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#github-logout')).toHaveText('Logout');
  });

  test('shows repository fields when authenticated', async ({ page }) => {
    await page.evaluate(() => {
      (window as unknown as { github: { authenticate: (token: string) => Promise<{ success: boolean; state: { isAuthenticated: boolean; username: string } }> } }).github = {
        authenticate: async () => ({
          success: true,
          state: { isAuthenticated: true, username: 'testuser' }
        }),
        logout: async () => ({ success: true }),
        getAuthState: async () => ({ isAuthenticated: false, username: null }),
        setRepository: async () => ({ success: true }),
      };
    });

    await page.locator('#github-token').fill('ghp_valid_token');
    await page.locator('#github-login').click();

    await expect(page.locator('#github-owner')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#github-repo')).toBeVisible();
    await expect(page.locator('#github-save-repo')).toBeVisible();
  });

  test('displays error message on authentication failure', async ({ page }) => {
    await page.evaluate(() => {
      (window as unknown as { github: { authenticate: (token: string) => Promise<{ success: boolean; state: { isAuthenticated: boolean; username: string } }> } }).github = {
        authenticate: async () => ({ success: false, state: { isAuthenticated: false, username: null } }),
        logout: async () => ({ success: true }),
        getAuthState: async () => ({ isAuthenticated: false, username: null }),
        setRepository: async () => ({ success: true }),
      };
    });

    await page.locator('#github-token').fill('invalid_token');
    await page.locator('#github-login').click();

    const errorDiv = page.locator('#github-login-error');
    await expect(errorDiv).toBeVisible();
    await expect(errorDiv).toHaveText('Authentication failed. Please check your token.');
  });
});
