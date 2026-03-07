# Requirements: vscode-markdown-paste-image Wayland Support

**Defined:** 2026-03-06
**Core Value:** Works seamlessly across all platforms with intelligent clipboard processing - users can paste any content and get properly formatted markdown.

## v1 Requirements

Requirements for initial Wayland integration. Each maps to roadmap phases.

### xclip Submodule Update

- [x] **SUBMODULE-01**: Update xclip submodule to point to Wayland-enabled fork (git@github.com:progressEdd/xclip.git)
- [x] **SUBMODULE-02**: Verify submodule correctly clones and builds
- [x] **SUBMODULE-03**: Ensure extension uses updated submodule, not npm package

### Wayland Integration Testing

- [x] **TEST-01**: Add integration tests that use actual wl-copy/wl-paste tools
- [x] **TEST-02**: Tests auto-detect display server (Wayland or X11)
- [x] **TEST-03**: Test all clipboard operations: getTextPlain, getTextHtml, getImage, getContentType
- [x] **TEST-04**: Tests run in VSCode test environment (vscodium)

### Backend Compatibility

- [x] **COMPAT-01**: Extension works identically on X11 and Wayland Linux systems
- [x] **COMPAT-02**: No user configuration required for display server detection
- [x] **COMPAT-03**: Existing X11 users experience no behavior changes
- [x] **COMPAT-04**: Wayland users can paste text, HTML, and images successfully

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature                  | Reason                                 |
| ------------------------ | -------------------------------------- |
| Direct Wayland protocol  | xclip abstraction handles this         |
| Configuration API        | Auto-detect is sufficient              |
| Non-Linux platforms      | Already working on Windows/macOS/WSL   |
| Performance optimization | Not a concern for clipboard operations |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement  | Phase   | Status   |
| ------------ | ------- | -------- |
| SUBMODULE-01 | Phase 1 | Complete |
| SUBMODULE-02 | Phase 1 | Complete |
| SUBMODULE-03 | Phase 1 | Complete |
| TEST-01      | Phase 1 | Complete |
| TEST-02      | Phase 1 | Complete |
| TEST-03      | Phase 1 | Complete |
| TEST-04      | Phase 1 | Complete |
| COMPAT-01    | Phase 1 | Complete |
| COMPAT-02    | Phase 1 | Complete |
| COMPAT-03    | Phase 1 | Complete |
| COMPAT-04    | Phase 1 | Complete |

**Coverage:**

- v1 requirements: 11 total
- Mapped to phases: 11
- Unmapped: 0 ✓

---

_Requirements defined: 2026-03-06_
_Last updated: 2026-03-06 after roadmap creation_
