# External Integrations

**Analysis Date:** 2026-03-06

## APIs & External Services

**AI/LLM Services:**

- OpenAI-compatible API - AI-powered clipboard content parsing and transformation
  - SDK/Client: `openai` npm package (v4.90.0)
  - Default Provider: Groq API (`https://api.groq.com/openai/v1`)
  - Auth: API key configured via VSCode settings (`MarkdownPaste.openaiConnectOption.apiKey`)
  - Implementation: `src/ai_paster.ts`
  - Features: Chat completions with tool calling support
  - Configurable: Base URL, API key, max retries, completion templates

**HTTP Requests:**

- Image downloads: Direct HTTP/HTTPS downloads for remote image URLs
  - Implementation: `src/utils.ts` (`fetchAndSaveFile`)
  - Timeout: 10 seconds
  - Features: Follows redirects (301, 302, 307, 308)

## Data Storage

**Databases:**

- None - Extension is stateless

**File Storage:**

- Local filesystem only
  - Image paths: Configurable via `MarkdownPaste.path` setting
  - Default location: Same directory as Markdown file (`${fileDirname}`)
  - Temporary files: OS temp directory (`os.tmpdir()`)
  - Implementation: `src/utils.ts` (`prepareDirForFile`, `newTemporaryFilename`)

**Caching:**

- None - No caching layer implemented

## Authentication & Identity

**Auth Provider:**

- None - No authentication required for extension itself

**AI Service Authentication:**

- API Key based
  - Stored in: VSCode settings (user or workspace level)
  - Setting: `MarkdownPaste.openaiConnectOption.apiKey`
  - Implementation: `src/ai_paster.ts` (passed to OpenAI client constructor)

## Monitoring & Observability

**Error Tracking:**

- None - No external error tracking service

**Logs:**

- VSCode Output Channel
  - Channel name: "Markdown Paste"
  - Implementation: `src/Logger.ts`
  - Usage: Debug logging via `Logger.log()`
  - User access: View → Output → "Markdown Paste" channel

## CI/CD & Deployment

**Hosting:**

- VSCode Marketplace - Primary distribution
- Open VSX Registry - Alternative marketplace

**CI Pipeline:**

- GitHub Actions
  - Workflows: `.github/workflows/`
  - Build & Test: `build-and-test.yml` (runs on push, PR to master)
  - Publish: `publish extension.yml` (triggered by version tags v*.*.\*)
  - Pre-release: `pre-release.yml`
  - Test matrix: Ubuntu, Windows, macOS with Node.js 20.x

**Deployment Tokens:**

- `VSCE_TOKEN` - VSCode Marketplace publishing token
- `OPEN_VSX_TOKEN` - Open VSX Registry publishing token
- Stored as: GitHub Secrets (repository secrets)

## Environment Configuration

**Required env vars:**

- None for runtime
- CI only:
  - `CI: true` - Indicates CI environment
  - `DISPLAY: :99.0` - X display for Linux headless testing
  - `ELECTRON_NO_ATTACH_CONSOLE: 1` - Suppress Electron console attachment

**Secrets location:**

- VSCode settings (user/workspace level) - API keys for OpenAI-compatible services
- GitHub Secrets - Publishing tokens for CI/CD

**Configuration Files:**

- `.openaiCompletionTemplate.json` - Optional workspace-specific AI completion templates
  - Path variable: `${fileWorkspaceFolder}/.openaiCompletionTemplate.json`
  - Override: Replaces default `openaiCompletionTemplate` setting

## Webhooks & Callbacks

**Incoming:**

- None

**Outgoing:**

- OpenAI-compatible API requests
  - Endpoint: Configurable via `openaiConnectOption.baseURL`
  - Default: `https://api.groq.com/openai/v1`
  - Method: POST to `/chat/completions`
  - Payload: Chat completion requests with optional tool definitions

## Platform-Specific Considerations

**Clipboard Operations:**

- Linux: Requires `xclip` system package for image clipboard access
- Windows/macOS: Native clipboard APIs via VSCode
- Remote Mode: Image paste disabled for SSH, WSL, Dev Container (VSCode limitation)

**File System:**

- Cross-platform path handling using `path` module
- Backslash normalization to forward slashes in output paths
- Encoding options: None, encodeURI, encodeSpaceOnly

---

_Integration audit: 2026-03-06_
