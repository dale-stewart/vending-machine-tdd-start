# TDD Guidelines

## The TDD Cycle

### 0. Setup

Look for `EXERCISE.md` in the active working directory. If found, propose starting on the first incomplete step using TDD. If not found, prompt the user to either paste the contents here or copy a file into the working directory. If they paste, write the content to `EXERCISE.md` and save it to disk.

Once an exercise is established, confirm the directory is a git repository. If not, initialize one and propose a baseline commit.

Let me know that at any time I can type `code review` or `code-review` to trigger a code review by a separate agent, which will present suggestions one at a time for my approval.

### 1. Red

Write a failing test. A test that fails to compile is acceptable failure.

If the test fails due to a compilation error — such as a missing type, object, or method — make the structural stub explicit first, then confirm the test fails via the assertion.

**Prompt me** once the test is compiling and red before proceeding to Green. Always show the full test failure output — whether it's a thrown error or a failed assertion.

**When adding lines to the implementation file**, state how many lines were added.

### 2. Green

Write only enough production code to make the failing test pass. Abide by the Three Laws:

1. You may not write production code unless it is to make a failing test pass.
2. You may not write more of a unit test than is sufficient to fail.
3. You may not write more production code than is sufficient to make the failing test pass.

**Prompt me** once the test is green before proceeding to Refactor. Then commit.

### 3. Run the Entire Test File

After going green, run all tests in the test file.

### 4. Refactor

Look for opportunities to refactor:

- The new implementation
- The new test
- Tests similar to the new test

Look for better names, reduced duplication, and emerging patterns. Propose each refactor individually and wait for approval before applying it. After all refactors are complete, commit. If there are no suggested refactors, prompt me before moving on.

### 5. Run the Entire Test File

After refactoring, run all tests in the test file.

### 6. Record progress

Record your status in PROGRESS.md

### 7. Repeat

Never have more than one failing test at a time. When given a feature to implement, break it into the smallest domain parts and TDD each separately.

---

## Code Review

When the user types `code review` or `code-review`:

1. Spin off a separate agent to review the current implementation file.
2. The agent presents each suggestion individually — one at a time — with a brief explanation.
3. Wait for the user to approve or disapprove each suggestion before presenting the next.
4. Apply only approved suggestions.
5. Run the entire test file after all approved suggestions have been applied.

---

## Test Design

**Unit tests by default.** Unless otherwise specified, all tests are unit tests.

**One assertion per test.** Rather than asserting multiple properties individually, favor deep equality of objects. If objects lack the equality support needed, offer to write it.

**Mock minimally.** Favor assertion of results over mocking. Avoid testing interactions that are already implied by more specific assertions — for example, do not pair `expect(method).toBeCalled()` with `expect(method).toBeCalledWith(...)` when the latter alone satisfies both.

**Avoid parameterized tests** unless there is an exceptional case. If one arises, flag it and seek approval before proceeding.

---

## Code Style

**Comments** should only be TODOs or descriptions of exceptional cases that, if left uncommented, could confuse future readers.

**File ordering.** When adding something to a file at global scope, place it according to the file's ordering convention.

**Test line numbers** refer to the line of the `it(` call.
