const mockGetAuthState = jest.fn();
const mockAuthenticate = jest.fn();
const mockLogout = jest.fn();
const mockSetRepository = jest.fn();

(global.window as unknown as Record<string, unknown>).github = {
  getAuthState: () => mockGetAuthState(),
  authenticate: (token: string) => mockAuthenticate(token),
  logout: () => mockLogout(),
  setRepository: (config: { owner: string; repo: string }) => mockSetRepository(config),
};

import { GitHubSettingsPanel } from '../../renderer/github-settings';

describe('GitHubSettingsPanel', () => {
  let container: HTMLElement;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAuthState.mockResolvedValue({ isAuthenticated: false, username: null });

    container = document.createElement('div');
    container.id = 'test-container';
    new GitHubSettingsPanel(container);
  });

  describe('Initial Render', () => {
    it('renders login form when unauthenticated', async () => {
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(container.querySelector('#github-token')).toBeTruthy();
      expect(container.querySelector('#github-login')).toBeTruthy();
      expect(container.querySelector('#github-login')?.textContent).toBe('Login');
    });

    it('does not show logout button when unauthenticated', async () => {
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(container.querySelector('#github-logout')).toBeNull();
    });
  });

  describe('handleLogin', () => {
    it('shows error when login with empty token', async () => {
      await new Promise(resolve => setTimeout(resolve, 100));

      const tokenInput = container.querySelector('#github-token') as HTMLInputElement;
      tokenInput.value = '';

      const loginBtn = container.querySelector('#github-login') as HTMLButtonElement;
      loginBtn.click();

      await new Promise(resolve => setTimeout(resolve, 100));

      const errorDiv = container.querySelector('#github-login-error');
      expect(errorDiv?.textContent).toBe('Please enter a token');
    });

    it('calls authenticate with token from input', async () => {
      await new Promise(resolve => setTimeout(resolve, 100));

      mockAuthenticate.mockResolvedValue({
        success: true,
        state: { isAuthenticated: true, username: 'testuser' },
      });

      const tokenInput = container.querySelector('#github-token') as HTMLInputElement;
      tokenInput.value = 'ghp_test_token';

      const loginBtn = container.querySelector('#github-login') as HTMLButtonElement;
      loginBtn.click();

      await new Promise(resolve => setTimeout(resolve, 200));

      expect(mockAuthenticate).toHaveBeenCalledWith('ghp_test_token');
    });

    it('displays error on authentication failure', async () => {
      await new Promise(resolve => setTimeout(resolve, 100));

      mockAuthenticate.mockResolvedValue({
        success: false,
        state: { isAuthenticated: false, username: null },
      });

      const tokenInput = container.querySelector('#github-token') as HTMLInputElement;
      tokenInput.value = 'invalid_token';

      const loginBtn = container.querySelector('#github-login') as HTMLButtonElement;
      loginBtn.click();

      await new Promise(resolve => setTimeout(resolve, 200));

      const errorDiv = container.querySelector('#github-login-error');
      expect(errorDiv?.textContent).toBe('Authentication failed. Please check your token.');
    });
  });

  describe('Authenticated State', () => {
    it('shows username after successful authentication', async () => {
      mockAuthenticate.mockResolvedValue({
        success: true,
        state: { isAuthenticated: true, username: 'testuser' },
      });

      await new Promise(resolve => setTimeout(resolve, 100));

      const tokenInput = container.querySelector('#github-token') as HTMLInputElement;
      tokenInput.value = 'valid_token';
      const loginBtn = container.querySelector('#github-login') as HTMLButtonElement;
      loginBtn.click();

      await new Promise(resolve => setTimeout(resolve, 200));

      const usernameStrong = container.querySelector('.auth-info strong');
      expect(usernameStrong?.textContent).toBe('testuser');
    });

    it('shows logout button when authenticated', async () => {
      mockAuthenticate.mockResolvedValue({
        success: true,
        state: { isAuthenticated: true, username: 'testuser' },
      });

      await new Promise(resolve => setTimeout(resolve, 100));

      const tokenInput = container.querySelector('#github-token') as HTMLInputElement;
      tokenInput.value = 'valid_token';
      const loginBtn = container.querySelector('#github-login') as HTMLButtonElement;
      loginBtn.click();

      await new Promise(resolve => setTimeout(resolve, 200));

      const logoutBtn = container.querySelector('#github-logout');
      expect(logoutBtn).toBeTruthy();
      expect(logoutBtn?.textContent).toBe('Logout');
    });

    it('shows repository fields when authenticated', async () => {
      mockAuthenticate.mockResolvedValue({
        success: true,
        state: { isAuthenticated: true, username: 'testuser' },
      });

      await new Promise(resolve => setTimeout(resolve, 100));

      const tokenInput = container.querySelector('#github-token') as HTMLInputElement;
      tokenInput.value = 'valid_token';
      const loginBtn = container.querySelector('#github-login') as HTMLButtonElement;
      loginBtn.click();

      await new Promise(resolve => setTimeout(resolve, 200));

      expect(container.querySelector('#github-owner')).toBeTruthy();
      expect(container.querySelector('#github-repo')).toBeTruthy();
      expect(container.querySelector('#github-save-repo')).toBeTruthy();
    });
  });

  describe('handleLogout', () => {
    it('calls logout and resets UI state', async () => {
      mockAuthenticate.mockResolvedValue({
        success: true,
        state: { isAuthenticated: true, username: 'testuser' },
      });
      mockLogout.mockResolvedValue({ success: true });

      await new Promise(resolve => setTimeout(resolve, 100));

      const tokenInput = container.querySelector('#github-token') as HTMLInputElement;
      tokenInput.value = 'valid_token';
      const loginBtn = container.querySelector('#github-login') as HTMLButtonElement;
      loginBtn.click();

      await new Promise(resolve => setTimeout(resolve, 200));

      const logoutBtn = container.querySelector('#github-logout') as HTMLButtonElement;
      logoutBtn.click();

      await new Promise(resolve => setTimeout(resolve, 200));

      expect(mockLogout).toHaveBeenCalled();
      expect(container.querySelector('#github-token')).toBeTruthy();
    });
  });
});
