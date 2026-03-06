# Codebase Structure

**Analysis Date:** 2026-03-06

## Directory Layout

```
vscode-markdown-paste-image/
├── .github/              # GitHub workflows
├── .planning/            # Planning documents (generated)
├── .vscode/              # VSCode workspace settings
├── res/                  # Extension resources
│   └── images/           # Extension icon and images
├── snippets/             # Markdown snippets
├── src/                  # TypeScript source code
├── test/                 # Test files
│   └── suite/            # Test suites
├── xclip/                # Clipboard library submodule
├── .eslintrc.json        # ESLint configuration
├── .prettierrc.json      # Prettier configuration
├── package.json          # Extension manifest
├── tsconfig.json         # TypeScript configuration
└── ts-test.json          # TypeScript test configuration
```

## Directory Purposes

**src/:**

- Purpose: Extension source code
- Contains: TypeScript modules (.ts files)
- Key files: `extension.ts`, `paster.ts`, `ai_paster.ts`
- Naming: Lowercase with underscores for multi-word

**test/:**

- Purpose: Integration tests
- Contains: Mocha test runner and test suites
- Key files: `runTest.ts`, `suite/index.ts`

**res/:**

- Purpose: Static resources bundled with extension
- Contains: Extension icon, images
- Bundled: Copied to `out_test/res/` during test build

**snippets/:**

- Purpose: VSCode snippets contribution
- Contains: `snippets.json` - Markdown snippets
- Registered: In package.json contributes.snippets

**xclip/:**

- Purpose: Clipboard handling library (submodule)
- Contains: Native clipboard access code
- Note: External dependency as git submodule

## Key File Locations

**Entry Points:**

- `src/extension.ts`: Main extension activation
- `test/runTest.ts`: Test runner entry point

**Configuration:**

- `package.json`: Extension manifest, commands, configuration schema
- `tsconfig.json`: TypeScript compiler options
- `ts-test.json`: TypeScript config for tests
- `.eslintrc.json`: Linting rules
- `.prettierrc.json`: Code formatting

**Core Logic:**

- `src/paster.ts`: Main paste logic (646 lines)
- `src/ai_paster.ts`: AI integration (157 lines)
- `src/toMarkdown.ts`: HTML to Markdown conversion (283 lines)
- `src/predefine.ts`: Variable substitution (168 lines)
- `src/utils.ts`: File and utility functions (143 lines)

**Supporting:**

- `src/Logger.ts`: Logging utility (32 lines)
- `src/language_detection.ts`: Code language detection (97 lines)
- `src/ToolsManager.ts`: AI tool registry (79 lines)
- `src/tool_functions.ts`: AI tool implementations (26 lines)
- `src/latex.ts`: Math symbol definitions (3942 lines - data file)

**Testing:**

- `test/runTest.ts`: VSCode test runner
- `test/suite/index.ts`: Mocha test discovery
- `test/suite/*.test.ts`: Individual test files

## Naming Conventions

**Files:**

- Source: `lowercase.ts` or `lowercase_with_underscore.ts`
- Tests: `*.test.ts` suffix
- Configuration: `.*rc.json` or `*.json`

**Classes:**

- PascalCase: `Paster`, `AIPaster`, `Predefine`, `Logger`, `ToolsManager`, `LanguageDetection`
- Data classes: `PasteImageContext`

**Functions/Methods:**

- camelCase: `paste()`, `parse()`, `callAI()`, `writeToEditor()`
- Private/static indicator: No underscore prefix

**Constants:**

- camelCase for object maps: `emojiSymbols`, `mathSymbols`
- UPPER_CASE not used

## Where to Add New Code

**New Paste Type/Handler:**

- Primary: `src/paster.ts`
- Add case to `paste()` switch statement
- Add helper method if complex

**New AI Tool:**

- Implementation: `src/tool_functions.ts`
- Registration: `src/ToolsManager.ts` → `registerDefaultTools()`
- Types: Use OpenAI `ChatCompletionTool` type

**New Configuration Option:**

- Schema: `package.json` → `contributes.configuration.properties`
- Access: `Paster.getConfig().<optionName>`

**New Command:**

- Registration: `src/extension.ts` → `activate()`
- Manifest: `package.json` → `contributes.commands`, `contributes.keybindings`, `contributes.menus`

**New Utility Function:**

- Location: `src/utils.ts`
- Export: Add to export statement at bottom

**New Variable for Paths:**

- Implementation: `src/predefine.ts`
- Add method to `Predefine` class
- Update `replaceRegPredefinedVars()` if needed

**New Language Rule:**

- Default config: `package.json` → `contributes.configuration.properties.MarkdownPaste.lang_rules.default`
- Processing: `src/paster.ts` → `parse_rules()` method

**New Test:**

- Location: `test/suite/`
- Naming: `<module>.test.ts`
- Framework: Mocha with TDD interface

## Special Directories

**.planning/:**

- Purpose: Generated planning documents
- Generated: Yes (by GSD tools)
- Committed: Yes (for team reference)

**out/:**

- Purpose: Compiled JavaScript output
- Generated: Yes (by `npm run compile`)
- Committed: No (in .gitignore)
- Entry: `out/extension.js`

**out_test/:**

- Purpose: Compiled test output
- Generated: Yes (by `npm run pretest`)
- Committed: No

**xclip/:**

- Purpose: Clipboard library submodule
- Generated: No (external git submodule)
- Committed: As submodule reference

## Build Output Structure

```
out/                     # Production build
├── extension.js         # Main entry point
├── paster.js
├── ai_paster.js
└── ...

out_test/                # Test build
├── test/
│   ├── runTest.js
│   └── suite/
└── res/                 # Copied resources
```

## Import Patterns

**Standard order:**

1. Node.js built-ins (`path`, `fs`, `os`, `url`, `http`, `https`)
2. External packages (`vscode`, `openai`, `axios`, `moment`, `turndown`)
3. Local modules (relative imports)

**Path aliases:**

- None configured
- All imports use relative paths: `import { X } from "./module"`

---

_Structure analysis: 2026-03-06_
