import { GitHubAPI } from '../types/github';

declare global {
  interface Window {
    github: GitHubAPI;
  }
}

export interface SettingsState {
  owner: string;
  repo: string;
  isAuthenticated: boolean;
  username: string | null;
}

export class GitHubSettingsPanel {
  private container: HTMLElement;
  private state: SettingsState = {
    owner: '',
    repo: '',
    isAuthenticated: false,
    username: null,
  };

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
    this.loadState();
  }

  private async loadState(): Promise<void> {
    try {
      const authState = await window.github.getAuthState();
      this.state.isAuthenticated = authState.isAuthenticated;
      this.state.username = authState.username;
    } catch (error) {
      // Fallback to a safe unauthenticated state if the auth state cannot be loaded.
      console.error('Failed to load GitHub auth state:', error);
      this.state.isAuthenticated = false;
      this.state.username = null;
    }
    this.render();
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="github-settings">
        <h2>GitHub Settings</h2>
        ${this.state.isAuthenticated ? this.renderAuthenticated() : this.renderLogin()}
      </div>
    `;
    this.attachEventListeners();
    
    // Safely set dynamic content to prevent XSS
    if (this.state.isAuthenticated) {
      const usernameElement = this.container.querySelector('.auth-info strong') as HTMLElement;
      if (usernameElement) {
        usernameElement.textContent = this.state.username || '';
      }
      
      const ownerInput = document.getElementById('github-owner') as HTMLInputElement;
      if (ownerInput) {
        ownerInput.value = this.state.owner;
      }
      
      const repoInput = document.getElementById('github-repo') as HTMLInputElement;
      if (repoInput) {
        repoInput.value = this.state.repo;
      }
    }
  }

  private renderAuthenticated(): string {
    return `
      <div class="auth-info">
        <span>Logged in as: <strong></strong></span>
        <button id="github-logout" class="btn btn-danger">Logout</button>
      </div>
      <div class="settings-form">
        <div class="form-group">
          <label for="github-owner">Repository Owner</label>
          <input type="text" id="github-owner" placeholder="e.g., prulloac">
        </div>
        <div class="form-group">
          <label for="github-repo">Repository Name</label>
          <input type="text" id="github-repo" placeholder="e.g., slate">
        </div>
        <button id="github-save-repo" class="btn btn-primary">Save Repository</button>
      </div>
      <div id="github-repo-error" class="error-message"></div>
    `;
  }

  private renderLogin(): string {
    return `
      <div class="settings-form">
        <div class="form-group">
          <label for="github-token">GitHub Personal Access Token</label>
          <input type="password" id="github-token" placeholder="ghp_...">
          <small>Create a token at GitHub Settings > Developer Settings > Personal Access Tokens</small>
        </div>
        <button id="github-login" class="btn btn-primary">Login</button>
      </div>
      <div id="github-login-error" class="error-message"></div>
    `;
  }

  private attachEventListeners(): void {
    const loginBtn = document.getElementById('github-login');
    if (loginBtn) {
      loginBtn.addEventListener('click', () => this.handleLogin());
    }

    const logoutBtn = document.getElementById('github-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.handleLogout());
    }

    const saveRepoBtn = document.getElementById('github-save-repo');
    if (saveRepoBtn) {
      saveRepoBtn.addEventListener('click', () => this.handleSaveRepo());
    }
  }

  private async handleLogin(): Promise<void> {
    const tokenInput = document.getElementById('github-token') as HTMLInputElement;
    const errorDiv = document.getElementById('github-login-error');
    const token = tokenInput.value.trim();

    if (!token) {
      if (errorDiv) errorDiv.textContent = 'Please enter a token';
      return;
    }

    try {
      const result = await window.github.authenticate(token);

      if (result.success) {
        this.state.isAuthenticated = true;
        this.state.username = result.state.username;
        this.render();
        // Clear the token from the input for security
        tokenInput.value = '';
      } else {
        if (errorDiv) errorDiv.textContent = 'Authentication failed. Please check your token.';
      }
    } catch (error) {
      console.error('Authentication error:', error);
      if (errorDiv) errorDiv.textContent = 'An error occurred during authentication. Please try again.';
    }
  }

  private async handleLogout(): Promise<void> {
    try {
      await window.github.logout();
    } catch (error) {
      console.error('Logout error:', error);
      if (typeof window !== 'undefined' && typeof window.alert === 'function') {
        window.alert('An error occurred while logging out. You may need to try again.');
      }
    } finally {
      this.state = {
        owner: '',
        repo: '',
        isAuthenticated: false,
        username: null,
      };
      this.render();
    }
  }

  private async handleSaveRepo(): Promise<void> {
    const ownerInput = document.getElementById('github-owner') as HTMLInputElement;
    const repoInput = document.getElementById('github-repo') as HTMLInputElement;
    const errorDiv = document.getElementById('github-repo-error');

    const owner = ownerInput.value.trim();
    const repo = repoInput.value.trim();

    if (!owner || !repo) {
      if (errorDiv) {
        errorDiv.textContent = 'Please enter both an owner and a repository name.';
      }
      return;
    }

    try {
      const result = await window.github.setRepository({ owner, repo });

      if (result.success) {
        this.state.owner = owner;
        this.state.repo = repo;
        if (errorDiv) {
          errorDiv.textContent = '';
        }
      } else {
        if (errorDiv) {
          errorDiv.textContent = 'Failed to save repository settings. Please check the owner and repository name.';
        }
      }
    } catch (error) {
      console.error('Error saving GitHub repository settings:', error);
      if (errorDiv) {
        errorDiv.textContent = 'An error occurred while saving repository settings. Please try again.';
      }
    }
  }
}
