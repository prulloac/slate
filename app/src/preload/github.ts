import { contextBridge, ipcRenderer } from 'electron';

export interface GitHubAPI {
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
}

const githubAPI: GitHubAPI = {
  authenticate: (token) => ipcRenderer.invoke('github:authenticate', token),
  logout: () => ipcRenderer.invoke('github:logout'),
  getAuthState: () => ipcRenderer.invoke('github:getAuthState'),
  setRepository: (config) => ipcRenderer.invoke('github:setRepository', config),
  listPullRequests: (options) => ipcRenderer.invoke('github:listPullRequests', options),
  getPullRequest: (pullNumber) => ipcRenderer.invoke('github:getPullRequest', pullNumber),
  getPullRequestFiles: (pullNumber) => ipcRenderer.invoke('github:getPullRequestFiles', pullNumber),
  getReviews: (pullNumber) => ipcRenderer.invoke('github:getReviews', pullNumber),
  getComments: (pullNumber) => ipcRenderer.invoke('github:getComments', pullNumber),
  createReviewComment: (pullNumber, body, commitId, path, line) =>
    ipcRenderer.invoke('github:createReviewComment', pullNumber, body, commitId, path, line),
  submitReview: (pullNumber, event, body) =>
    ipcRenderer.invoke('github:submitReview', pullNumber, event, body),
  getCheckRuns: (ref) => ipcRenderer.invoke('github:getCheckRuns', ref),
};

contextBridge.exposeInMainWorld('github', githubAPI);
