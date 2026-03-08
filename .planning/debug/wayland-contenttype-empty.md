---
status: awaiting_human_verify
trigger: 'I''m getting this output for my extension output from vscode [03-07 16:33:29] "vscode-markdown-paste" is now active! ... [Extension Host] contentType: {}'
created: 2026-03-07T16:40:00Z
updated: 2026-03-07T17:15:00Z
---

## Current Focus

hypothesis: Need more detailed debugging output to identify exact type value and flow through selectClipboardType
test: Enhanced logging in selectClipboardType captures input value, Set contents, and priority checks; safeDescribeContentType ensures logging never throws
expecting: User will see full type log including Set contents and which priority matches (or if none match) when running paste
next_action: Reload extension host and test paste with image clipboard, report full output from Markdown Paste channel

## Symptoms

expected: Pasting an image into markdown should save image and insert markdown link.
actual: Extension logs `paste() called`, detects LinuxShell and WaylandClipboard, then logs empty `contentType raw`/`contentType: {}` and fails with `MarkdownPaste failed:`.
errors: "paste error: MarkdownPaste failed:" (no detailed reason surfaced in output).
reproduction: On Linux/Wayland in VS Code, run extension paste command with clipboard content expected to be image.
started: Observed in current run at 03-07 16:33; historical start time unknown.

## Eliminated

## Evidence

- timestamp: 2026-03-07T16:41:00Z
  checked: user-provided VS Code output and extension host logs
  found: shell=LinuxShell and clipboard=WaylandClipboard are selected; contentType resolves to empty object; paste throws generic MarkdownPaste failed error
  implication: failure likely in clipboard content type detection/normalization for Wayland path before downstream paste handling

- timestamp: 2026-03-07T16:50:00Z
  checked: current source and compiled output for `src/paster.ts`, `src/extension.ts`, and xclip wayland implementation
  found: `getContentType()` in xclip returns `Set<ClipboardType>` or `ClipboardType` string, but `Paster.selectClipboardType()` currently accepts any string including empty string, and `Paster.paste()` runs duplicated broad diagnostics that call `JSON.stringify`/`String` on arbitrary values inside main flow
  implication: main paste path is vulnerable to logging-time failures and non-normalized empty string clipboard types

- timestamp: 2026-03-07T16:52:00Z
  checked: extension error message patterns in source
  found: current `src/extension.ts` logs `MarkdownPaste failed - ...`, while reported output shows legacy `MarkdownPaste failed:` format
  implication: user likely has stale extension build/runtime path mixed with current diagnostics, so we need a defensive runtime fix in paste path itself

- timestamp: 2026-03-07T16:58:00Z
  checked: applied defensive fixes to paster.ts (empty-string handling, safeContentType logging)
  found: npm run compile passed, out/paster.js includes guards
  implication: previous attempt to fix content-type handling did not resolve issue

- timestamp: 2026-03-07T17:10:00Z
  checked: direct test of wl_clipboard_get_clipboard_content_type.sh script
  found: Script outputs: "chromium/x-internal-source-rfh-token\n text/plain;charset=utf-8\n text/plain\n ...". This produces empty string entries when split on newlines
  implication: Empty strings in type list could cause issues if not filtered out before processing
- timestamp: 2026-03-07T17:10:00Z
  checked: onDetectType method for Wayland and Linux clipboard
  found: Default case adds ClipboardType.Text for any type not "image/png" or "text/html". Empty string falls through to default.
  implication: Empty string becomes "text" type, which is probably valid behavior

- timestamp: 2026-03-07T17:15:00Z
  checked: Added comprehensive logging to selectClipboardType and made safeDescribeContentType available for paste() too
  found: Compile passed. out/paster.js includes enhanced logging for type input, Set contents, priority checks
  implication: User will now see exact type value in debug output when running paste

- timestamp: 2026-03-07T17:20:00Z
  checked: User confirmed using bun and vsce package for .vsix installation
  found: User needs to run full rebuild pipeline: bun run compile && bunx vsce package
  implication: Previous compile was via npm, not bun - cannot assume out/ directory was rebuilt correctly for bun user

## Resolution

root_cause: UNKNOWN - Previous fix attempt did not resolve issue. Need more specific debugging output from user VS Code environment.
fix: Enhanced logging to capture actual clipDOCTYPE value passed to selectClipboardType and priority check behavior
verification: pending user feedback with new output logs after reloading extension host
files_changed: src/paster.ts
