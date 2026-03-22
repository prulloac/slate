---
name: pr-comment-analyzer
description: Analyze pull request comments using gh CLI. Use when user wants to review, categorize, or prioritize PR comments. Retrieves comments from specified PR or automatically detects from current branch, verifies applicability against current code, marks outdated comments, and presents filtered results with resolution order based on impact and side-effect analysis.
---

# PR Comment Analyzer

This skill retrieves pull request comments using the `gh` CLI, categorizes them by type, prioritizes them by severity, and suggests a resolution order based on impact analysis and side-effect evaluation of affected code sections.

## Workflows

### Retrieve PR Comments

1. **Determine target PR**:
   - If PR number specified: `gh pr view <number> --comments`
   - If no PR specified: Run `gh pr list` to find PR matching current branch

2. **Fetch comments**: `gh api repos/<owner>/<repo>/pulls/<num>/comments` to get all comments with metadata (commenter, file, line, content)

3. **Assess each comment**:
   - Assign a **category** based on content type
   - Assign a **priority** based on severity

4. **Verify applicability**:
   - For each comment, examine the relevant code sections mentioned
   - Check if the issue still exists in the current codebase
   - Mark comments as "outdated" if the issue has been resolved or no longer applies
   - Use code reading tools to inspect files and verify comment validity

5. **Analyze impact and side effects**:
   - For each unresolved comment, assess the impact on functionality and security
   - Evaluate potential side effects by examining code dependencies and usage patterns
   - Consider testing requirements and risk of introducing regressions

6. **Determine resolution order**:
   - Sort unresolved comments by priority (Critical > Important > Helpful > Nuance)
   - Within each priority level, order by side effect complexity (low-risk first)
   - Suggest implementation sequence that minimizes cascading changes

7. **Handle outdated comments**:
   - For each outdated comment, reply using `gh api -X POST repos/<owner>/<repo>/pulls/<pr-number>/comments/<comment-id>/replies -f body="This comment is outdated and will not be fixed."`
   - Remove outdated comments from further processing

8. **Present results**: Format output with categorized comments, priority tables, and resolution order

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
| Comment # & Link | Commenter | Summary | Type | Impact | Side Effects |
|------------------|-----------|---------|------|--------|--------------|
| [#123](link) | @username | Brief summary of the comment | security | High - affects security | Low - isolated to CSP header |

#### 🟠 Important
| Comment # & Link | Commenter | Summary | Type | Impact | Side Effects |
|------------------|-----------|---------|------|--------|--------------|
| [#124](link) | @username | Brief summary of the comment | refactor | Medium - improves maintainability | Medium - affects multiple components |

#### 🟡 Helpful
| Comment # & Link | Commenter | Summary | Type | Impact | Side Effects |
|------------------|-----------|---------|------|--------|--------------|
| [#125](link) | @username | Brief summary of the comment | improvement | Low - minor enhancement | Low - localized change |

#### ⚪ Nuance
| Comment # & Link | Commenter | Summary | Type | Impact | Side Effects |
|------------------|-----------|---------|------|--------|--------------|
| [#126](link) | @username | Brief summary of the comment | nitpicking | Very Low - style only | Very Low - no functional impact |

---

### Resolution Order

Based on impact analysis and side effect complexity, implement changes in this order:

1. **High Impact, Low Risk**: Critical security issues and error handling
2. **Medium Impact, Low Risk**: Important structural improvements  
3. **Low Impact, Low Risk**: Helpful enhancements and optimizations
4. **Very Low Impact**: Style and nitpicking improvements

**Suggested Implementation Sequence:**
1. [#123](link) - Security fix (immediate priority)
2. [#124](link) - Error handling (prevents runtime issues)
3. [#125](link) - UI improvement (enhances UX)
4. [#126](link) - Code style (last priority)

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
| `gh api -X POST repos/<owner>/<repo>/pulls/<pr-number>/comments/<comment-id>/replies -f body="message"` | Reply to a specific comment |
| `gh api repos/{owner}/{repo}/pulls/{num}/comments` | API for detailed comments |

Base directory for this skill: file:///mnt/c/Users/prull/Documents/GitHub/slate/.agents/skills/pr-comment-analyzer
Relative paths in this skill (e.g., references/) are relative to this base directory.
