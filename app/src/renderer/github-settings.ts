export interface GitHubSettings {
  owner: string;
  repo: string;
  token: string;
}

declare global {
  interface Window {
    github: {
      authenticate: (token: string) => Promise<{ success: boolean; state: unknown }>;
      logout: () => Promise<{ success: boolean }>;
      getAuthState: () => Promise<unknown>;
      setRepository: (config: { owner: string; repo: string }) => Promise<{ success: boolean; error?: string }>;
      listPullRequests: (options?: { state?: 'open' | 'closed' | 'all'; perPage?: number }) => Promise<{ success: boolean; data?: unknown[]; error?: string }>;
      getPullRequest: (pullNumber: number) => Promise<{ success: boolean; data?: unknown; error?: string }>;
      getPullRequestFiles: (pullNumber: number) => Promise<{ success: boolean; data?: unknown[]; error?: string }>;
      getReviews: (pullNumber: number) => Promise<{ success: boolean; data?: unknown[]; error?: string }>;
      getComments: (pullNumber: number) => Promise<{ success: boolean; data?: unknown[]; error?: string }>;
      createReviewComment: (
        pullNumber: number,
        body: string,
        commitId: string,
        path: string,
        line: number
      ) => Promise<{ success: boolean; data?: unknown; error?: string }>;
      submitReview: (
        pullNumber: number,
        event: 'APPROVE' | 'REQUEST_CHANGES' | 'COMMENT',
        body?: string
      ) => Promise<{ success: boolean; data?: unknown; error?: string }>;
      getCheckRuns: (ref: string) => Promise<{ success: boolean; data?: unknown[]; error?: string }>;
    };
  }
}

export interface SettingsState {
  token: string;
  owner: string;
  repo: string;
  isAuthenticated: boolean;
  username: string | null;
}

export class GitHubSettingsPanel {
  private container: HTMLElement;
  private state: SettingsState = {
    token: '',
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
    const authState = await window.github.getAuthState() as {
      isAuthenticated: boolean;
      username: string | null;
    };
    this.state.isAuthenticated = authState.isAuthenticated;
    this.state.username = authState.username;
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
  }

  private renderAuthenticated(): string {
    return `
      <div class="auth-info">
        <span>Logged in as: <strong>${this.state.username}</strong></span>
        <button id="github-logout" class="btn btn-danger">Logout</button>
      </div>
      <div class="settings-form">
        <div class="form-group">
          <label for="github-owner">Repository Owner</label>
          <input type="text" id="github-owner" placeholder="e.g., prulloac" value="${this.state.owner}">
        </div>
        <div class="form-group">
          <label for="github-repo">Repository Name</label>
          <input type="text" id="github-repo" placeholder="e.g., slate" value="${this.state.repo}">
        </div>
        <button id="github-save-repo" class="btn btn-primary">Save Repository</button>
      </div>
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

    const result = await window.github.authenticate(token);

    if (result.success) {
      const state = result.state as { username: string };
      this.state.isAuthenticated = true;
      this.state.username = state.username;
      this.render();
    } else {
      if (errorDiv) errorDiv.textContent = 'Authentication failed. Please check your token.';
    }
  }

  private async handleLogout(): Promise<void> {
    await window.github.logout();
    this.state = {
      token: '',
      owner: '',
      repo: '',
      isAuthenticated: false,
      username: null,
    };
    this.render();
  }

  private async handleSaveRepo(): Promise<void> {
    const ownerInput = document.getElementById('github-owner') as HTMLInputElement;
    const repoInput = document.getElementById('github-repo') as HTMLInputElement;

    const owner = ownerInput.value.trim();
    const repo = repoInput.value.trim();

    if (!owner || !repo) {
      return;
    }

    const result = await window.github.setRepository({ owner, repo });

    if (result.success) {
      this.state.owner = owner;
      this.state.repo = repo;
    }
  }
}
