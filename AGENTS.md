# AGENTS.md - OpenCode Configuration

## Project Overview
- **Project**: Slate - A high-performance desktop application for deep-focus code reviews
- **Type**: Electron desktop application
- **Language**: TypeScript

## Tech Stack
- **Framework**: Electron with electron-forge
- **Language**: TypeScript (ES6 target)
- **Linting**: ESLint with TypeScript plugin, import/recommended, import/electron, import/typescript
- **Build**: Webpack (main, renderer, preload, plugins configs)
- **Package Manager**: npm

## Commands
- `npm start` - Start the Electron app in development
- `npm run lint` - Run ESLint on TypeScript/TSX files
- `npm run package` - Package the app
- `npm run make` - Create distributable

## Code Conventions
- Use TypeScript strict typing (noImplicitAny enabled)
- Follow ESLint rules (extends eslint:recommended, @typescript-eslint/recommended)
- Import order: external → internal → relative
- Use ES6+ syntax

## Branch Conventions
- Format: `<type>/<short-description>` (e.g., `feat/code-review-panel`, `fix/crash-on-startup`)
- Types: `feat`, `fix`, `refactor`, `docs`, `chore`
- Use kebab-case for branch names
- Keep branch names under 50 characters

## Commit Conventions
- Use imperative mood: "Add feature", "Fix bug"
- Format: `<type>: <description>` (e.g., `feat: add code review panel`)
- Types: `feat`, `fix`, `refactor`, `docs`, `chore`, `style`, `test`
- Keep total commit under 8 lines, first line under 72 characters
- Reference issues: `fix: resolve crash (#5)`

## Directory Structure
- `app/` - Application source and build configuration
- `app/src/` - Main source code
- `app/src/ai/` - AI-related functionality
- `app/src/index.ts` - Main process entry
- `app/src/preload.ts` - Preload script
- `app/src/renderer.ts` - Renderer process
- `app/src/index.html` - HTML template
- `app/.webpack/` - Webpack build output
- `app/forge.config.ts` - Electron Forge configuration
- `app/webpack.*.ts` - Webpack configuration files
