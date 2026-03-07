# Roadmap: vscode-markdown-paste-image Wayland Integration

## Overview

This roadmap adds Wayland display server support to vscode-markdown-paste-image by integrating the Wayland-enabled xclip fork. The work enables Linux users on Wayland systems to use clipboard operations seamlessly while maintaining full backward compatibility for existing X11 users.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Wayland Integration & Testing** - Update xclip submodule to Wayland fork and add integration tests for all clipboard operations

## Phase Details

### Phase 1: Wayland Integration & Testing

**Goal**: Extension works seamlessly on Wayland Linux systems with real integration tests validating all clipboard operations
**Depends on**: Nothing (first phase)
**Requirements**: SUBMODULE-01, SUBMODULE-02, SUBMODULE-03, TEST-01, TEST-02, TEST-03, TEST-04, COMPAT-01, COMPAT-02, COMPAT-03, COMPAT-04
**Success Criteria** (what must be TRUE):

1. xclip submodule points to progressEdd/xclip wayland-clipboard-support branch
2. Integration tests use real wl-copy/wl-paste commands (not mocked)
3. Tests auto-detect display server and run on Wayland or X11
4. All clipboard operations tested: getTextPlain, getTextHtml, getImage, getContentType
5. Tests pass on both X11 and Wayland Linux systems
6. Existing X11 users experience no behavior changes
   **Plans**: 3 plans in 2 waves

Plans:

- [ ] 01-01: Update xclip submodule to Wayland-enabled fork (Wave 1)
- [ ] 01-02: Create integration tests for clipboard operations (Wave 2, depends on 01-01)
- [ ] 01-03: Update README with Wayland support documentation (Wave 2, depends on 01-01)

## Progress

**Execution Order:**
Phases execute in numeric order: 1

| Phase                            | Plans Complete | Status      | Completed |
| -------------------------------- | -------------- | ----------- | --------- |
| 1. Wayland Integration & Testing | 0/3            | Not started | -         |
