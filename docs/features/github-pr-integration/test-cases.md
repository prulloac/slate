# GitHub PR Integration - Test Cases

## Overview

Test cases for GitHub authentication, IPC bridge, settings panel, and PR operations.

## Test Scenarios

### Category: Authentication

```gherkin
Feature: GitHub Authentication

  Scenario: Successful authentication with valid PAT
    Given the user has a valid GitHub Personal Access Token
    And the GitHubSettingsPanel is rendered
    When the user enters the token and clicks Login
    Then the authentication succeeds
    And the UI shows the authenticated state
    And the username is displayed in the settings panel
    And the token input is cleared for security

  Scenario: Authentication failure with invalid token
    Given the user has an invalid GitHub Personal Access Token
    And the GitHubSettingsPanel is rendered
    When the user enters the invalid token and clicks Login
    Then authentication fails
    And an error message is displayed to the user
    And the UI remains in the unauthenticated state
    And no sensitive data is exposed

  Scenario: Authentication failure due to network error
    Given the GitHubSettingsPanel is rendered
    And network connectivity is unavailable
    When the user enters a valid token and clicks Login
    Then an error message is displayed
    And the UI remains in the unauthenticated state

  Scenario: Logout clears authentication state
    Given the user is authenticated with GitHub
    And the GitHubSettingsPanel shows the authenticated state
    When the user clicks Logout
    Then the authentication state is cleared
    And the UI transitions to the login form
    And subsequent API calls fail appropriately

  Scenario: Auth state persists correctly across sessions
    Given the user was previously authenticated
    When the GitHubSettingsPanel loads
    Then the correct authentication state is retrieved
    And the UI reflects the persisted state

  Scenario: Failed authentication does not leave stale auth state
    Given the user was previously authenticated
    When authentication fails with an invalid token
    Then the previous authentication is invalidated
    And the githubClient auth token is cleared
```

### Category: Token Security

```gherkin
Feature: Token Security

  Scenario: Token is never exposed to renderer via IPC
    Given the user is authenticated
    When the renderer calls getAuthState
    Then the returned SafeAuthState contains no token field
    And the raw PAT is never sent over IPC

  Scenario: Token is cleared from input after successful login
    Given the GitHubSettingsPanel is rendered
    When the user successfully authenticates
    Then the token input field is cleared
    And the PAT is not visible in the DOM after login

  Scenario: Token is not logged or persisted
    Given the user authenticates
    Then the token is stored only in memory
    And the token is never written to logs
    And the token is never written to local storage or disk

  Scenario: Logout clears token from memory
    Given the user is authenticated
    When the user logs out
    Then the token is cleared from GitHubAuth state
    And the token is cleared from githubClient
```

### Category: Settings Panel UI

```gherkin
Feature: Settings Panel UI

  Scenario: Panel renders login form when unauthenticated
    Given the user is not authenticated
    When the GitHubSettingsPanel is rendered
    Then a login form is displayed
    And a token input field is shown
    And a Login button is present

  Scenario: Panel renders authenticated view with username
    Given the user is authenticated as "testuser"
    When the GitHubSettingsPanel is rendered
    Then the username "testuser" is displayed
    And a Logout button is shown
    And repository configuration fields are visible

  Scenario: Repository owner and repo can be saved
    Given the user is authenticated
    And the repository fields are empty
    When the user enters "owner" and "repo"
    And clicks Save Repository
    Then the repository is configured successfully
    And no error is displayed

  Scenario: Repository save fails with empty fields
    Given the user is authenticated
    When the user clicks Save Repository with empty fields
    Then an error message is displayed
    And the repository is not saved

  Scenario: Repository save fails with invalid values
    Given the user is authenticated
    When the user enters invalid repository values
    And clicks Save Repository
    Then an appropriate error is displayed

  Scenario: Dynamic content uses textContent to prevent XSS
    Given the user is authenticated as "<script>alert('xss')</script>"
    When the settings panel renders
    Then the username is rendered safely
    And the script is not executed
```

### Category: IPC Bridge

```gherkin
Feature: IPC Bridge Communication

  Scenario: IPC handlers are registered on app startup
    Given the Electron app is starting
    When the main process initializes
    Then all github:* IPC handlers are registered
    And the app is ready to receive renderer requests

  Scenario: IPC returns structured success responses
    Given a valid IPC call is made
    When the operation succeeds
    Then the response has a success: true field
    And data is included when applicable

  Scenario: IPC returns structured error responses
    Given a failed IPC call is made
    When the operation fails
    Then the response has a success: false field
    And an error message is provided
    And the error field contains details

  Scenario: IPC fails gracefully when GitHub API is unavailable
    Given the user is authenticated
    When an IPC call to GitHub API fails due to network
    Then an error response is returned
    And no unhandled exception occurs

  Scenario: Sandbox mode protects renderer from main process
    Given the app is configured with sandbox: true
    When the renderer attempts to access Node.js APIs
    Then access is denied
    And the preload bridge provides controlled access
```

### Category: Pull Request Operations

```gherkin
Feature: Pull Request Operations

  Scenario: List open pull requests
    Given the user is authenticated
    And a repository is configured
    When the user requests open pull requests
    Then a list of open PRs is returned
    And each PR includes number, title, and state

  Scenario: List all pull requests including closed
    Given the user is authenticated
    And a repository is configured
    When the user requests all pull requests
    Then both open and closed PRs are included

  Scenario: Get single pull request details
    Given the user is authenticated
    And PR #123 exists in the repository
    When the user requests PR #123
    Then the full PR details are returned
    And includes title, body, author, and status

  Scenario: Get pull request files
    Given the user is authenticated
    And PR #123 has changed files
    When the user requests files for PR #123
    Then the list of changed files is returned
    And each file includes filename and change stats

  Scenario: Get reviews for a pull request
    Given the user is authenticated
    And PR #123 has reviews
    When the user requests reviews for PR #123
    Then the list of reviews is returned
    And includes reviewer, state, and comments

  Scenario: Get comments for a pull request
    Given the user is authenticated
    And PR #123 has review comments
    When the user requests comments for PR #123
    Then the list of comments is returned
    And includes body, author, and position

  Scenario: Operations fail without authentication
    Given the user is not authenticated
    When the user attempts to list PRs
    Then an appropriate error is returned
    And no GitHub API calls are made

  Scenario: Operations fail without repository configured
    Given the user is authenticated
    But no repository is configured
    When the user attempts to list PRs
    Then an appropriate error is returned
```

### Category: Review Functionality

```gherkin
Feature: Review Functionality

  Scenario: Submit approval review
    Given the user is authenticated
    And viewing PR #123
    When submitting an APPROVE review with comment
    Then the review is submitted successfully
    And the PR state is updated to approved

  Scenario: Submit changes requested review
    Given the user is authenticated
    And viewing PR #123
    When submitting a REQUEST_CHANGES review
    Then the review is submitted with change requests
    And the PR author is notified

  Scenario: Submit comment-only review
    Given the user is authenticated
    And viewing PR #123
    When submitting a COMMENT review
    Then the comment is added without approval state change

  Scenario: Create inline review comment
    Given the user is authenticated
    And viewing PR #123
    When adding a comment to a specific line
    Then the comment is created at the correct position
    And includes the file path and line number

  Scenario: Review submission fails without authentication
    Given the user is not authenticated
    When attempting to submit a review
    Then an error is returned
    And the review is not submitted

  Scenario: Get check runs status
    Given the user is authenticated
    And viewing PR #123
    When requesting check runs
    Then the list of CI/CD checks is returned
    And includes name, status, and conclusion
```

### Category: Error Handling

```gherkin
Feature: Error Handling

  Scenario: Handle invalid repository format
    Given the user is authenticated
    When setting a repository with invalid format
    Then an error message describes the issue
    And no API calls are made with invalid data

  Scenario: Handle rate limiting from GitHub API
    Given the user is authenticated
    When GitHub API rate limit is exceeded
    Then an appropriate error is returned
    And the user is informed about rate limiting

  Scenario: Handle expired or revoked token
    Given the user is authenticated with a now-expired token
    When making an API call
    Then authentication fails with clear error
    And the user is prompted to re-authenticate

  Scenario: Handle missing pull request
    Given the user is authenticated
    When requesting a non-existent PR
    Then an appropriate 404 error is returned

  Scenario: Handle permission denied errors
    Given the user is authenticated with limited access token
    When accessing a private repository without permission
    Then a permission error is returned
    And the error message is user-friendly

  Scenario: IPC handlers handle uncaught exceptions
    Given an IPC handler encounters an unexpected error
    When processing a request
    Then the error is caught and logged
    And a structured error response is returned
    And the app does not crash
```

### Category: BrowserWindow Security

```gherkin
Feature: Electron Security Configuration

  Scenario: Sandbox mode is enabled
    Given the app is configured
    Then BrowserWindow has sandbox: true
    And the renderer process is isolated

  Scenario: Context isolation is enabled
    Given the app is configured
    Then contextIsolation is true
    And preload script uses contextBridge

  Scenario: Node integration is disabled
    Given the app is configured
    Then nodeIntegration is false
    And renderer cannot access Node.js APIs directly

  Scenario: CSP header restricts script execution
    Given the app serves HTML
    Then a Content-Security-Policy header is present
    And inline scripts are restricted in production
    And eval is not allowed
```
