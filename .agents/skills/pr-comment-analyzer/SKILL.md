---
name: pr-comment-analyzer
description: Analyze pull request comments using gh CLI. Use when user wants to review, categorize, or prioritize PR comments. Retrieves comments from specified PR or automatically detects from current branch, verifies applicability against current code, marks outdated comments, and presents filtered results in structured tables.
---

# PR Comment Analyzer

This skill retrieves pull request comments using the `gh` CLI, categorizes them by type, and prioritizes them by severity.

## Workflows

### Retrieve PR Comments

1. **Determine target PR**:
   - If PR number specified: `gh pr view <number> --comments`
   - If no PR specified: Run `gh pr list` to find PR matching current branch

2. **Fetch comments**: `gh pr comment list <pr-number> --body`

3. **Assess each comment**:
   - Assign a **category** based on content type
   - Assign a **priority** based on severity

4. **Verify applicability**:
   - For each comment, examine the relevant code sections mentioned
   - Check if the issue still exists in the current codebase
   - Mark comments as "outdated" if the issue has been resolved or no longer applies
   - Use code reading tools to inspect files and verify comment validity

5. **Handle outdated comments**:
   - For each outdated comment, reply using `gh pr comment <comment-id> --body "This comment is outdated and will not be fixed."`
   - Remove outdated comments from further processing

6. **Present results**: Format output with categorized and prioritized comments in table format

### Fetching PR Without Number

When no PR number is provided:

```bash
# Get current branch name
git branch --show-current

# Find PR with matching head branch
gh pr list --head $(git branch --show-current) --json number,title,state
```

### Output Format

```markdown
## PR #<number>: <title>

**Author:** @username  
**State:** open | closed | merged  
**URL:** <pr-url>

---

### Comments by Priority

#### 🔴 Critical
| Comment # & Link | Commenter | Summary | Type |
|------------------|-----------|---------|------|
| [#123](link) | @username | Brief summary of the comment | security |

#### 🟠 Important
| Comment # & Link | Commenter | Summary | Type |
|------------------|-----------|---------|------|
| [#124](link) | @username | Brief summary of the comment | refactor |

#### 🟡 Helpful
| Comment # & Link | Commenter | Summary | Type |
|------------------|-----------|---------|------|
| [#125](link) | @username | Brief summary of the comment | improvement |

#### ⚪ Nuance
| Comment # & Link | Commenter | Summary | Type |
|------------------|-----------|---------|------|
| [#126](link) | @username | Brief summary of the comment | nitpicking |

---

### Summary
- **Critical:** N
- **Important:** N
- **Helpful:** N
- **Nuance:** N
- **Outdated (replied):** N
```

## Categories

| Category | Description |
|----------|-------------|
| `security` | Vulnerabilities, credentials, access control, data exposure |
| `documentation` | Missing docs, unclear explanations, README updates |
| `nitpicking` | Style preferences, formatting, naming conventions |
| `refactor` | Code structure improvements, technical debt |
| `improvement` | Feature enhancements, optimizations, best practices |

### Category Detection Guidelines

**security**
- Mentions: vulnerability, security, expose, inject, XSS, CSRF, auth, permission
- Credentials, API keys, tokens in code
- SQL injection, command injection risks
- Insecure dependencies

**documentation**
- Mentions: docs, README, comment, explain, clarify
- Missing function descriptions
- API documentation needed
- Usage examples requested

**nitpicking**
- Mentions: style, format, lint, naming, typo, whitespace
- Variable naming preferences
- Code formatting suggestions
- Minor style differences

**refactor**
- Mentions: refactor, extract, separate, modularize, cleanup
- Function too long
- Duplicated code
- Better abstraction needed

**improvement**
- Mentions: could, might, consider, suggestion, better, optimize
- Performance improvements
- User experience enhancements
- Alternative approaches

## Priority Levels

| Priority | Severity | Description |
|----------|----------|-------------|
| `critical` | Highest | Security vulnerabilities, data loss risks, broken functionality |
| `important` | High | Significant bugs, architectural concerns, missing tests |
| `helpful` | Medium | Good suggestions that improve code quality |
| `nuance` | Lowest | Minor style preferences, optional improvements |

### Priority Assignment

**Critical** (must fix before merge):
- Security vulnerabilities
- Crashes or data corruption
- Broken functionality
- Critical bugs

**Important** (should address):
- Significant bugs
- Missing error handling
- Performance issues
- Missing tests for critical paths
- Architectural concerns

**Helpful** (nice to have):
- Code quality improvements
- Documentation enhancements
- Refactoring suggestions
- Optimization opportunities

**Nuance** (optional):
- Style preferences
- Naming conventions
- Minor formatting
- Personal preferences

## References

See `references/categorization-examples.md` for detailed examples of each category and priority combination.

## Command Reference

| Command | Description |
|---------|-------------|
| `gh pr list --head <branch>` | Find PR by branch |
| `gh pr view <num> --comments` | View PR with comments |
| `gh api repos/<owner>/<repo>/pulls/<num>/comments` | List all PR comments |
| `gh pr comment <comment-id> --body "message"` | Reply to a specific comment |
| `gh api repos/{owner}/{repo}/pulls/{num}/comments` | API for detailed comments |

Base directory for this skill: file:///mnt/c/Users/prull/Documents/GitHub/slate/.agents/skills/pr-comment-analyzer
Relative paths in this skill (e.g., references/) are relative to this base directory.
