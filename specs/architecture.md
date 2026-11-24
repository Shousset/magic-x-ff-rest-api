# Architecture Decisions — Magic X SDD Features

## Current application boundaries

- `frontend/` is a Next.js App Router application.
- `backend/` is a NestJS API.
- Prisma/PostgreSQL remains the single persistence stack.
- Browser API calls use the frontend's same-origin `/api/...` proxy.
- JWT authentication and existing collection endpoints already scope collection access to the authenticated user.

## ADR-001 — Versioned requirements before implementation

Feature behavior is specified in `specs/features.md`. Work is decomposed and traced through `specs/implementation-plan.md`; tests validate acceptance criteria rather than becoming a second, conflicting source of behavior.

## ADR-002 — UI preferences remain client-side

Theme and language preferences are presentation settings. Persist them in browser storage, retain the existing `app_theme` key, and do not add preference columns or database migrations for this scope. Initialize the document language and theme without exposing provider secrets or introducing server-only state into client components.

## ADR-003 — AI chat data access stays in the backend

The browser sends a question to a NestJS chat endpoint. The backend validates identity and input, invokes explicit read-only catalog/collection operations, limits the context, then calls an AI provider adapter. The provider does not receive database credentials and does not connect to PostgreSQL.

The provider is not trusted to define authorization. The backend derives the user ID from the authenticated JWT, constrains collection lookups to that ID, and controls which fields and records are supplied as context. No raw SQL or model-selected Prisma operations are permitted.

## ADR-004 — External AI provider is a replaceable dependency

FreeLLMAPI is a proposed provider, not a verified integration contract. Confirm endpoint, authentication, request/response format, model selection, streaming support if needed, rate/quota behavior, privacy, and retention before implementing its adapter. Store any credential only in backend runtime configuration. Do not copy credentials into source, client bundles, logs, tests, or documentation.

If the provider cannot meet the requirements, pause provider wiring and resolve an alternative with the user rather than guessing an API contract.

## ADR-005 — Browser speech is progressive enhancement

Use the browser's speech synthesis when available. Start and stop are user-controlled, and the active locale is used to select a matching voice when possible. All written content remains available when speech is unavailable.

## Operational limits

- The existing PostgreSQL datasource is unchanged.
- Chat receives only the data required for the specific answer and never connection details.
- Provider and feature failures are explicit; no successful-looking fallback answer is returned.
- Responsive behavior is validated at 320, 768, 1024, and 1440 CSS pixels.
