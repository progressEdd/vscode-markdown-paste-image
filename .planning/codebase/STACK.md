# Technology Stack

**Analysis Date:** 2026-03-06

## Languages

**Primary:**

- TypeScript 4.9.5 - All source code in `src/` directory

**Secondary:**

- JavaScript - Generated output in `out/` and `out_test/` directories

## Runtime

**Environment:**

- Node.js 20.x - Required runtime for development and testing
- VSCode Extension Host 1.98.0+ - Extension execution environment

**Package Manager:**

- npm 10.8.2
- Lockfile: `package-lock.json` present (lockfileVersion: 3)

## Frameworks

**Core:**

- VSCode Extension API 1.98.0 - Extension host integration
- TypeScript 4.9.5 - Type-safe development

**Testing:**

- Mocha 10.8.2 - Test runner for integration tests
- @vscode/test-electron 2.4.1 - VSCode extension testing utilities

**Build/Dev:**

- TypeScript Compiler (tsc) - Transpilation to JavaScript
- ESLint 7.32.0 with @typescript-eslint - Code linting
- Prettier 2.5.1 - Code formatting

## Key Dependencies

**Critical:**

- openai 4.90.0 - OpenAI API client for AI-powered clipboard parsing
- xclip 1.0.7 - Cross-platform clipboard access (image, HTML, text)
- turndown 7.2.0 - HTML to Markdown conversion
- axios 1.11.1 - HTTP client for downloading remote images

**Infrastructure:**

- moment 2.30.1 - Date/time formatting for file naming
- uuid 11.1.0 - UUID generation for unique identifiers
- shelljs 0.8.5 - Cross-platform shell commands (mkdir -p, etc.)
- node-html-parser 6.1.13 - HTML parsing
- arch 2.2.0 - OS architecture detection
- @vscode/vscode-languagedetection 1.0.22 - Automatic language detection for code blocks

## Configuration

**Environment:**

- VSCode settings: Extension configuration via `contributes.configuration` in `package.json`
- OpenAI API: Configured through VSCode settings (`MarkdownPaste.openaiConnectOption`)
- Template file: `.openaiCompletionTemplate.json` (workspace-specific, optional)

**Build:**

- TypeScript config: `tsconfig.json` (main), `ts-test.json` (tests), `ts-config.base.json` (shared)
- Target: ES2021
- Module: Node16
- Module Resolution: Node16
- Source maps: enabled

**Linting/Formatting:**

- ESLint config: `.eslintrc.json`
- Prettier config: `.prettierrc.json` (endOfLine: auto)
- Pre-commit: npm run lint via compile script

## Platform Requirements

**Development:**

- Node.js 20.x
- npm
- xclip (Linux only, for clipboard operations)
- XVFB (Linux CI only, for headless testing)

**Production:**

- VSCode 1.98.0 or higher
- Extension runs in VSCode Extension Host
- No external runtime dependencies (bundled with extension)

---

_Stack analysis: 2026-03-06_
