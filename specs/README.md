# Spec-Driven Development

These specifications are the source of truth for planned behavior in Magic X. Before implementing or changing a user-visible capability:

1. Read the relevant feature specification.
2. Update its requirements, scenarios, and acceptance criteria when behavior changes.
3. Break work into tasks with requirement IDs and dependencies.
4. Implement and test against those criteria.
5. Record validation evidence and update the specification if implementation reveals a needed decision.

## Required specification contents

- Purpose, scope, and exclusions.
- Stable requirement IDs (`REQ-*`).
- User scenarios and observable outcomes.
- Acceptance criteria that can be verified by tests or a documented manual check.
- Security, privacy, accessibility, and failure behavior where relevant.
- Mapping from requirements to implementation tasks and validation.

## Current feature specification

See [features.md](./features.md), the [architecture decisions](./architecture.md), and the [implementation task breakdown](./implementation-plan.md).
