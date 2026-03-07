# Phase 1: Wayland Integration & Testing - Research

**Researched:** 2026-03-06
**Domain:** Wayland clipboard integration, git submodules, integration testing in VSCode extensions
**Confidence:** HIGH

## Summary

This phase updates the xclip submodule to a Wayland-enabled fork and adds integration tests that validate clipboard operations work on both Wayland and X11 Linux systems. The progressEdd/xclip fork already has complete Wayland support via the `wayland-clipboard-support` branch, which uses wl-copy/wl-paste commands and includes automatic display server detection. Tests will use the existing Mocha TDD framework with @vscode/test-electron to run in a real VSCode environment, with environment-adaptive behavior that detects Wayland vs X11 at runtime.

**Primary recommendation:** Pin the submodule to specific commit `55c32aa9a8555949fbbeef9ebb742f6b58d3252f` from the `wayland-clipboard-support` branch of progressEdd/xclip, then create integration tests following existing patterns (Mocha TDD, inline test data, sequential execution).

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions

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
- **Test Data & Fixtures:** Inline test strings and base64-encoded PNG
  - Self-contained tests
  - No external dependencies
- **Submodule Update Strategy:** Pin to specific tested commit hash on wl-copy-support branch
  - Reproducible builds
  - Stable reference for review
  - Not branch tip (avoids unexpected changes)
- **Verification:** Test submodule works before committing update
  - Run integration tests to verify
  - Ensure extension compiles and loads
- **PR Organization:** Separate commits
  - Commit 1: Submodule update to wl-copy-support commit
  - Commit 2: Integration tests
  - Clean git history for easy review
- **Documentation:** README update for Wayland support
  - Document wl-copy/wl-paste requirements
  - Note auto-detection behavior
- **Test Isolation:** Sequential test execution
  - Avoid clipboard state interference between tests
  - Safer for stateful clipboard operations
- **State cleanup:** Each test manages its own clipboard state
  - Clear clipboard before/after as needed
- **Package Management:** Use bun instead of npm

### Claude's Discretion

None - all decisions were locked during discussion.

### Deferred Ideas (OUT OF SCOPE)

None - discussion stayed within phase scope.

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID           | Description                                                                        | Research Support                                                                                                                    |
| ------------ | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| SUBMODULE-01 | Update xclip submodule to point to Wayland-enabled fork                            | progressEdd/xclip repo with wayland-clipboard-support branch exists; commit hash 55c32aa9a8555949fbbeef9ebb742f6b58d3252f available |
| SUBMODULE-02 | Verify submodule correctly clones and builds                                       | xclip has npm build scripts; submodule currently empty but .gitmodules configured                                                   |
| SUBMODULE-03 | Ensure extension uses updated submodule, not npm package                           | Extension imports xclip in src/paster.ts; need to verify TypeScript path resolution after submodule update                          |
| TEST-01      | Add integration tests that use actual wl-copy/wl-paste tools                       | wl-clipboard 2.2.1 is standard; scripts in progressEdd/xclip use wl-paste --no-newline, wl-paste --list-types, wl-paste --type      |
| TEST-02      | Tests auto-detect display server (Wayland or X11)                                  | progressEdd/xclip os.ts implements detectDisplayServer() using WAYLAND_DISPLAY and XDG_SESSION_TYPE                                 |
| TEST-03      | Test all clipboard operations: getTextPlain, getTextHtml, getImage, getContentType | WaylandClipboard class implements all 4 methods; each maps to wl-copy/wl-paste scripts                                              |
| TEST-04      | Tests run in VSCode test environment (vscodium)                                    | Existing test infrastructure uses @vscode/test-electron 2.4.1 with Mocha 10.8.2 TDD interface                                       |
| COMPAT-01    | Extension works identically on X11 and Wayland Linux systems                       | progressEdd/xclip has LinuxClipboard and WaylandClipboard implementations; LinuxShell.getClipboard() auto-selects backend           |
| COMPAT-02    | No user configuration required for display server detection                        | Detection happens automatically in xclip.getShell().getClipboard(); users need only install wl-clipboard or xclip                   |
| COMPAT-03    | Existing X11 users experience no behavior changes                                  | X11 path unchanged in progressEdd/xclip; fallback from Wayland to X11 preserves existing behavior                                   |
| COMPAT-04    | Wayland users can paste text, HTML, and images successfully                        | wl-clipboard supports text/plain, text/html, image/png; progressEdd/xclip scripts tested for all three                              |

</phase_requirements>

## Standard Stack

### Core

| Library           | Version        | Purpose                                    | Why Standard                                                            |
| ----------------- | -------------- | ------------------------------------------ | ----------------------------------------------------------------------- |
| progressEdd/xclip | commit 55c32aa | Clipboard abstraction with Wayland support | Only fork with complete Wayland implementation using wl-clipboard tools |
| wl-clipboard      | 2.2.1          | Wayland clipboard command-line utilities   | Standard Wayland clipboard tools, used by all major distros             |
| xclip             | 0.13           | X11 clipboard command-line tool            | Standard X11 clipboard tool, fallback for Wayland systems               |

### Supporting

| Library               | Version  | Purpose                            | When to Use                                                 |
| --------------------- | -------- | ---------------------------------- | ----------------------------------------------------------- |
| @vscode/test-electron | 2.4.1    | VSCode extension testing framework | Already configured; runs tests in real VSCode instance      |
| Mocha                 | 10.8.2   | Test framework with TDD interface  | Existing test infrastructure; test/suite/\*.test.ts pattern |
| Node.js assert        | built-in | Assertions                         | Consistent with existing tests                              |

### Alternatives Considered

| Instead of             | Could Use                          | Tradeoff                                                                   |
| ---------------------- | ---------------------------------- | -------------------------------------------------------------------------- |
| progressEdd/xclip fork | Implement Wayland support directly | Fork already complete and tested; implementing from scratch is reinvention |
| wl-clipboard           | wl-clipboard-rs Rust library       | wl-clipboard is standard command-line tool; Rust library adds complexity   |
| Real integration tests | Mocked clipboard operations        | Real tests validate actual tool behavior; mocks hide integration bugs      |

**Installation:**

```bash
# Linux (Debian/Ubuntu)
sudo apt install wl-clipboard xclip

# Linux (Arch)
sudo pacman -S wl-clipboard xclip

# Linux (Fedora)
sudo dnf install wl-clipboard xclip
```

## Architecture Patterns

### Recommended Project Structure

```
vscode-markdown-paste-image/
├── xclip/                          # Submodule (progressEdd/xclip)
│   ├── src/
│   │   ├── clipboard/
│   │   │   ├── wayland.ts         # WaylandClipboard implementation
│   │   │   ├── linux.ts           # LinuxClipboard (X11) implementation
│   │   │   └── base_clipboard.ts  # Shared base class
│   │   ├── os.ts                  # Display server detection
│   │   └── index.ts               # Public exports
│   └── res/scripts/               # Shell scripts for clipboard ops
│       ├── wayland_*.sh           # wl-copy/wl-paste wrappers
│       └── linux_*.sh             # xclip wrappers
├── src/
│   └── paster.ts                  # Extension uses xclip.getShell().getClipboard()
└── test/
    └── suite/
        └── clipboard.test.ts      # NEW: Integration tests for clipboard
```

### Pattern 1: Display Server Detection (Eager Initialization)

**What:** Detect Wayland vs X11 once at module load, cache result for process lifetime
**When to use:** Clipboard operations that need different tools based on display server
**Example:**

```typescript
// Source: https://raw.githubusercontent.com/progressEdd/xclip/wayland-clipboard-support/src/os.ts
let cachedDisplayServer: DisplayServer | null = null;

export function detectDisplayServer(): DisplayServer {
  if (cachedDisplayServer !== null) {
    return cachedDisplayServer;
  }

  // Primary: Check WAYLAND_DISPLAY
  if (process.env.WAYLAND_DISPLAY) {
    cachedDisplayServer = "wayland";
    console.debug(
      `[xclip] Detected Wayland via WAYLAND_DISPLAY=${process.env.WAYLAND_DISPLAY}`
    );
    return cachedDisplayServer;
  }

  // Secondary: Check XDG_SESSION_TYPE
  const sessionType = process.env.XDG_SESSION_TYPE;
  if (sessionType === "wayland") {
    cachedDisplayServer = "wayland";
    console.debug(
      `[xclip] Detected Wayland via XDG_SESSION_TYPE=${sessionType}`
    );
    return cachedDisplayServer;
  }

  // Default to X11
  cachedDisplayServer = "x11";
  console.debug(`[xclip] Detected X11 (no Wayland indicators found)`);
  return cachedDisplayServer;
}
```

### Pattern 2: Tool Availability Check

**What:** Verify command-line tool exists before using it
**When to use:** Clipboard operations that depend on external tools (wl-copy, xclip)
**Example:**

```typescript
// Source: https://raw.githubusercontent.com/progressEdd/xclip/wayland-clipboard-support/src/os.ts
export function isToolAvailable(toolName: string): boolean {
  try {
    const result = spawnSync("command", ["-v", toolName], {
      shell: true,
      encoding: "utf-8",
    });
    return result.status === 0;
  } catch {
    return false;
  }
}
```

### Pattern 3: Backend Selection with Fallback

**What:** Select Wayland or X11 backend based on display server, with graceful fallback
**When to use:** When extension needs to work on both Wayland and X11 without configuration
**Example:**

```typescript
// Source: https://raw.githubusercontent.com/progressEdd/xclip/wayland-clipboard-support/src/os.ts
class LinuxShell implements IShell {
  getClipboard(): IClipboard {
    const displayServer = detectDisplayServer();

    if (displayServer === "wayland") {
      if (isToolAvailable("wl-copy")) {
        console.debug("[xclip] Selected wl-copy backend for Wayland");
        return new WaylandClipboard();
      } else if (isToolAvailable("xclip")) {
        console.debug(
          "[xclip] Warning: Wayland detected but wl-copy not found, falling back to xclip (XWayland)"
        );
        console.debug(
          "[xclip] For best Wayland support, install wl-clipboard: apt install wl-clipboard"
        );
        return new LinuxClipboard();
      } else {
        throw new Error(
          "No clipboard tool available. Install wl-clipboard (recommended for Wayland) or xclip."
        );
      }
    }

    // X11
    if (isToolAvailable("xclip")) {
      console.debug("[xclip] Selected xclip backend for X11");
      return new LinuxClipboard();
    }

    throw new Error(
      "xclip not installed. Install with: apt install xclip (or pacman -S xclip)"
    );
  }
}
```

### Pattern 4: Environment-Adaptive Test

**What:** Test detects environment and runs appropriate assertions
**When to use:** Integration tests that need to work on both Wayland and X11 CI systems
**Example:**

```typescript
// Pattern for environment-adaptive test
import * as assert from "assert";
import * as xclip from "xclip";

suite("Clipboard Integration Tests", () => {
  test("should copy and paste plain text", async () => {
    const shell = xclip.getShell();
    const cb = shell.getClipboard();

    // Detect which tools are available
    const displayServer = process.env.WAYLAND_DISPLAY || process.env.XDG_SESSION_TYPE === "wayland"
      ? "wayland"
      : "x11";

    const requiredTool = displayServer === "wayland" ? "wl-copy" : "xclip";

    // Verify tool is available
    const toolAvailable = /* check if requiredTool exists */;
    if (!toolAvailable) {
      assert.fail(`${requiredTool} not found. Install with: apt install ${requiredTool === "wl-copy" ? "wl-clipboard" : "xclip"}`);
    }

    // Test round-trip
    const testText = "Hello, Wayland!";
    // Copy to clipboard
    // Verify success
    // Paste from clipboard
    // Verify pasted text matches
  });
});
```

### Anti-Patterns to Avoid

- **Mocking clipboard tools in integration tests:** Defeats purpose of integration tests; use real tools
- **Hardcoding display server in tests:** Tests become environment-specific; use detection
- **Testing only Wayland or only X11:** Incomplete coverage; test both backends
- **Skipping tool availability checks:** Leads to cryptic failures; validate tools upfront

## Don't Hand-Roll

| Problem                     | Don't Build                    | Use Instead                             | Why                                                        |
| --------------------------- | ------------------------------ | --------------------------------------- | ---------------------------------------------------------- |
| Wayland clipboard access    | Custom Wayland protocol client | wl-clipboard tools + progressEdd/xclip  | Wayland protocol is complex; wl-clipboard is battle-tested |
| Display server detection    | Custom environment parsing     | progressEdd/xclip detectDisplayServer() | Handles WAYLAND_DISPLAY, XDG_SESSION_TYPE, edge cases      |
| Clipboard abstraction layer | New clipboard library          | progressEdd/xclip fork                  | Fork already has Wayland and X11 implementations           |
| Test framework setup        | Custom test runner             | Mocha + @vscode/test-electron           | Existing infrastructure works; don't reinvent              |

**Key insight:** The progressEdd/xclip fork has already solved Wayland integration. Focus efforts on testing and integration, not reimplementation.

## Common Pitfalls

### Pitfall 1: Empty Submodule Directory

**What goes wrong:** xclip directory exists but is empty after clone, causing "Cannot find module 'xclip'" errors
**Why it happens:** Git submodules require explicit initialization: `git submodule update --init`
**How to avoid:** Document submodule setup in README; ensure CI/CD runs submodule init
**Warning signs:** TypeScript compilation errors about missing xclip module; empty xclip/ directory in filesystem

### Pitfall 2: Wayland Tests Failing on X11 CI

**What goes wrong:** Tests hardcode Wayland assumptions, fail when run on X11 CI runners
**Why it happens:** Tests don't check environment before asserting specific tool availability
**How to avoid:** Use environment-adaptive pattern (Pattern 4); detect display server at test runtime
**Warning signs:** Tests pass locally on Wayland but fail in CI; CI logs show "wl-copy not found" on X11

### Pitfall 3: Clipboard State Bleeding Between Tests

**What goes wrong:** Test A leaves clipboard in unexpected state, causing Test B to fail
**Why it happens:** Clipboard is global state; tests interfere with each other
**How to avoid:** Run tests sequentially (not parallel); clear clipboard before/after each test
**Warning signs:** Flaky tests that pass in isolation but fail when run with other tests

### Pitfall 4: X11 Users Experience Behavior Changes

**What goes wrong:** Updating submodule accidentally changes X11 clipboard behavior
**Why it happens:** Changes to shared base class or X11-specific code
**How to avoid:** Run X11 tests before and after submodule update; verify no regression
**Warning signs:** X11 users report unexpected behavior after update

### Pitfall 5: Missing wl-clipboard on Wayland Systems

**What goes wrong:** Extension fails silently on Wayland because wl-clipboard not installed
**Why it happens:** wl-clipboard is separate package from Wayland compositor
**How to avoid:** Clear error messages when tools missing; README documents wl-clipboard requirement
**Warning signs:** Wayland users report clipboard not working; no error shown in UI

### Pitfall 6: Using xclip npm Package Instead of Submodule

**What goes wrong:** Extension still uses npm xclip package (v1.0.7) without Wayland support
**Why it happens:** TypeScript resolves to node_modules/xclip instead of submodule
**How to avoid:** Remove xclip from package.json dependencies; verify TypeScript config uses submodule path
**Warning signs:** Extension works on X11 but not Wayland; `require.resolve('xclip')` points to node_modules

## Code Examples

Verified patterns from official sources:

### wl-clipboard Usage (Plain Text)

```bash
# Source: https://raw.githubusercontent.com/progressEdd/xclip/wayland-clipboard-support/res/scripts/wayland_get_clipboard_text_plain.sh
#!/bin/sh
# Require wl-paste
command -v wl-paste >/dev/null 2>&1 || { echo "no wl-paste" >&1; exit 1; }
# Get clipboard text without trailing newline
wl-paste --no-newline
```

### wl-clipboard Usage (Image)

```bash
# Source: https://raw.githubusercontent.com/progressEdd/xclip/wayland-clipboard-support/res/scripts/wayland_save_clipboard_png.sh
#!/bin/sh
command -v wl-paste >/dev/null 2>&1 || { echo "no wl-paste" >&1; exit 1; }
wl-paste --type image/png > "$1"
echo "$1"
```

### wl-clipboard Usage (Content Type Detection)

```bash
# Source: https://raw.githubusercontent.com/progressEdd/xclip/wayland-clipboard-support/res/scripts/wayland_get_clipboard_content_type.sh
#!/bin/sh
command -v wl-paste >/dev/null 2>&1 || { echo "no wl-paste" >&1; exit 1; }
# List available MIME types
wl-paste --list-types
```

### WaylandClipboard Implementation

```typescript
// Source: https://raw.githubusercontent.com/progressEdd/xclip/wayland-clipboard-support/src/clipboard/wayland.ts
class WaylandClipboard extends BaseClipboard {
  SCRIPT_PATH = "../../res/scripts/";

  async getTextPlain(): Promise<string> {
    const script = path.join(
      __dirname,
      this.SCRIPT_PATH,
      "wayland_get_clipboard_text_plain.sh"
    );
    const shell = getShell();
    const data: string = await shell.runScript(script);
    return stripFinalNewline(data);
  }

  async getImage(imagePath: string): Promise<string> {
    if (!imagePath) return "";
    const script = path.join(
      __dirname,
      this.SCRIPT_PATH,
      "wayland_save_clipboard_png.sh"
    );
    const shell = getShell();
    const data: string = await shell.runScript(script, [imagePath]);
    return stripFinalNewline(data);
  }

  async getContentType(): Promise<Set<ClipboardType> | ClipboardType> {
    const script = path.join(
      __dirname,
      this.SCRIPT_PATH,
      "wayland_get_clipboard_content_type.sh"
    );
    try {
      const shell = getShell();
      const data = await shell.runScript(script);
      console.debug("getClipboardContentType", data);
      const types = data.split(/\r\n|\n|\r/);
      return this.detectType(types);
    } catch (e) {
      return ClipboardType.Unknown;
    }
  }
}
```

### Test Structure Pattern

```typescript
// Pattern based on existing test/suite/extension.test.ts
import * as assert from "assert";
import * as xclip from "xclip";

suite("Clipboard Integration Tests", () => {
  test("should copy and paste plain text", async () => {
    const shell = xclip.getShell();
    const cb = shell.getClipboard();
    const text = await cb.getTextPlain();
    assert.ok(typeof text === "string");
  });

  test("should detect content type", async () => {
    const shell = xclip.getShell();
    const cb = shell.getClipboard();
    const type = await cb.getContentType();
    assert.ok(type !== undefined);
  });
});
```

## State of the Art

| Old Approach           | Current Approach                         | When Changed           | Impact                                               |
| ---------------------- | ---------------------------------------- | ---------------------- | ---------------------------------------------------- |
| xclip only (X11)       | xclip + wl-clipboard (X11 + Wayland)     | 2026-03-06             | Extension now works on modern Wayland Linux systems  |
| Mocked clipboard tests | Real integration tests with actual tools | 2026-03-06             | Tests validate real behavior, catch integration bugs |
| Hardcoded X11 backend  | Auto-detect display server               | progressEdd/xclip fork | Zero configuration, works seamlessly on both systems |

**Deprecated/outdated:**

- xclip npm package (v1.0.7): No Wayland support; use progressEdd/xclip fork instead
- Direct xclip command usage in extension: Use xclip abstraction layer

## Open Questions

1. **Should tests use xclip API directly or through extension's Paster class?**

   - What we know: Tests need to validate clipboard operations; Paster class is the extension's main interface
   - What's unclear: Whether to test at xclip level or Paster level
   - Recommendation: Test at xclip level for integration tests (validates xclip submodule), Paster level would be unit tests

2. **How to handle clipboard state in tests without side effects?**

   - What we know: Clipboard is global state; tests can interfere with each other
   - What's unclear: Best practice for isolating test clipboard state
   - Recommendation: Sequential test execution, clear clipboard before/after each test, use unique test data

3. **Should CI run tests on both Wayland and X11 runners?**
   - What we know: Extension must work on both; single CI runner tests only one environment
   - What's unclear: Whether to duplicate CI jobs or rely on environment-adaptive tests
   - Recommendation: Start with X11 runner (more common), add Wayland runner if resources allow; environment-adaptive tests ensure correctness on both

## Sources

### Primary (HIGH confidence)

- progressEdd/xclip GitHub repository - Complete Wayland implementation source code (wayland-clipboard-support branch)
- wl-clipboard GitHub repository - Official wl-clipboard tools documentation and source
- Arch Linux man pages - wl-copy(1) and wl-paste(1) manual pages with complete option reference
- progressEdd/xclip source code inspection - os.ts, wayland.ts, linux.ts, clipboard scripts
- Local environment verification - wl-clipboard 2.2.1, xclip 0.13, Wayland display server confirmed available

### Secondary (MEDIUM confidence)

- Existing test infrastructure analysis - test/runTest.ts, test/suite/index.ts, test/suite/extension.test.ts
- Package.json analysis - @vscode/test-electron 2.4.1, Mocha 10.8.2, xclip 1.0.7 npm dependency

### Tertiary (LOW confidence)

None - all findings verified with primary sources

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - progressEdd/xclip fork exists with complete Wayland support, wl-clipboard is standard tool
- Architecture: HIGH - Patterns extracted directly from progressEdd/xclip source code
- Pitfalls: HIGH - Based on known git submodule behavior, clipboard state management best practices

**Research date:** 2026-03-06
**Valid until:** 2026-04-06 (30 days) - wl-clipboard and xclip are stable; progressEdd/xclip fork is maintained
