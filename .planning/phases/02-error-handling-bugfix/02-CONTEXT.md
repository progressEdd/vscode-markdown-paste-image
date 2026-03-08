# Context: Phase 2 - Error Handling Bugfix

## Current Situation

### Bug Report

**Error Message:**

```
[Extension Host] rejected promise not handled within 1 second: Error: target STRING not available
```

**Symptoms:**

1. Console shows "rejected promise not handled" warning
2. Context menu "Markdown Paste" doesn't work (no action, no error)
3. Keyboard shortcut `Ctrl+Alt+V` doesn't paste anything (no action, no error)
4. All paste operations fail silently without user feedback

**Stack Trace:**

```
workbench.desktop.main.js:537 - $logExtensionHostMessage
workbench.desktop.main.js:4204 - _doInvokeHandler
...
```

[Extension Host] rejected promise not handled within 1 second: Error: target STRING not available

```

**Stack Trace:**

```

workbench.desktop.main.js:537 - $logExtensionHostMessage
workbench.desktop.main.js:4204 - \_doInvokeHandler
...

````

### Root Cause Analysis

Multiple commands in `src/extension.ts` have unhandled promise rejections:

**1. telesoho.insertMathSymbol** (lines 49-54):

```typescript
vscode.commands.registerCommand("telesoho.insertMathSymbol", () => {
  vscode.window
    .showQuickPick(LatexMathSymbol.getItems(), {
      ignoreFocusOut: true,
    })
    .then(LatexMathSymbol.insertToEditor);
});
````

**Issues:**

- `showQuickPick().then()` has no `.catch()` handler
- Command registration not added to `context.subscriptions`
- Nested `editor.edit()` promises in `insertToEditor` (lines 32-40) are unhandled

**2. telesoho.MarkdownPaste** (lines 62-64):

```typescript
vscode.commands.registerCommand("telesoho.MarkdownPaste", () => {
  Paster.paste(); // Returns Promise<void>, not handled
});
```

**Issues:**

- `Paster.paste()` is async but promise not awaited/handled
- **Context menu failure**: When invoked from context menu, unhandled promise causes command to fail silently

**3. telesoho.MarkdownDownload** (lines 57-59):

```typescript
vscode.commands.registerCommand("telesoho.MarkdownDownload", () => {
  Paster.pasteDownload(); // Returns Promise<void>, not handled
});
```

**Issues:**

- `Paster.pasteDownload()` is async but promise not awaited/handled

**4. telesoho.MarkdownPasteCode** (lines 72-74):

```typescript
vscode.commands.registerCommand("telesoho.MarkdownPasteCode", () => {
  Paster.pasteCode(); // Returns Promise<void>, not handled
});
```

**Issues:**

- `Paster.pasteCode()` is async but promise not awaited/handled

**5. telesoho.MarkdownRuby** (line 68):

```typescript
Paster.Ruby(); // Not async, returns void - OK
```

**Impact**

- **User Impact**: Console errors and silent failures
- **Context Menu**: Markdown Paste doesn't work when invoked from editor context menu
- **Extension Stability**: Unhandled rejections can cause unpredictable behavior
- **VSCode Warnings**: "rejected promise not handled within 1 second" warnings in developer console

## Why This Phase

Phase 1 (Wayland Integration) focused on adding Wayland clipboard support. This bug exists in the core extension code and was not in scope for Phase 1. Proper error handling is critical for production stability.

## Constraints

- Must maintain existing behavior (no functional changes)
- Must follow VSCode extension best practices for promise handling
- All commands should be properly registered with subscriptions
- Use `bun` instead of `npm` for all build/test commands
