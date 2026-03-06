# Architecture

**Analysis Date:** 2026-03-06

## Pattern Overview

**Overall:** VSCode Extension with Command Pattern

**Key Characteristics:**

- Extension host activation on markdown language
- Static class methods for core operations
- Delegate pattern for AI integration
- Plugin-style tool registration

## Layers

**Extension Layer:**

- Purpose: VSCode integration and command registration
- Location: `src/extension.ts`
- Contains: Command handlers, activation/deactivation lifecycle
- Depends on: VSCode API, Paster class
- Used by: VSCode extension host

**Core Logic Layer:**

- Purpose: Clipboard processing and markdown generation
- Location: `src/paster.ts`
- Contains: Paster class with static methods for all paste operations
- Depends on: xclip, toMarkdown, Predefine, AIPaster, utils
- Used by: Extension layer

**AI Integration Layer:**

- Purpose: OpenAI API integration for AI-powered clipboard processing
- Location: `src/ai_paster.ts`, `src/ToolsManager.ts`, `src/tool_functions.ts`
- Contains: AIPaster class, tool execution, OpenAI client wrapper
- Depends on: openai SDK, Paster (for config), Logger
- Used by: Core Logic Layer

**Support Layer:**

- Purpose: Cross-cutting utilities and helpers
- Location: `src/utils.ts`, `src/predefine.ts`, `src/toMarkdown.ts`, `src/language_detection.ts`, `src/Logger.ts`
- Contains: File operations, variable substitution, HTML-to-Markdown, language detection, logging
- Depends on: Various npm packages (moment, turndown, uuid, etc.)
- Used by: All other layers

## Data Flow

**Markdown Paste Flow:**

1. User triggers command (Ctrl+Alt+V or menu)
2. `extension.ts` calls `Paster.paste()`
3. Paster reads clipboard type via xclip
4. Based on type:
   - **Image**: Save to disk → Generate markdown link → Insert in editor
   - **HTML**: Convert via `toMarkdown()` → Apply rules → Insert in editor
   - **Text**: Apply regex rules → Optionally process via AI → Insert in editor
5. If AI enabled: `AIPaster.callAI()` processes content through OpenAI

**Image Paste Flow:**

1. Generate target path via `genTargetImagePath()`
2. Check for matching image rules in config
3. Save clipboard image to disk
4. Generate markdown link with optional width/height
5. Insert into active editor

**AI Processing Flow:**

1. `AIPaster.callAI()` receives clipboard text
2. Load completion template from config or file
3. Replace `{{clipboard_text}}` placeholder
4. Call OpenAI API with optional tools
5. Handle tool calls if present
6. Return processed markdown

## Key Abstractions

**Paster (Static Class):**

- Purpose: Central coordinator for all paste operations
- Examples: `src/paster.ts`
- Pattern: Static utility class with no instance state
- Key methods:
  - `paste()` - Main entry for clipboard paste
  - `pasteCode()` - Code block generation with language detection
  - `pasteDownload()` - Download URL from clipboard
  - `parse()` - Apply regex rules to content

**PasteImageContext (Data Class):**

- Purpose: Encapsulates image paste configuration
- Examples: `src/paster.ts` (lines 18-26)
- Pattern: Simple data transfer object
- Properties: targetFile, convertToBase64, removeTargetFileAfterConvert, imgTag

**Predefine (Class):**

- Purpose: Variable substitution for path templates
- Examples: `src/predefine.ts`
- Pattern: Evaluator with predefined variable support
- Supported variables: `${datetime}`, `${fileDirname}`, `${fileBasename}`, `${uuid}`, etc.

**ToolsManager (Class):**

- Purpose: Register and execute AI tools/functions
- Examples: `src/ToolsManager.ts`
- Pattern: Registry pattern with OpenAI tool format conversion

**LanguageDetection (Class):**

- Purpose: Detect programming language for code blocks
- Examples: `src/language_detection.ts`
- Pattern: Model-based detection using VSCode's language detection

## Entry Points

**Extension Activation:**

- Location: `src/extension.ts`
- Triggers: `onLanguage:markdown` activation event
- Responsibilities:
  - Create output channel for logging
  - Register 5 commands
  - Load latex symbols for math symbol picker

**Commands:**

- `telesoho.MarkdownPaste` (Ctrl+Alt+V) - Smart paste with type detection
- `telesoho.MarkdownPasteCode` (Ctrl+Alt+C) - Paste as code block with language detection
- `telesoho.MarkdownDownload` (Ctrl+Alt+D) - Download URL as image
- `telesoho.MarkdownRuby` (Ctrl+Alt+T) - Insert ruby HTML tag
- `telesoho.insertMathSymbol` (Ctrl+Alt+\) - Quick pick for math symbols

**Configuration Entry:**

- Location: `package.json` (contributes.configuration)
- Scope: Resource-level configuration
- Categories: AI settings, path settings, rules, encoding

## Error Handling

**Strategy:** Try-catch with user notifications

**Patterns:**

- VSCode message API for user-facing errors: `Logger.showErrorMessage()`
- Graceful fallbacks (AI fails → use original content)
- Pre-validation (file exists check, untitled document check)
- Remote mode detection with warning dialog

**Error Propagation:**

```
Operation Error → Logger.log() → vscode.window.showErrorMessage()
```

## Cross-Cutting Concerns

**Logging:**

- Centralized via `Logger` class
- Output channel: "Markdown Paste"
- Timestamps with moment.js format
- Truncation at 256 characters

**Validation:**

- Path validation (trailing slashes, invalid characters)
- File existence checks
- Clipboard type validation
- Remote mode detection

**Configuration Access:**

- Static `Paster.getConfig()` method
- Workspace-aware with file URI scope
- Cached config access via getter

**Clipboard Abstraction:**

- xclip library for cross-platform clipboard access
- Type detection (Image, HTML, Text, Unknown)
- Priority-based auto-selection

---

_Architecture analysis: 2026-03-06_
