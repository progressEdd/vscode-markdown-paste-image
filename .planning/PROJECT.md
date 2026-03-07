# vscode-markdown-paste-image - VSCode Extension

## What This Is

A VSCode extension that provides smart paste functionality for markdown files. Automatically detects clipboard content type (text, HTML, image) and converts to appropriate markdown format. Integrates with xclip library for cross-platform clipboard access.

## Core Value

Works seamlessly across all platforms (Windows, macOS, Linux, WSL) with intelligent clipboard processing - users can paste any content (text, HTML, images) and get properly formatted markdown without manual conversion.

## Requirements

### Validated

- ✓ Smart paste with automatic type detection (text/HTML/image)
- ✓ HTML to markdown conversion with turndown
- ✓ Image paste with configurable paths and naming
- ✓ Code block paste with automatic language detection
- ✓ AI-powered clipboard processing (optional)
- ✓ Cross-platform clipboard access via xclip
- ✓ Configurable regex rules for content transformation
- ✓ Extension commands and keybindings

### Active

- [ ] Support Wayland display server on Linux systems
- [ ] Update xclip submodule to use Wayland-enabled fork
- [ ] Add integration tests for Wayland clipboard operations
- [ ] Verify seamless operation across X11 and Wayland backends

### Out of Scope

- GUI beyond VSCode UI - extension only
- Standalone clipboard manager - integrates with xclip
- Direct clipboard protocol implementations - uses xclip abstraction
- Non-markdown file support - focused on markdown editing

## Context

This is a mature VSCode extension with ~500k+ installs. It uses the xclip library as a git submodule for cross-platform clipboard operations. Currently, Linux support is hardcoded to xclip (X11 only), which breaks on Wayland-based systems.

**Key consumer:** Markdown authors who paste content (images, text, HTML) into markdown documents.

**Architecture highlights:**

- VSCode Extension API for editor integration
- Static `Paster` class coordinates all paste operations
- xclip library for platform-agnostic clipboard access
- AI integration layer for intelligent content processing
- Configuration-driven rules and templates

**Current limitation:** Linux clipboard operations fail on Wayland systems because xclip requires X11. Need to integrate Wayland support from xclip fork.

## Constraints

- **Extension Compatibility**: Must work on VSCode 1.98.0+
- **xclip Dependency**: xclip is a git submodule - need to update to Wayland-enabled fork
- **Backward Compatibility**: Existing users on X11 must see no changes
- **Test Environment**: Integration tests require VSCode test runner and display server
- **Platform Support**: Must continue working on Windows, macOS, WSL, X11 Linux, and add Wayland Linux

## Key Decisions

| Decision                   | Rationale                                    | Outcome   |
| -------------------------- | -------------------------------------------- | --------- |
| Use xclip git submodule    | Allows version control and customization     | — Active  |
| Auto-detect display server | Users shouldn't configure - just works       | — Pending |
| Extend existing test suite | Leverages established testing infrastructure | — Pending |

---

_Last updated: 2026-03-06 after initialization_
