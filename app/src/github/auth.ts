import { githubClient } from './client';
import { SafeAuthState } from '../types/github';

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  username: string | null;
  avatarUrl: string | null;
}

export class GitHubAuth {
  private static state: AuthState = {
    isAuthenticated: false,
    token: null,
    username: null,
    avatarUrl: null,
  };

  static getState(): AuthState {
    return { ...this.state };
  }

  static getSafeState(): SafeAuthState {
    return {
      isAuthenticated: this.state.isAuthenticated,
      username: this.state.username,
      avatarUrl: this.state.avatarUrl,
    };
  }

  static async authenticate(token: string): Promise<boolean> {
    try {
      const { Octokit } = await import('@octokit/rest');
      const tempOctokit = new Octokit({ auth: token });

      const { data } = await tempOctokit.users.getAuthenticated();

      githubClient.setAuthToken(token);

      this.state = {
        isAuthenticated: true,
        token,
        username: data.login,
        avatarUrl: data.avatar_url,
      };

      return true;
    } catch (error) {
      githubClient.clearAuth();
      this.state = {
        isAuthenticated: false,
        token: null,
        username: null,
        avatarUrl: null,
      };
      return false;
    }
  }

  static logout(): void {
    githubClient.clearAuth();
    this.state = {
      isAuthenticated: false,
      token: null,
      username: null,
      avatarUrl: null,
    };
  }

  static isAuthenticated(): boolean {
    return this.state.isAuthenticated;
  }

  static getToken(): string | null {
    return this.state.token;
  }

  static getUsername(): string | null {
    return this.state.username;
  }
}
