# Implementation Plan — Magic X SDD Features

## Tasks

| Task | Work | Requirements | Dependencies | Validation | Status |
| --- | --- | --- | --- | --- | --- |
| T001 | Establish SDD conventions, requirements, and architecture boundaries | REQ-SDD-01, REQ-CHAT-01–03 | — | Review specification/task/acceptance traceability | Done |
| T002 | Complete theme and language preferences and localize interface text | REQ-THEME-01, REQ-I18N-01 | T001 | Frontend tests/build; verify persistence and browser-language fallback | Done |
| T003 | Improve responsive layouts, keyboard access, and voice reading | REQ-RESP-01, REQ-A11Y-01 | T001 | Viewports 320/768/1024/1440; keyboard and speech behavior checks | In progress; visual viewport checks pending |
| T004 | Implement a data-bounded backend chat and localized UI | REQ-CHAT-01–04 | T001; FreeLLMAPI contract verification | Backend authorization/unit tests; frontend tests; provider adapter tests with a stub | Blocked pending official provider contract and credential rotation |
| T005 | Validate requirement coverage and application quality | REQ-SDD-01 and all implemented requirements | T002, T003, T004 | Relevant test suites, lint, frontend/backend builds, traceability review, Docker config/build/smoke | In progress; frontend tests/lint/build and both Docker image builds pass; frontend container returns HTTP 200 |

T002 and T003 can proceed independently after T001, with integrated UI validation. T004 is blocked from provider-specific wiring until the FreeLLMAPI contract and secret-delivery method are verified; its safe backend boundary and tests can be designed independently of a live provider.

## Requirement mapping

| Requirement | Task | Evidence |
| --- | --- | --- |
| REQ-SDD-01 | T001, T005 | This versioned spec/task breakdown and final traceability review |
| REQ-THEME-01 | T002 | Theme preference tests and manual light/dark checks across views |
| REQ-I18N-01 | T002 | Language selection, fallback, persistence tests; localized UI review |
| REQ-RESP-01 | T003 | Viewport checks at 320, 768, 1024, and 1440 CSS pixels |
| REQ-A11Y-01 | T003 | Keyboard/focus checks and speech synthesis behavior tests |
| REQ-CHAT-01 | T004 | Catalog and user-scoped collection authorization tests |
| REQ-CHAT-02 | T004 | Tests for bounded read-only operations and rejected unsupported input |
| REQ-CHAT-03 | T004 | Provider-boundary, missing-config, timeout/error, and secret handling tests |
| REQ-CHAT-04 | T004 | Localized UI tests and active-locale provider context check |
