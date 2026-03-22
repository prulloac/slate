# PR Comment Categorization Examples

This document provides examples for categorizing and prioritizing pull request comments.

## Category Examples

### Security

| Comment | Why Category |
|---------|--------------|
| "This endpoint doesn't validate user input, allowing SQL injection" | Direct vulnerability mention |
| "API key is exposed in this response body" | Credential exposure |
| "We should add CSRF protection to this form" | Security mechanism missing |
| "This query is vulnerable to injection attacks" | Injection vulnerability |
| "User permissions aren't checked before this operation" | Access control issue |

### Documentation

| Comment | Why Category |
|---------|--------------|
| "Please add JSDoc comments to this function" | Missing code documentation |
| "The README should be updated to reflect this new parameter" | Doc update needed |
| "Can you explain why we're using this algorithm?" | Clarification request |
| "Add usage examples for this new API endpoint" | Example request |
| "This complex logic needs more comments" | Code explanation needed |

### Nitpicking

| Comment | Why Category |
|---------|--------------|
| "Can we use camelCase instead of snake_case here?" | Naming preference |
| "Trailing whitespace on line 42" | Whitespace issue |
| "Missing semicolon" | Style preference |
| "This could use more consistent indentation" | Formatting |
| "Variable name `x` is unclear, consider renaming" | Naming suggestion |

### Refactor

| Comment | Why Category |
|---------|--------------|
| "This function is doing too many things, let's extract some logic" | Function too long |
| "There's duplicate code in lines 10-15 and 20-25" | Duplication |
| "Consider using a Strategy pattern here" | Design pattern suggestion |
| "This nested callback should use async/await" | Code structure |
| "The validation logic should be separated from the controller" | Separation of concerns |

### Improvement

| Comment | Why Category |
|---------|--------------|
| "This could be optimized with memoization" | Performance optimization |
| "Consider caching this API response" | Caching suggestion |
| "We might want to add retry logic here" | Resilience improvement |
| "This could benefit from lazy loading" | UX/performance enhancement |
| "Adding a progress indicator would improve UX" | User experience |

---

## Priority Examples

### Critical Priority

| Comment | Reason |
|---------|--------|
| "This allows arbitrary code execution through user input" | Security vulnerability |
| "This will crash when the database is unavailable" | Broken functionality |
| "User passwords are being logged in plaintext" | Data exposure |
| "This race condition causes data corruption" | Data integrity |
| "Memory leak in the connection handler" | Resource exhaustion |

### Important Priority

| Comment | Reason |
|---------|--------|
| "This doesn't handle the null case and will throw" | Missing error handling |
| "Missing unit tests for the payment module" | Missing test coverage |
| "This approach won't scale past 1000 users" | Scalability concern |
| "The auth middleware is completely missing" | Security mechanism missing |
| "This will cause issues with timezone handling" | Edge case bug |

### Helpful Priority

| Comment | Reason |
|---------|--------|
| "Using a Set would be more efficient for lookups here" | Performance improvement |
| "This could be simplified with Optional chaining" | Code simplification |
| "Consider extracting this to a utility function" | Code reuse |
| "Adding type assertions would make this clearer" | Code clarity |
| "This loop could be parallelized for better performance" | Performance |

### Nuance Priority

| Comment | Reason |
|---------|--------|
| "Alphabetical ordering would be more consistent" | Ordering preference |
| "We could use const instead of let here" | Minor optimization |
| "Slightly cleaner to use template literal" | Style preference |
| "Optional: use destructuring here" | Syntactic preference |
| "Consider adding a blank line for readability" | Formatting |

---

## Combined Examples

| Comment | Category | Priority | Reasoning |
|---------|----------|----------|-----------|
| "SQL injection vulnerability in user search" | security | critical | Direct exploit possible |
| "Add CSRF token validation to POST endpoint" | security | important | Security mechanism missing |
| "Unvalidated user input in file upload" | security | critical | Path traversal risk |
| "Document the new environment variables" | documentation | helpful | Doc update needed |
| "Update API changelog for this release" | documentation | helpful | Maintenance task |
| "Missing JSDoc on exported functions" | documentation | important | Public API documentation |
| "Trailing spaces on lines 5, 12, 18" | nitpicking | nuance | Minor formatting |
| "Use PascalCase for React component names" | nitpicking | nuance | Naming convention |
| "Property names should be consistent" | nitpicking | helpful | Code consistency |
| "Extract database queries to repository layer" | refactor | important | Architectural improvement |
| "This 500-line function should be split up" | refactor | important | Code smell |
| "Consider using early returns to reduce nesting" | refactor | helpful | Code quality |
| "Add retry logic for flaky network calls" | improvement | important | Resilience |
| "Cache the expensive computation here" | improvement | helpful | Performance |
| "Consider adding keyboard shortcuts" | improvement | nuance | UX enhancement |

---

## Decision Tree

```
Is this a security issue?
├─ YES → Is it exploitable/crashing data?
│   └─ YES → Critical
│   └─ NO → Important
└─ NO
   ├─ Is this causing bugs or broken functionality?
   │   └─ YES → Important
   │   └─ NO
   │      ├─ Is this documentation related?
   │      │   └─ YES → Helpful
   │      │   
   │      ├─ Is this a refactoring opportunity?
   │      │   └─ YES → Helpful (or Important if major)
   │      │
   │      ├─ Is this an improvement/optimization?
   │      │   └─ YES → Helpful
   │      │
   │      └─ Is this purely stylistic/preferential?
   │          └─ YES → Nuance
```

## Quick Reference

| If comment mentions... | Likely Category | Likely Priority |
|------------------------|-----------------|-----------------|
| injection, exploit, vulnerability, auth bypass | security | critical/important |
| crash, bug, broken, error | - | important |
| missing test, coverage | documentation | important |
| document, explain, comment | documentation | helpful |
| naming, style, format, whitespace | nitpicking | nuance |
| extract, split, separate, refactor | refactor | helpful/important |
| optimize, cache, performance | improvement | helpful |
| consider, suggest, could | improvement | helpful/nuance |
