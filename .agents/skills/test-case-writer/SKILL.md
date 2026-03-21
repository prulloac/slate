---
name: test-case-writer
description: Identify and document test cases for features using Gherkin syntax. Use when adding new features, writing tests, or documenting expected behavior in docs/features/<feature-name>/.
---

# Test Case Writer

This skill identifies and documents test cases for features using Gherkin syntax. Test cases are stored in `docs/features/<feature-name>/test-cases.md`.

## Directory Structure

```
docs/features/<feature-name>/
├── README.md           # Feature summary and maturity
├── plan.md             # Action plan with ordered tasks (optional)
└── test-cases.md       # Gherkin test cases for the feature
```

## Workflows

### Adding Test Cases for a Feature

1. Review feature requirements in `docs/features/<feature-name>/README.md`
2. Identify user-facing behaviors and edge cases
3. Create `docs/features/<feature-name>/test-cases.md` if not exists
4. Create or update `test-cases.md` with Gherkin scenarios
5. Group scenarios by feature area or user story

### Identifying Test Cases

When creating test cases, consider:

- **Happy path**: Normal successful behavior
- **Edge cases**: Boundary conditions, empty inputs, maximum values
- **Error handling**: Invalid inputs, missing dependencies, permission errors
- **Negative cases**: Actions that should fail appropriately
- **Alternative flows**: Different ways to accomplish the same goal
- **Integration points**: Interactions with other features or systems

## Gherkin Format

### Scenario Structure

```gherkin
Feature: Feature Name

  Scenario: Brief description of the scenario
    Given preconditions that must be met
    And additional preconditions
    When action is taken
    Then expected outcome occurs
    And another expected outcome
```

### Example

```markdown
Feature: Code Review Comments

  Scenario: Adding a comment to a code review
    Given I have opened a code review
    And the diff is visible
    When I click on a specific line number
    Then a comment input field appears
    And the cursor is focused in the input

  Scenario: Submitting an empty comment should fail
    Given I have opened the comment input
    When I click submit with empty text
    Then an error message is displayed
    And the comment is not saved

  Scenario: Comment supports markdown formatting
    Given I have opened the comment input
    When I type "**bold**" and submit
    Then the comment displays formatted text
    And the markdown is rendered correctly
```

## Format Requirements

### test-cases.md

```markdown
# Feature Name - Test Cases

## Overview
Brief description of what behaviors are tested.

## Test Scenarios

### Category: User Actions

```gherkin
Feature: Feature Name

  Scenario: Scenario title
    Given precondition
    When action
    Then outcome
```

### Category: Edge Cases

```gherkin
Feature: Feature Name - Edge Cases

  Scenario: Handling empty input
    Given precondition
    When action
    Then outcome
```
```

## Guidelines

- Each scenario should be self-contained and independently executable
- Use clear, descriptive scenario titles
- Group related scenarios under category headers
- Include both positive and negative test cases
- Document expected error messages when applicable
- Reference related features or integration points in comments

## File Naming

- Test case files: `test-cases.md`
- Group related scenarios together within the file
- Use category headers to organize different test areas
