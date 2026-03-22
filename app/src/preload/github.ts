import { contextBridge, ipcRenderer } from 'electron';

import { GitHubAPI } from '../types/github';

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
