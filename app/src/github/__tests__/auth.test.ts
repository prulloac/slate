const mockSetAuthToken = jest.fn();
const mockClearAuth = jest.fn();

const mockOctokitGetAuthenticated = jest.fn();

jest.mock('../client', () => ({
  githubClient: {
    setAuthToken: (...args: unknown[]) => mockSetAuthToken(...args),
    clearAuth: (...args: unknown[]) => mockClearAuth(...args),
  },
}));

jest.mock('@octokit/rest', () => {
  return {
    Octokit: jest.fn().mockImplementation(() => ({
      users: {
        getAuthenticated: (...args: unknown[]) => mockOctokitGetAuthenticated(...args),
      },
    })),
  };
});

import { GitHubAuth } from '../auth';

describe('GitHubAuth', () => {
  beforeEach(() => {
    GitHubAuth.logout();
    jest.clearAllMocks();
  });

  describe('authenticate', () => {
    it('returns true and sets auth state when valid token is provided', async () => {
      mockOctokitGetAuthenticated.mockResolvedValue({
        data: {
          login: 'testuser',
          avatar_url: 'https://avatar.example.com/testuser.png',
        },
      });

      const result = await GitHubAuth.authenticate('valid-token');

      expect(result).toBe(true);
      expect(mockSetAuthToken).toHaveBeenCalledWith('valid-token');

      const state = GitHubAuth.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.username).toBe('testuser');
      expect(state.token).toBe('valid-token');
      expect(state.avatarUrl).toBe('https://avatar.example.com/testuser.png');
    });

    it('returns false and clears auth when invalid token is provided', async () => {
      mockOctokitGetAuthenticated.mockRejectedValue(new Error('Bad credentials'));

      const result = await GitHubAuth.authenticate('invalid-token');

      expect(result).toBe(false);
      expect(mockClearAuth).toHaveBeenCalled();

      const state = GitHubAuth.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.token).toBeNull();
      expect(state.username).toBeNull();
    });

    it('clears previous auth state when authentication fails', async () => {
      mockOctokitGetAuthenticated.mockResolvedValue({
        data: { login: 'testuser', avatar_url: 'https://avatar.example.com/testuser.png' },
      });

      await GitHubAuth.authenticate('valid-token-1');
      expect(GitHubAuth.isAuthenticated()).toBe(true);

      mockOctokitGetAuthenticated.mockRejectedValue(new Error('Token expired'));

      await GitHubAuth.authenticate('expired-token');

      expect(mockClearAuth).toHaveBeenCalled();
      expect(GitHubAuth.isAuthenticated()).toBe(false);
    });
  });

  describe('logout', () => {
    it('clears authentication state and client auth', async () => {
      mockOctokitGetAuthenticated.mockResolvedValue({
        data: { login: 'testuser', avatar_url: 'https://avatar.example.com/testuser.png' },
      });

      await GitHubAuth.authenticate('test-token');
      expect(GitHubAuth.isAuthenticated()).toBe(true);

      GitHubAuth.logout();

      expect(mockClearAuth).toHaveBeenCalled();
      expect(GitHubAuth.isAuthenticated()).toBe(false);
      expect(GitHubAuth.getToken()).toBeNull();
      expect(GitHubAuth.getUsername()).toBeNull();
    });
  });

  describe('getSafeState', () => {
    it('never includes token in safe state', async () => {
      mockOctokitGetAuthenticated.mockResolvedValue({
        data: { login: 'testuser', avatar_url: 'https://avatar.example.com/testuser.png' },
      });

      await GitHubAuth.authenticate('super-secret-token');

      const safeState = GitHubAuth.getSafeState();

      expect(safeState).not.toHaveProperty('token');
      expect(safeState).not.toHaveProperty('password');
      expect(safeState.isAuthenticated).toBe(true);
      expect(safeState.username).toBe('testuser');
    });

    it('returns unauthenticated safe state when logged out', () => {
      GitHubAuth.logout();

      const safeState = GitHubAuth.getSafeState();

      expect(safeState.isAuthenticated).toBe(false);
      expect(safeState.username).toBeNull();
      expect(safeState).not.toHaveProperty('token');
    });
  });

  describe('getState', () => {
    it('includes token in internal state', async () => {
      mockOctokitGetAuthenticated.mockResolvedValue({
        data: { login: 'testuser', avatar_url: 'https://avatar.example.com/testuser.png' },
      });

      await GitHubAuth.authenticate('secret-token');

      const state = GitHubAuth.getState();

      expect(state.token).toBe('secret-token');
      expect(state.isAuthenticated).toBe(true);
    });
  });
});
