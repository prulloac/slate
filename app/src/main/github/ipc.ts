import { ipcMain } from 'electron';

import { GitHubAuth } from '../../github/auth';
import { SafeAuthState } from '../../types/github';
import { githubClient, GitHubConfig } from '../../github/client';

export function registerGitHubIpcHandlers(): void {
  ipcMain.handle('github:authenticate', async (_event, token: string) => {
    const success = await GitHubAuth.authenticate(token);
    return { success, state: GitHubAuth.getSafeState() };
  });

  ipcMain.handle('github:logout', async () => {
    GitHubAuth.logout();
    return { success: true };
  });

  ipcMain.handle('github:getAuthState', async (): Promise<SafeAuthState> => {
    return GitHubAuth.getSafeState();
  });

  ipcMain.handle(
    'github:setRepository',
    async (_event, config: GitHubConfig) => {
      try {
        githubClient.setRepository(config.owner, config.repo);
        return { success: true };
      } catch (error) {
        return { success: false, error: String(error) };
      }
    }
  );

  ipcMain.handle(
    'github:listPullRequests',
    async (_event, options?: { state?: 'open' | 'closed' | 'all'; perPage?: number }) => {
      try {
        const result = await githubClient.listPullRequests(options);
        return { success: true, data: result.data };
      } catch (error) {
        return { success: false, error: String(error) };
      }
    }
  );

  ipcMain.handle(
    'github:getPullRequest',
    async (_event, pullNumber: number) => {
      try {
        const data = await githubClient.getPullRequest(pullNumber);
        return { success: true, data };
      } catch (error) {
        return { success: false, error: String(error) };
      }
    }
  );

  ipcMain.handle(
    'github:getPullRequestFiles',
    async (_event, pullNumber: number) => {
      try {
        const data = await githubClient.getPullRequestFiles(pullNumber);
        return { success: true, data };
      } catch (error) {
        return { success: false, error: String(error) };
      }
    }
  );

  ipcMain.handle(
    'github:getReviews',
    async (_event, pullNumber: number) => {
      try {
        const data = await githubClient.getReviews(pullNumber);
        return { success: true, data };
      } catch (error) {
        return { success: false, error: String(error) };
      }
    }
  );

  ipcMain.handle(
    'github:getComments',
    async (_event, pullNumber: number) => {
      try {
        const data = await githubClient.getComments(pullNumber);
        return { success: true, data };
      } catch (error) {
        return { success: false, error: String(error) };
      }
    }
  );

  ipcMain.handle(
    'github:createReviewComment',
    async (
      _event,
      pullNumber: number,
      body: string,
      commitId: string,
      path: string,
      line: number
    ) => {
      try {
        const data = await githubClient.createReviewComment(
          pullNumber,
          body,
          commitId,
          path,
          line
        );
        return { success: true, data };
      } catch (error) {
        return { success: false, error: String(error) };
      }
    }
  );

  ipcMain.handle(
    'github:submitReview',
    async (
      _event,
      pullNumber: number,
      event: 'APPROVE' | 'REQUEST_CHANGES' | 'COMMENT',
      body?: string
    ) => {
      try {
        const data = await githubClient.submitReview(pullNumber, event, body);
        return { success: true, data };
      } catch (error) {
        return { success: false, error: String(error) };
      }
    }
  );

  ipcMain.handle(
    'github:getCheckRuns',
    async (_event, ref: string) => {
      try {
        const data = await githubClient.getCheckRuns(ref);
        return { success: true, data };
      } catch (error) {
        return { success: false, error: String(error) };
      }
    }
  );
}
