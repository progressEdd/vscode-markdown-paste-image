# Testing Patterns

**Analysis Date:** 2026-03-06

## Test Framework

**Runner:**

- Mocha 10.8.2
- Interface: TDD (test-driven development)
- Config: Inline in `test/suite/index.ts`

**Assertion Library:**

- Node.js built-in `assert` module
- Assertions used: `assert.strictEqual()`, `assert.ok()`, `assert.deepStrictEqual()`, `assert.notStrictEqual()`, `assert.fail()`

**Run Commands:**

```bash
npm run test              # Run all tests (compiles first)
npm run pretest           # Compile tests and copy resources
```

**Test Process:**

1. Pretest script cleans `out_test` directory
2. Runs Prettier formatting
3. Runs ESLint linting
4. Compiles test TypeScript using `ts-test.json`
5. Copies resources from `res/` to `out_test/res/`
6. Runs tests via `node ./out_test/test/runTest.js`
7. VSCode test-electron downloads and launches VSCode instance

## Test File Organization

**Location:**

- Pattern: Separate `test/` directory
- Test root: `test/`
- Test suites: `test/suite/`
- Test runner: `test/runTest.ts`

**Naming:**

- Pattern: `*.test.ts` suffix
- Examples: `extension.test.ts`, `toMarkdown.test.ts`, `ToolsManager.test.ts`

**Structure:**

```
test/
├── runTest.ts              # VSCode test runner entry point
├── suite/
│   ├── index.ts            # Mocha test discovery and runner
│   ├── extension.test.ts   # Extension integration tests
│   ├── toMarkdown.test.ts  # Markdown conversion tests
│   └── ToolsManager.test.ts # Tools manager unit tests
```

## Test Structure

**Suite Organization:**

```typescript
import * as assert from "assert";

// Define test suite with suite()
suite("Suite Name", () => {
  // Setup hook (optional)
  setup(() => {
    // Initialize test fixtures
  });

  // Individual test with test()
  test("should do something", () => {
    const result = functionUnderTest();
    assert.strictEqual(result, expected);
  });

  // Async test
  test("async operation", async () => {
    const result = await asyncFunction();
    assert.ok(result);
  });
});
```

**Patterns:**

- `suite()` to group related tests
- `setup()` for test initialization (runs before each test)
- `test()` for individual test cases
- Async tests use `async () =>` arrow functions
- Descriptive test names: "should do something when condition"

## Mocking

**Framework:** Rewire 6.0.0

**Patterns:**

```typescript
// Using rewire to access private functions
var rewire = require("rewire");
var paster = rewire("../../src/paster.js");

// Access non-exported functions
let ret = paster.Paster.parsePasteImageContext("d:/abc/efg/images/test.png");

// Override methods for testing
const originalGetConfig = paster.Paster.getConfig;
paster.Paster.getConfig = function () {
  const config = originalGetConfig.apply(this);
  return {
    ...config,
    encodePath: "encodeSpaceOnly",
  };
};
// ... test code ...
paster.Paster.getConfig = originalGetConfig; // Restore
```

**What to Mock:**

- Static methods for configuration changes
- Private/internal functions via rewire
- External dependencies (file system, network)

**What NOT to Mock:**

- Pure functions with deterministic output
- Simple utility functions
- Test assertion methods

## Fixtures and Factories

**Test Data:**

```typescript
// Inline test data
const html = `
  <table>
    <tr>
      <td>Option A | Option B</td>
    </tr>
  </table>
`;

// Test data classes for mocking
class PredefineTest extends Predefine {
  public datetime(dateformat: string = "yyyyMMDDHHmmss") {
    return `datetime('${dateformat}')`;
  }

  public workspaceRoot() {
    return "/telesoho/workspaceRoot";
  }
}
```

**Location:**

- Inline in test files
- No separate fixture directory
- Temporary files created in OS temp directory: `tmpdir()`

## Coverage

**Requirements:** None enforced

**Coverage Command:** Not configured

**Coverage Approach:**

- Manual test coverage via running tests
- No Istanbul/nyc coverage reports
- Tests focus on critical paths and edge cases

## Test Types

**Unit Tests:**

- Test individual functions and classes in isolation
- Examples: `ToolsManager.test.ts`, `toMarkdown.test.ts`
- Pattern: Import module, test public methods
- Use rewire for testing private functions

**Integration Tests:**

- Test extension activation and VSCode integration
- Examples: `extension.test.ts`
- Pattern: Test with actual VSCode API
- Download files from internet for real-world testing

**E2E Tests:**

- Framework: `@vscode/test-electron` 2.4.1
- Launches actual VSCode instance
- Tests extension in real environment
- Located in `test/runTest.ts`

## Common Patterns

**Async Testing:**

```typescript
// Async test with await
test("async operation", async () => {
  const result = await asyncFunction();
  assert.strictEqual(result, expected);
});

// Promise-based test
test("promise test", () => {
  return asyncFunction()
    .then((result) => {
      assert.ok(result);
    })
    .catch((err) => {
      console.log(err);
    });
});
```

**Error Testing:**

```typescript
// Test error handling
test("should handle errors in tool function", async () => {
  const toolFunc = () => {
    throw new Error("Test error");
  };

  toolsManager.registerTool(toolName, toolFunc, description, params);

  const result = await toolsManager.executeTool(toolName, {});
  assert.strictEqual(result, null);
});

// Test that error is caught
test("executeTool should return null for unregistered tool", async () => {
  const result = await toolsManager.executeTool("nonexistent_tool", {});
  assert.strictEqual(result, null);
});
```

**Setup/Teardown:**

```typescript
suite("ToolsManager Tests", () => {
  let toolsManager: ToolsManager;

  // Runs before each test
  setup(() => {
    toolsManager = new ToolsManager();
  });

  test("test case", () => {
    // toolsManager is fresh for each test
  });
});
```

**Parameterized Tests:**

```typescript
// Multiple assertions in one test
test("should handle multiple pipe characters in table cell", () => {
  const html = `<table>...</table>`;
  const result = toMarkdown(html, { emDelimiter: "*" });

  // Multiple assertions
  assert.ok(result.includes("a \\|= y \\| b"), `Expected all pipes escaped`);
});
```

## Test Discovery

**Pattern:**

- Mocha discovers tests via `test/suite/index.ts`
- Recursively finds `*.test.js` files
- Adds them to Mocha suite
- Runs with TDD interface

**Implementation:**

```typescript
export async function run(): Promise<void> {
  const mocha = new Mocha({
    ui: "tdd",
    color: true,
  });

  // Find all test files
  function findTestFiles(dir: string, fileList: string[] = []): string[] {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        findTestFiles(filePath, fileList);
      } else if (file.endsWith(".test.js")) {
        fileList.push(path.relative(testsRoot, filePath));
      }
    });
    return fileList;
  }

  const files = findTestFiles(testsRoot);
  for (const f of files) {
    mocha.addFile(path.resolve(testsRoot, f));
  }

  // Run tests
  return new Promise<void>((c, e) => {
    mocha.run((failures) => {
      if (failures > 0) {
        e(new Error(`${failures} tests failed.`));
      } else {
        c();
      }
    });
  });
}
```

## Test Configuration

**TypeScript Config for Tests:**

- File: `ts-test.json`
- Extends: `ts-config.base.json`
- Out directory: `out_test/`
- Include: `test/**/*`
- Separate from source compilation

**Pretest Script:**

```json
"pretest": "rimraf ./out_test && npm run prettier && npm run lint && tsc --project ./ts-test.json && npx cpy-cli \"res/**/*\" \"out_test/res\""
```

Steps:

1. Clean output directory
2. Format code with Prettier
3. Lint with ESLint
4. Compile test TypeScript
5. Copy test resources

---

_Testing analysis: 2026-03-06_
