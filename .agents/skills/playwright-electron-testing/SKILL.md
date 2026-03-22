---
name: playwright-electron-testing
description: '**WORKFLOW SKILL** — Create automated end-to-end tests for Electron applications using Playwright. Use when: setting up Playwright testing for Electron apps, writing test scripts, configuring test runners, or debugging Electron app behavior through automated tests. INVOKES: file system tools for creating test files and config, terminal commands for installing dependencies and running tests.'
---

# Playwright Electron Testing

## Overview

This skill guides you through setting up and creating automated tests for Electron applications using Playwright. Playwright provides powerful end-to-end testing capabilities specifically designed for Electron apps, allowing you to test both the main process and renderer processes.

## Prerequisites

- Node.js and npm installed
- An existing Electron application
- Basic understanding of JavaScript/TypeScript

## Step-by-Step Workflow

### 1. Install Playwright Dependencies

Install Playwright Test as a development dependency:

```bash
npm install --save-dev @playwright/test
```

### 2. Configure Playwright

Create a `playwright.config.ts` file in your project root with Electron-specific configuration:

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  timeout: 30000,
  use: {
    // Electron-specific configuration
  },
  projects: [
    {
      name: 'electron',
      use: {
        // Project-specific settings
      },
    },
  ],
});
```

Key configuration options for Electron:
- `testDir`: Directory containing test files
- `testMatch`: Pattern to match test files (default: `**/*.@(spec|test).?(c|m)[jt]s?(x)`)
- `timeout`: Test timeout in milliseconds
- `workers`: Number of parallel workers

### 3. Create Test Files

Create test files in your configured `testDir` (e.g., `tests/app.spec.ts`):

```typescript
import { test, expect, _electron as electron } from '@playwright/test';

test('launch app and verify window', async () => {
  // Launch Electron app
  const electronApp = await electron.launch({
    args: ['.'] // Path to your main script
  });

  // Get the first window
  const window = await electronApp.firstWindow();

  // Perform assertions
  await expect(window).toHaveTitle('Your App Title');

  // Close the app
  await electronApp.close();
});

test('test main process functionality', async () => {
  const electronApp = await electron.launch({ args: ['.'] });

  // Evaluate code in main process
  const isPackaged = await electronApp.evaluate(async ({ app }) => {
    return app.isPackaged;
  });

  expect(isPackaged).toBe(false); // Should be false in development

  await electronApp.close();
});

test('test renderer process interactions', async () => {
  const electronApp = await electron.launch({ args: ['.'] });
  const window = await electronApp.firstWindow();

  // Interact with DOM elements
  await window.click('button#my-button');
  await expect(window.locator('text=Success')).toBeVisible();

  // Take screenshot for debugging
  await window.screenshot({ path: 'test-screenshot.png' });

  await electronApp.close();
});
```

### 4. Run Tests

Execute your tests using the Playwright CLI:

```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test app.spec.ts

# Run tests in headed mode (show browser windows)
npx playwright test --headed

# Run tests with debugging
npx playwright test --debug
```

### 5. Debug and Iterate

- Use `--debug` flag to step through tests interactively
- Take screenshots or videos of failures for debugging
- Use `console.log` in test code or `page.on('console')` to capture app logs
- Leverage Playwright's trace viewer: `npx playwright show-trace`

## Advanced Features

### Main Process Testing

Use `electronApp.evaluate()` to run code in the main process:

```typescript
const appVersion = await electronApp.evaluate(async ({ app }) => {
  return app.getVersion();
});
```

### Window Management

```typescript
// Wait for new windows
const newWindow = await electronApp.waitForEvent('window');

// Get all windows
const allWindows = electronApp.windows();

// Switch between windows
await allWindows[1].bringToFront();
```

### File Dialogs and System Interactions

```typescript
// Handle file dialogs
const [fileChooser] = await Promise.all([
  window.waitForEvent('filechooser'),
  window.click('button[aria-label="Open file"]')
]);
await fileChooser.setFiles('path/to/test-file.txt');
```

### Screenshots and Visual Testing

```typescript
// Take full page screenshot
await window.screenshot({ path: 'full-page.png' });

// Visual regression testing
await expect(window).toHaveScreenshot('homepage.png');
```

## Configuration Options

### TestConfig Properties

- `testMatch`: Glob patterns for test files
- `timeout`: Default test timeout
- `retries`: Number of retry attempts for failed tests
- `workers`: Parallel execution workers
- `reporter`: Test result reporting format

### Electron-Specific Options

- `args`: Arguments passed to Electron executable
- `executablePath`: Custom path to Electron binary
- `env`: Environment variables for the app

## Best Practices

1. **Test Isolation**: Each test should be independent
2. **Wait Strategies**: Use explicit waits instead of sleep
3. **Selectors**: Prefer semantic selectors over fragile CSS/XPath
4. **Cleanup**: Always close the app in test cleanup
5. **CI Integration**: Configure appropriate timeouts and retries for CI
6. **Visual Testing**: Use screenshots for UI regression testing

## Troubleshooting

### Common Issues

- **App doesn't launch**: Check the path to your main script in `electron.launch()`
- **Timeouts**: Increase timeout values in config or use `waitFor` methods
- **Element not found**: Use `page.waitForSelector()` or `expect().toBeVisible()`
- **Main process access**: Ensure code in `evaluate()` has access to Electron APIs

### Debugging Tips

- Enable verbose logging: `DEBUG=pw:api npx playwright test`
- Use Playwright Inspector: `npx playwright test --debug`
- Capture traces: Add `trace: 'on'` to config for detailed execution logs

## Reference Documentation

- [Electron Automated Testing Guide](https://www.electronjs.org/docs/latest/tutorial/automated-testing)
- [Playwright Electron API](https://playwright.dev/docs/api/class-electron/)
- [ElectronApplication Class](https://playwright.dev/docs/api/class-electronapplication)
- [Playwright Test Configuration](https://playwright.dev/docs/api/class-testconfig#test-config-test-match)