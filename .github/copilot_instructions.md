# GitHub Copilot Configuration for Slate

## Project Context
Slate is a high-performance desktop application for deep-focus code reviews built with Electron and TypeScript.

## Tech Stack
- **Runtime**: Electron 41.x
- **Language**: TypeScript (ES6 target)
- **Build**: electron-forge with Webpack
- **Linting**: ESLint with @typescript-eslint

## Code Style Guidelines

### TypeScript
- Enable strict typing (noImplicitAny is on)
- Use ES6+ syntax (const/let, arrow functions, template literals)
- Prefer interfaces over type aliases for object shapes
- Use explicit return types for exported functions

### Imports
Order imports as:
1. External packages (electron, node_modules)
2. Internal packages
3. Relative imports

### File Structure
- `src/index.ts` - Main process (BrowserWindow creation, IPC handlers)
- `src/preload.ts` - Preload script (contextBridge API)
- `src/renderer.ts` - Renderer process entry
- `src/ai/` - AI feature implementations

### Electron Patterns
- Use contextBridge for secure main/renderer communication
- Handle IPC with proper type definitions
- Use BrowserWindow for creating windows
- Follow Electron security best practices

## Commands
```bash
npm start      # Development mode
npm run lint   # Run ESLint
npm run make   # Build distributable
```
