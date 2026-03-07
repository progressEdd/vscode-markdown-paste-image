# Phase 1: Wayland Integration & Testing - Context

**Gathered:** 2026-03-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Update xclip submodule to Wayland-enabled fork (wl-copy-support branch) and add real integration tests that validate clipboard operations work on both Wayland and X11 Linux systems. Tests use actual wl-copy/wl-paste and xclip tools (not mocked) and auto-detect display server at runtime.

</domain>

<decisions>
## Implementation Decisions

### Test Environment Detection

- **Detection method:** Runtime per-test detection using WAYLAND_DISPLAY and XDG_SESSION_TYPE environment variables
  - Consistent with xclip detection logic
  - Each test detects its environment before running
- **Missing tool handling:** Fail test with clear message if expected tool not available
  - wl-copy/wl-paste required for Wayland tests
  - xclip required for X11 tests
  - Clear failure messages help troubleshooting
- **CI support:** Environment-adaptive tests run on both Wayland and X11 CI systems
  - Tests auto-detect environment and run appropriate backend
  - Works locally and in CI with correct setup
- **Tool validation:** Per-test validation of required tools
  - Check tool exists before each test
  - Consistent with xclip's approach

### Integration Test Scope

- **Operations tested:** All 4 clipboard operations
  - getTextPlain (plain text)
  - getTextHtml (HTML content)
  - getImage (PNG images)
  - getContentType (content type detection)
- **Test depth:** Round-trip validation
  - Copy content to clipboard
  - Verify clipboard operation succeeds
  - Paste content from clipboard
  - Verify pasted content matches original
- **Test file:** New dedicated test file (wayland.test.ts or clipboard.test.ts)
  - Clean separation from existing tests
  - Easy to review and maintain
- **Backend coverage:** Test both Wayland and X11 backends
  - Ensures no regression for existing X11 users
  - Complete coverage of clipboard functionality
- **Platform scope:** Linux-only tests in CI
  - Wayland/X11 are Linux-only concerns
  - Simpler test matrix

### Test Data & Fixtures

- **Text/HTML data:** Inline test strings
  - Self-contained tests
  - No external dependencies
- **Image data:** Base64-encoded PNG inline
  - Small, consistent test image
  - No external files needed
  - No image generation dependencies

### Submodule Update Strategy

- **Branch reference:** Pin to specific tested commit hash on wl-copy-support branch
  - Reproducible builds
  - Stable reference for review
  - Not branch tip (avoids unexpected changes)
- **Verification:** Test submodule works before committing update
  - Run integration tests to verify
  - Ensure extension compiles and loads

### PR Organization

- **Commit structure:** Separate commits
  - Commit 1: Submodule update to wl-copy-support commit
  - Commit 2: Integration tests
  - Clean git history for easy review
- **Review approach:** Clear separation of concerns
  - Submodule update is independent
  - Tests demonstrate and validate functionality

### Documentation

- **README update:** Add Wayland support mention
  - Document wl-copy/wl-paste requirements
  - Note auto-detection behavior
- **No other docs needed:** Seamless integration
  - No user configuration required
  - Works automatically

### Test Isolation

- **Execution mode:** Sequential test execution
  - Avoid clipboard state interference between tests
  - Safer for stateful clipboard operations
- **State cleanup:** Each test manages its own clipboard state
  - Clear clipboard before/after as needed

### Package Management

- **Use bun instead of npm** for package management

</decisions>

<specifics>
## Specific Ideas

- Tests should be clean and easy to review - minimal complexity
- Follow existing test patterns (Mocha TDD interface, assertion style)
- Inline test data keeps tests self-contained
- Environment-adaptive approach works locally and in CI without configuration

</specifics>

<code_context>

## Existing Code Insights

### Reusable Assets

- **Test framework:** Mocha 10.8.2 with TDD interface already configured
- **Test runner:** @vscode/test-electron 2.4.1 for real VSCode environment
- **Assertion library:** Node.js built-in assert module
- **Rewire:** Already used for testing private functions
- **Test structure:** Existing pattern in test/suite/\*.test.ts

### Established Patterns

- **Test naming:** `*.test.ts` suffix
- **Test organization:** `test/suite/` directory
- **Suite pattern:** `suite("Name", () => { test("should...", () => {}); })`
- **Async tests:** Use `async () =>` with `await`
- **Test data:** Inline strings and tmpdir() for file tests
- **VSCode integration:** Tests run in actual VSCode instance via test-electron

### Integration Points

- **xclip usage:** Extension imports xclip for clipboard operations
- **Submodule location:** `xclip/` directory at project root
- **Test entry:** test/runTest.ts launches VSCode with extension
- **Test discovery:** test/suite/index.ts finds and runs all \*.test.js files

### Reference Context (xclip project)

- **Detection approach:** Eager initialization with module-level cache
- **Detection method:** WAYLAND_DISPLAY primary, XDG_SESSION_TYPE secondary
- **Fallback logic:** wl-copy if available, else xclip
- **Logging:** Clear logging of detected display server and selected backend

</code_context>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope

</deferred>

---

_Phase: 01-wayland-integration-testing_
_Context gathered: 2026-03-06_
