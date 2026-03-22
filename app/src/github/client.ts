import { Octokit } from '@octokit/rest';

export interface GitHubConfig {
  owner: string;
  repo: string;
}

export class GitHubClient {
  private octokit: Octokit;
  private config: GitHubConfig | null = null;

  constructor(authToken?: string) {
    this.octokit = new Octokit({
      auth: authToken,
    });
  }

  setAuthToken(token: string): void {
    this.octokit = new Octokit({ auth: token });
  }

  setRepository(owner: string, repo: string): void {
    this.config = { owner, repo };
  }

  async listPullRequests(
    options: {
      state?: 'open' | 'closed' | 'all';
      perPage?: number;
    } = {}
  ): Promise<{ owner: string; repo: string; data: Awaited<ReturnType<Octokit['pulls']['list']>>['data'] }> {
    if (!this.config) {
      throw new Error('Repository not set. Call setRepository() first.');
    }

    const { state = 'open', perPage = 30 } = options;

    const response = await this.octokit.pulls.list({
      owner: this.config.owner,
      repo: this.config.repo,
      state,
      per_page: perPage,
    });

    return {
      owner: this.config.owner,
      repo: this.config.repo,
      data: response.data,
    };
  }

  async getPullRequest(pullNumber: number) {
    if (!this.config) {
      throw new Error('Repository not set. Call setRepository() first.');
    }

    const response = await this.octokit.pulls.get({
      owner: this.config.owner,
      repo: this.config.repo,
      pull_number: pullNumber,
    });

    return response.data;
  }

  async getPullRequestFiles(pullNumber: number) {
    if (!this.config) {
      throw new Error('Repository not set. Call setRepository() first.');
    }

    const response = await this.octokit.pulls.listFiles({
      owner: this.config.owner,
      repo: this.config.repo,
      pull_number: pullNumber,
    });

    return response.data;
  }

  async getReviews(pullNumber: number) {
    if (!this.config) {
      throw new Error('Repository not set. Call setRepository() first.');
    }

    const response = await this.octokit.pulls.listReviews({
      owner: this.config.owner,
      repo: this.config.repo,
      pull_number: pullNumber,
    });

    return response.data;
  }

  async getComments(pullNumber: number) {
    if (!this.config) {
      throw new Error('Repository not set. Call setRepository() first.');
    }

    const response = await this.octokit.issues.listComments({
      owner: this.config.owner,
      repo: this.config.repo,
      issue_number: pullNumber,
    });

    return response.data;
  }

  async createReviewComment(
    pullNumber: number,
    body: string,
    commitId: string,
    path: string,
    line: number
  ) {
    if (!this.config) {
      throw new Error('Repository not set. Call setRepository() first.');
    }

    const response = await this.octokit.pulls.createReviewComment({
      owner: this.config.owner,
      repo: this.config.repo,
      pull_number: pullNumber,
      body,
      commit_id: commitId,
      path,
      line,
    });

    return response.data;
  }

  async submitReview(
    pullNumber: number,
    event: 'APPROVE' | 'REQUEST_CHANGES' | 'COMMENT',
    body?: string
  ) {
    if (!this.config) {
      throw new Error('Repository not set. Call setRepository() first.');
    }

    const response = await this.octokit.pulls.createReview({
      owner: this.config.owner,
      repo: this.config.repo,
      pull_number: pullNumber,
      event,
      body,
    });

    return response.data;
  }

  async getCheckRuns(ref: string) {
    if (!this.config) {
      throw new Error('Repository not set. Call setRepository() first.');
    }

    const response = await this.octokit.checks.listForRef({
      owner: this.config.owner,
      repo: this.config.repo,
      ref,
    });

    return response.data;
  }
}

export const githubClient = new GitHubClient();
