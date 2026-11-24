# Magic X — Feature Specifications

## Context

Magic X is a Next.js frontend and NestJS API using Prisma with PostgreSQL. The catalog is public; personal collections are scoped to an authenticated user. These specifications define the planned theme, language, responsive/accessibility, and AI-assisted catalog features.

## REQ-SDD-01 — Specification-led changes

**Requirement:** Changes covered by this initiative MUST trace to a stable requirement, acceptance criteria, implementation task, and validation evidence.

**Acceptance criteria**

- Each in-scope feature has one or more `REQ-*` identifiers.
- Each identifier has verifiable acceptance criteria.
- Implementation and test tasks link back to the relevant identifiers.

## REQ-THEME-01 — Light and dark themes

**Requirement:** Users MUST be able to switch between light and dark themes throughout the application.

**Acceptance criteria**

- All application views, dialogs, loading states, and controls remain legible in both themes.
- A user's selected theme is restored after reload.
- Existing theme persistence (`app_theme`) remains compatible.
- Theme controls have an accessible name and keyboard operation.

## REQ-I18N-01 — Spanish and English

**Requirement:** Users MUST be able to use the application in Spanish or English.

**Acceptance criteria**

- A language selector is available and the selection persists after reload.
- On first visit, use the browser language when Spanish or English is supported; otherwise use Spanish.
- All visible application text, validation/error messages, accessible labels, and chat UI use the active language.
- The document's `lang` attribute follows the active language.

## REQ-RESP-01 — Responsive layouts

**Requirement:** Core catalog, collection, authentication, and administration flows MUST adapt to phone, tablet, and desktop viewports.

**Acceptance criteria**

- The main flows are usable at widths of 320, 768, 1024, and 1440 CSS pixels.
- These widths do not cause page-level horizontal overflow.
- Controls remain visible, operable, and appropriately sized at narrow widths.

## REQ-A11Y-01 — Keyboard and voice accessibility

**Requirement:** Core controls MUST be keyboard-operable, and users MUST be able to request spoken reading of supported page content.

**Acceptance criteria**

- Keyboard focus is visible and follows a usable order through primary flows.
- Interactive elements have accessible names and form fields have associated labels.
- A user can start and stop browser-provided speech for the selected content.
- The voice language follows the active interface language when a matching browser voice exists.
- Unsupported speech synthesis is communicated rather than silently ignored.

## REQ-CHAT-01 — Data-bounded AI chat

**Requirement:** The chat MUST answer supported questions about the public card catalog and, for an authenticated user, that user's own collection.

**Acceptance criteria**

- Catalog questions can be answered without authentication.
- Private collection data is available only to the authenticated user whose identity is derived from the validated JWT.
- The chat cannot query another user's collection or administrative/user credential data.
- The chat has no arbitrary SQL execution capability.

## REQ-CHAT-02 — Read-only tools

**Requirement:** Data retrieval for chat MUST use explicit, bounded, read-only application operations.

**Acceptance criteria**

- The model cannot issue raw SQL or choose arbitrary database models/columns.
- Queries enforce result and input limits in the backend.
- Chat requests cannot mutate cards or collections.

## REQ-CHAT-03 — Provider boundary and secrets

**Requirement:** The AI provider MUST be called only by the backend through a replaceable provider boundary.

**Acceptance criteria**

- Provider credentials never reach the browser or source control.
- Provider setup, quota, timeout, and error states are reported explicitly.
- Only the minimum data needed to answer a question is sent to the provider.
- FreeLLMAPI integration is not considered ready until its official API contract, data handling, and limits are verified.

## REQ-CHAT-04 — Bilingual chat

**Requirement:** The chat interface and responses MUST support the active Spanish/English language.

**Acceptance criteria**

- Labels, status, errors, and empty states are localized.
- The selected interface language is supplied as response context to the AI provider.

## Out of scope

- Database migration or support for MySQL, Oracle, MongoDB, or SQL Server Express.
- Arbitrary SQL, write operations, unrestricted administrative access, or cross-user collection queries.
- Conversation persistence.
- Calling FreeLLMAPI with a credential until its public contract and safe secret delivery are confirmed.
