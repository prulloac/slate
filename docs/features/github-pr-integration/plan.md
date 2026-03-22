# GitHub PR Integration - Action Plan

**See:** [#1](https://github.com/prulloac/slate/issues/1)

## Overview

Deep integration with GitHub pull requests: load PRs, browse changes, post comments, and manage review state directly within Slate.

## Tasks

| # | Task | Status | Dependencies |
|---|------|--------|--------------|
| 1 | Set up GitHub API client library | todo | - |
| 2 | Implement GitHub authentication (OAuth/token) | todo | #1 |
| 3 | Create IPC bridge for GitHub API calls | todo | #1 |
| 4 | Build PR list component | todo | #2, #3 |
| 5 | Build PR detail/diff viewer | todo | #4 |
| 6 | Implement review comments functionality | todo | #5 |
| 7 | Add review state management (approve/request-changes) | todo | #5 |
| 8 | Create settings panel for GitHub credentials | todo | #2 |
| 9 | Add PR notifications/status checks display | todo | #4 |
| 10 | Update feature status to stable | todo | #1-9 |

## Task Details

### 1. Set up GitHub API client library
- Install `@octokit/rest` or similar GitHub API client
- Configure TypeScript types for GitHub API responses
- Add to package.json dependencies

### 2. Implement GitHub authentication (OAuth/token)
- Support Personal Access Token (PAT) authentication
- Store credentials securely (electron-store with encryption)
- Add token validation and refresh flow
- Create auth status indicator in UI

### 3. Create IPC bridge for GitHub API calls
- Define IPC channels in preload script
- Implement API handlers in main process
- Handle rate limiting and errors gracefully
- Support for repository selection

### 4. Build PR list component
- Display open PRs for authenticated repositories
- Show PR title, author, status, review state
- Filter by: open/closed/merged, author, reviewer
- Search functionality
- Refresh/sync button

### 5. Build PR detail/diff viewer
- Display PR description and metadata
- Show file changes with syntax highlighting
- Unified and split diff view toggle
- Navigate between changed files
- Show inline comments in diff view

### 6. Implement review comments functionality
- Post single comments on lines/files
- Reply to existing comments
- Edit/delete own comments
- Comment thread collapsing

### 7. Add review state management
- Approve PR
- Request changes
- Comment-only review
- Review summary submission
- Display current review state

### 8. Create settings panel for GitHub credentials
- GitHub token input with visibility toggle
- Repository selection/filtering
- Notification preferences
- Theme preferences for diff view

### 9. Add PR notifications/status checks display
- CI/CD status indicators (passing/failing/pending)
- Required reviewers status
- Merge conflict warnings
- Draft PR indicator
- Labels display

### 10. Update feature status to stable
- Run lint and typecheck
- Test all functionality
- Update docs/features/github-pr-integration/README.md status
- Update docs/features/README.md status
