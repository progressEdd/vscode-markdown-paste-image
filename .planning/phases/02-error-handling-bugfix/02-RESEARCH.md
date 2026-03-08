# Research: Phase 2 - Error Handling Bugfix

## Problem Statement

Unhandled promise rejections in `telesoho.insertMathSymbol` command causing VSCode Extension Host warnings.

## Investigation

### 1. Error Location

**File:** `src/extension.ts`
**Lines:** 49-54, 23-41

### 2. VSCode Best Practices for Promise Handling

Per VSCode extension API guidelines:

1. **All async operations should be handled** - Use `.catch()` or `try/catch` with `async/await`
2. **Command registrations should be disposed** - Add to `context.subscriptions`
3. **Editor operations return promises** - `editor.edit()` returns `Thenable<boolean>`

### 3. Pattern Analysis

**Current problematic pattern:**

```typescript
vscode.commands.registerCommand("command", () => {
  asyncOperation().then(callback); // No .catch()
});
```

**Recommended patterns:**

**Option A - Async/Await with try/catch:**

```typescript
vscode.commands.registerCommand("command", async () => {
  try {
    const result = await asyncOperation();
    await callback(result);
  } catch (error) {
    // Handle error gracefully
  }
});
```

**Option B - Promise with catch:**

```typescript
vscode.commands.registerCommand("command", () => {
  asyncOperation()
    .then(callback)
    .catch((error) => {
      // Handle error gracefully
    });
});
```

### 4. Comparison with Other Commands in Extension

Looking at other commands in the same file:

```typescript
// Lines 57-60, 62-65, 67-70, 72-75
context.subscriptions.push(
  vscode.commands.registerCommand("telesoho.MarkdownDownload", () => {
    Paster.pasteDownload(); // Returns Promise, but not handled
  })
);
```

All other commands also have unhandled promises from `Paster` methods that are async.

### 5. Recommended Solution

For `telesoho.insertMathSymbol`:

1. Convert `insertToEditor` to async with proper error handling
2. Use async/await in command handler with try/catch
3. Add command to `context.subscriptions`

For `insertToEditor` method:

1. Chain the edit promises properly
2. Handle failures gracefully

## Technical Decisions

1. **Use async/await pattern** - More readable than `.then().catch()` chains
2. **Log errors via Logger** - Consistent with extension's logging pattern
3. **No user-facing error messages** - Quick pick dismissal is not an error
4. **Add subscription** - Follow same pattern as other commands

## Files to Modify

- `src/extension.ts` - Fix promise handling and add subscription

