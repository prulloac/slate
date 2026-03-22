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
│   ├── README.md      # Feature summary and maturity
│   └── plan.md        # Action plan with ordered tasks (optional)
└── ...
```

## Workflows

### Adding a New Feature

1. Create feature directory: `docs/features/<kebab-case-name>/`
2. Create `README.md` with:
   - Feature name and purpose
   - Maturity status: `planned` | `in-progress` | `stable` | `deprecated`
   - Key implementation details
   - GitHub issue reference (e.g., `See [#123](https://github.com/owner/repo/issues/123)`)
3. Update `docs/features/README.md` to include the new feature
4. **VERIFICATION REQUIRED**: Before marking as `in-progress`, the agent MUST:
   - Verify the GitHub issue exists and is properly documented
   - Ensure all local file references (README, plan.md, etc.) link to the correct issue number
   - Cross-reference any `#issue-number` mentions across documentation

### Creating Feature Action Plan

When a feature needs to be broken down into actionable tasks:

1. Analyze the feature requirements and dependencies
2. Create `docs/features/<feature-name>/plan.md` with:
   - Feature overview and goals
   - GitHub issue reference linking to the relevant issue
   - Ordered list of tasks with dependencies noted
   - Each task should be a distinct, completable unit of work
   - Mark tasks as: `todo` | `in-progress` | `done` | `blocked`
3. Update the feature's README.md to reference the plan
4. **VERIFICATION REQUIRED**: Ensure the plan.md and README.md both reference the same GitHub issue number consistently

### Updating Feature Status

1. Edit `docs/features/<feature-name>/README.md` maturity field
2. Update corresponding entry in `docs/features/README.md`
3. Update plan.md task statuses as work progresses

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

**Plan:** [plan.md](./plan.md)
```

### Feature plan.md

```markdown
# Feature Name - Action Plan

## Overview
What needs to be accomplished for this feature.

## Tasks

| # | Task | Status | Dependencies |
|---|------|--------|--------------|
| 1 | Task description | todo | - |
| 2 | Task description | todo | #1 |
| 3 | Task description | blocked | #2 |
```

Task statuses:
- `todo` - Not yet started
- `in-progress` - Currently being worked on
- `done` - Completed
- `blocked` - Waiting on dependencies

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

## GitHub Issue Integration

When a feature is decided to be implemented, the agent MUST verify:

1. **Issue Existence**: Confirm the GitHub issue exists at `github.com/<owner>/<repo>/issues/<number>`
2. **Consistent Referencing**: Ensure ALL of the following files reference the SAME issue number:
   - Feature's `README.md` (must have a GitHub issue link)
   - Feature's `plan.md` (if exists, must reference the issue)
   - Main `docs/features/README.md` (if it links to the issue)
3. **Cross-Reference Check**: Search for `#<issue-number>` patterns across the codebase to ensure all references are consistent

If the GitHub issue does not exist, create it first before proceeding with feature implementation.

### Required Issue Fields

Feature documentation MUST include:
- GitHub issue link in format: `See [#<number>](<url>)`
- Issue number referenced in commit messages when applicable
