---
name: feature-tracker
description: Track and document project features. Use when adding new features, updating feature status, or maintaining feature documentation in docs/features/.
---

# Feature Tracker

This skill manages feature documentation in `docs/features/`. Each feature has its own subdirectory with a README.md summarizing intent and maturity status.

## Directory Structure

```
docs/features/
├── README.md          # Overview of all features with status
├── feature-name/
│   └── README.md      # Feature summary and maturity
└── ...
```

## Workflows

### Adding a New Feature

1. Create feature directory: `docs/features/<kebab-case-name>/`
2. Create `README.md` with:
   - Feature name and purpose
   - Maturity status: `planned` | `in-progress` | `stable` | `deprecated`
   - Key implementation details
3. Update `docs/features/README.md` to include the new feature

### Updating Feature Status

1. Edit `docs/features/<feature-name>/README.md` maturity field
2. Update corresponding entry in `docs/features/README.md`

### Maturity Status Definitions

| Status | Meaning |
|--------|---------|
| `planned` | Designed but not started |
| `in-progress` | Actively being developed |
| `stable` | Complete and production-ready |
| `deprecated` | Will be removed |

## Format Requirements

### Feature README.md

```markdown
# Feature Name

**Status:** stable | in-progress | planned | deprecated

Brief description of what this feature does and why it exists.
```

### docs/features/README.md

Use this template:

```markdown
# Features

## Feature Status Overview

| Feature | Status | Description |
|---------|--------|-------------|
| feature-name | stable | Brief description |
```

## File Naming

- Directory names: kebab-case (e.g., `keyboard-navigation`)
- No spaces or special characters in names
- Names should be concise and descriptive
