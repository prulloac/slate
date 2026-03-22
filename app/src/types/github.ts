export interface SafeAuthState {
  isAuthenticated: boolean;
  username: string | null;
  avatarUrl: string | null;
}

export interface GitHubAPI {
  authenticate: (token: string) => Promise<{ success: boolean; state: SafeAuthState }>;
  logout: () => Promise<{ success: boolean }>;
  getAuthState: () => Promise<SafeAuthState>;
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
}