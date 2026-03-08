# Coding Conventions

**Analysis Date:** 2026-03-06

## Naming Patterns

**Files:**

- PascalCase for class modules: `Logger.ts`, `ToolsManager.ts`, `Predefine.ts`
- snake_case for utility/functional modules: `ai_paster.ts`, `tool_functions.ts`, `language_detection.ts`
- Single-word utilities: `utils.ts`, `paster.ts`, `latex.ts`
- Test files: `*.test.ts` suffix (e.g., `extension.test.ts`, `toMarkdown.test.ts`)

**Classes:**

- PascalCase for all class names: `Logger`, `Paster`, `AIPaster`, `ToolsManager`, `LanguageDetection`, `Predefine`
- Static classes used for managers and utilities

**Methods and Functions:**

- camelCase for all methods: `getConfig()`, `writeToEditor()`, `parseByAI()`, `selectClipboardType()`
- camelCase for standalone functions: `prepareDirForFile()`, `fetchAndSaveFile()`, `base64Encode()`
- Async methods include `async` keyword: `async paste()`, `async detectLanguage()`

**Variables:**

- camelCase for local variables and parameters
- Private class members: underscore prefix (`_workspaceRoot`, `_filePath`, `_loadFailed`, `_modelOperations`)
- Constants: camelCase for instance constants (`expectedRelativeConfidence`)

**Types:**

- PascalCase for interfaces: `ToolInfo`, `PasteImageContext`
- Type aliases: PascalCase (`FunctionParameters`, `ToolFunction`)
- Generic parameter names: single letter or descriptive (`T`, `K`, etc.)

## Code Style

**Formatting:**

- Tool: Prettier 2.5.1
- Config: `.prettierrc.json` with `"endOfLine": "auto"`
- Ignore patterns in `.prettierignore`: `out`, `out_test`, `node_modules`, `.vscode`, `.vscode-test`

**Linting:**

- ESLint 7.32.0
- Parser: `@typescript-eslint/parser`
- Plugins: `prettier`, `@typescript-eslint`
- Extends: `prettier` config
- Rules: `"prettier/prettier": ["error"]`
- Run command: `bun run lint` (runs `eslint src --ext ts`)

**TypeScript Configuration:**

- Target: ES2021
- Module: Node16
- Module Resolution: Node16
- Strict mode: Not explicitly enabled
- Source maps: enabled
- No unused locals: disabled

## Import Organization

**Order:**

1. External modules (Node built-ins)
2. External packages (npm modules)
3. Local modules (relative imports)

**Patterns:**

```typescript
// Node built-ins - namespace imports
import * as path from "path";
import * as fs from "fs";
import * as os from "os";

// External packages - namespace imports
import * as vscode from "vscode";
import moment from "moment";

// External packages - named imports
import { Uri, env } from "vscode";
import { v4 as uuidv4 } from "uuid";

// Local modules - named imports
import { toMarkdown } from "./toMarkdown";
import { Predefine } from "./predefine";
import Logger from "./Logger"; // Default import
```

**Path Aliases:**

- Not used - all imports use relative paths with `./` prefix

## Error Handling

**Patterns:**

- Try-catch blocks for error-prone operations
- Logger for error logging: `Logger.log(error)` or `Logger.log('Error message:', error)`
- Return null on failure in utility functions
- VSCode API for user-facing errors: `Logger.showErrorMessage(message)`

**Examples:**

```typescript
// Utility function with try-catch
try {
  mkdir("-p", dirName);
} catch (error) {
  Logger.log(error);
  return false;
}

// Promise rejection
.catch((err) => {
  Logger.log(err);
});

// Async error handling
try {
  const result = await operation();
} catch (error) {
  Logger.log(`Error: ${error}`);
  return null;
}

// User-facing error
vscode.window.showErrorMessage("The selected text contains illegal characters!");
```

## Logging

**Framework:** Custom Logger class (`src/Logger.ts`)

**Patterns:**

```typescript
// Basic logging
Logger.log("Message", variable);

// User information
Logger.showInformationMessage("Operation completed");

// User error
Logger.showErrorMessage("Something went wrong");
```

**Log Format:**

- Timestamped: `[MM-DD HH:mm:ss] message`
- Truncated to 256 characters
- Output to VSCode output channel named "Markdown Paste"

## Comments

**When to Comment:**

- JSDoc comments for public methods and classes
- Block comments for complex logic explanations
- Inline comments for non-obvious operations

**JSDoc Pattern:**

```typescript
/**
 * Prepare directory for specified file.
 * @param filePath - The file path to prepare directory for
 */
function prepareDirForFile(filePath: string) {
  // implementation
}

/**
 * @description fetches the file from given URL and saves it in the filepath
 * @param {string} fileURL the URL of the file to be fetched
 * @param {string} filepath the directory path to store the file
 * @return {Promise} Promise object that resolves with the path
 */
```

**Usage:**

- JSDoc used for public APIs and exported functions
- Inline comments used sparingly for clarification

## Function Design

**Size:**

- Functions range from small (3-10 lines) to moderate (20-50 lines)
- Large functions exist but are uncommon (e.g., complex parsing logic)

**Parameters:**

- Multiple parameters allowed
- Optional parameters with `?` or default values
- Destructuring for configuration objects:

```typescript
public async callAI(clipboardText: string): Promise<any>
private async getModelOperations(): Promise<ModelOperations>
```

**Return Values:**

- Explicit return types declared for public methods
- `Promise<T>` for async functions
- Return early for validation failures

## Module Design

**Exports:**

- Named exports preferred: `export { toMarkdown };`
- Default exports for single-class modules: `export default class Logger`
- Named exports at end of file for multiple items:

```typescript
export {
  prepareDirForFile,
  fetchAndSaveFile,
  base64Encode,
  newTemporaryFilename,
  isRemoteMode,
};
```

**Barrel Files:**

- Not used - direct imports from individual files

**Class Organization:**

```typescript
class ClassName {
  // Static members first
  private static readonly CONSTANT = value;
  private static property: Type;

  // Instance properties
  private _property: Type;
  public property: Type;

  // Constructor
  constructor() {}

  // Public methods
  public method() {}

  // Private methods
  private helperMethod() {}

  // Static methods
  static staticMethod() {}
}
```

## Async/Await Patterns

**Usage:**

- Prefer async/await over raw promises
- Use `async` keyword for asynchronous methods
- Generator functions for async iteration: `async *generator()`

**Examples:**

```typescript
// Async method
public static async paste() {
  const content = await cb.getTextPlain();
  // process content
}

// Promise-based
return new Promise<string>((resolve, reject) => {
  // async operations
});

// Async generator
private async *detectLanguagesImpl(content: string) {
  yield languageId;
}
```

---

_Convention analysis: 2026-03-06_
