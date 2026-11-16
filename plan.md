# Plan: Magic X FF REST API — MTG Card Collections Platform

**Project Path**: `/c/Users/shousset/Documents/Tecnico-en-Desarrollo-de-Software/aplicacionees-web-II/magic-x-ff-rest-api`
**Last Updated**: 2026-11-16
**Current Version**: 0.0.1 (pre-release)

---

## 1. Project Overview

A **NestJS REST API** for managing **Magic: The Gathering** card data (focused on the **Final Fantasy** set) and enabling users to build personal **collections**. The API imports card data from **Scryfall**, provides authenticated endpoints for collection management, and is designed to serve a frontend (Next.js in `frontend/`).

### Core Capabilities (Implemented)
| Feature | Status | Notes |
|---------|--------|-------|
| Card catalog (CRUD, search, pagination, filtering) | ✅ Complete | Scryfall import script included |
| Rarity & Card Type catalogs | ✅ Complete | Auto-upserted on import |
| User authentication (JWT, bcrypt) | ✅ Complete | Roles: ADMINISTRATOR / PLAYER |
| Personal collections (CRUD, summary stats) | ✅ Complete | Tracks quantity + foil status |
| Image proxy / upload | ✅ Partial | Multer + static serving |
| Security (Helmet, CORS, rate-limit, validation) | ✅ Complete | Production-ready config |
| PostgreSQL + Prisma ORM | ✅ Complete | UUID users, auto-inc cards |

---

## 2. Architecture & Patterns

### Tech Stack
- **Runtime**: Node.js 20+ (TypeScript 5.7)
- **Framework**: NestJS 12 (modular, DI-based)
- **Database**: PostgreSQL via Prisma 6
- **Auth**: Passport-JWT, bcryptjs, roles guard
- **Validation**: class-validator + global ValidationPipe
- **Security**: Helmet, express-rate-limit, strict CORS
- **Testing**: Jest (unit + e2e), supertest

### Module Structure (NestJS)
```
src/
├── app.module.ts          # Root module, imports all feature modules
├── main.ts                # Bootstrap: CORS, Helmet, rate-limit, ValidationPipe
├── prisma/                # PrismaService + PrismaModule (global)
├── auth/                  # JWT login, guards, strategies, rate-limit middleware
├── users/                 # User CRUD, password hashing
├── cards/                 # Card catalog + Scryfall import
├── collections/           # User collections (entries with qty/foil)
├── card-types/            # Lookup: Creature, Instant, etc.
├── rarities/              # Lookup: Common, Rare, Mythic, etc.
└── images/                # Image upload / proxy
```

### Data Model (Prisma)
```prisma
User 1───< CollectionEntry >───1 Card
                    ▲
              Card 1───< Rarity
              Card 1───< CardType
```
- **User**: UUID, username (unique), passwordHash, role (ADMIN/PLAYER)
- **Card**: Auto-inc ID, name, manaCost, oracleText, power/toughness, setCode, collectorNumber (unique per set), artist, imageUrl, displayOrder, rarityId, cardTypeId
- **CollectionEntry**: UUID, userId, cardId, quantity, isFoil — **unique(userId, cardId, isFoil)** with upsert-on-create
- **Indexes**: Cards by setCode, name, rarityId, cardTypeId; Entries by userId, cardId

### Key Patterns Observed
| Category | Pattern | Example |
|----------|---------|---------|
| **Naming** | Feature modules: `xxx.module.ts`, `xxx.service.ts`, `xxx.controller.ts`, `dto/` | `cards/cards.service.ts` |
| **Errors** | Domain exceptions: `NotFoundException`, `ConflictException`, `BadRequestException`, `UnauthorizedException` | `cards.service.ts:120` |
| **Validation** | DTOs with `class-validator` decorators + global `ValidationPipe(whitelist, forbidNonWhitelisted)` | `main.ts:68` |
| **DB Access** | PrismaService injected; transactions for multi-step; upsert for idempotency | `collections.service.ts:35` |
| **Auth** | JWT in Authorization header; `JwtAuthGuard` + `RolesGuard`; password hashing in `auth/password.ts` | `auth/jwt.strategy.ts` |
| **Pagination** | `limit`/`offset` with `DEFAULT_LIMIT=50`, `MAX_LIMIT=200`; returns `{ data, meta: {total, limit, offset} }` | `collections.service.ts:18` |
| **Security** | Helmet CSP/HSTS in prod; rate-limit 15min/200req (prod); strict CORS allowlist; no cookies | `main.ts:28` |
| **Scripts** | `npm run import:cards` → `ts-node scripts/import-cards.ts` (Scryfall pagination) | `package.json:9` |

---

## 3. Current State Assessment

### ✅ Strengths
- Clean modular architecture following NestJS best practices
- Production-grade security middleware (Helmet, rate-limit, CORS)
- Idempotent Scryfall import with upsert logic
- Collection upsert prevents duplicate entries (increments quantity)
- Proper 404-on-foreign-owner pattern (no info leakage)
- Comprehensive Prisma indexes for query performance
- Environment-based config (`.env.example` provided)

### ⚠️ Gaps / Technical Debt
| Area | Issue | Severity |
|------|-------|----------|
| **Tests** | Only boilerplate e2e test (`app.e2e-spec.ts`); no unit/integration tests for services/controllers | High |
| **Frontend** | `frontend/` exists but appears empty (only `.next/` build output) | Medium |
| **API Docs** | No OpenAPI/Swagger module configured | Medium |
| **Card Sets** | Hardcoded `FIN` (Final Fantasy); no multi-set management UI | Low |
| **Images** | Image upload implemented but no processing (resize, WebP, CDN) | Low |
| **Search** | Basic `name` contains + rarity filter; no full-text, color, type, mana filters | Medium |
| **Admin** | No admin endpoints for user management, card moderation, import triggers | Medium |
| **Monitoring** | No health checks, metrics, or structured logging | Low |

---

## 4. Proposed Roadmap (Phased)

### Phase 1: Quality Foundation (1–2 weeks)
**Goal**: Make the codebase production-trustworthy.

| Task | Description | Validation |
|------|-------------|------------|
| 1.1 | Add unit tests for `CardsService`, `CollectionsService`, `AuthService` | `npm test -- --coverage` ≥ 80% |
| 1.2 | Add e2e tests for auth flow, card search, collection CRUD | `npm run test:e2e` passes |
| 1.3 | Configure Swagger/OpenAPI (`@nestjs/swagger`) at `/api/docs` | Visit `/api/docs` shows all endpoints |
| 1.4 | Add structured logging (pino or NestJS Logger) + request ID correlation | Logs include `requestId` |
| 1.5 | Add health check endpoint (`/health`) with DB connectivity | `GET /health` → `{status: "ok", db: "connected"}` |

### Phase 2: API Enhancement (2–3 weeks)
**Goal**: Richer card discovery & collection features.

| Task | Description | Validation |
|------|-------------|------------|
| 2.1 | Advanced card filters: color, type, mana value, set, rarity, text search | `GET /cards?colors=WU&type=Creature&mv=3` |
| 2.2 | Full-text search on `oracleText` (PostgreSQL `tsvector` + GIN index) | Sub-100ms text search |
| 2.3 | Collection summary endpoint: total value (TCGPlayer/MTGJSON prices), deck export | `GET /collections/summary` |
| 2.4 | Bulk collection operations: import from CSV/decklist, mass update | `POST /collections/bulk` |
| 2.5 | Card price integration (MTGJSON or Scryfall `prices` field) | Price fields in card response |

### Phase 3: Multi-Set & Admin (2–3 weeks)
**Goal**: Support multiple sets + admin tooling.

| Task | Description | Validation |
|------|-------------|------------|
| 3.1 | Set catalog model (`Set` entity: code, name, releaseDate, cardCount, iconUrl) | Prisma migration + CRUD |
| 3.2 | Admin endpoints: trigger import, manage users, moderation | `POST /admin/import`, `GET /admin/users` |
| 3.3 | Scheduled import job (cron) for new sets via Scryfall | Runs daily, logs results |
| 3.4 | Card legality (Standard, Modern, Commander, etc.) from Scryfall | `legalities` field on Card |

### Phase 4: Frontend Integration (2–4 weeks)
**Goal**: Complete the Next.js frontend.

| Task | Description | Validation |
|------|-------------|------------|
| 4.1 | Scaffold Next.js 14+ app in `frontend/` (App Router, TypeScript, Tailwind) | `npm run dev` in `frontend/` |
| 4.2 | Auth pages: login, register, JWT storage (httpOnly cookie or memory) | Login → redirect to collection |
| 4.3 | Card browser: search, filters, infinite scroll, card detail modal | Works against local API |
| 4.4 | Collection UI: add/remove, quantity/foil toggle, stats dashboard | Persists to API |
| 4.5 | Deck builder: format legality, mana curve, export (MTGA, Moxfield) | Export downloads `.deck` |

### Phase 5: Scale & Polish (Ongoing)
**Goal**: Production hardening.

| Task | Description |
|------|-------------|
| 5.1 | Redis caching for card catalog (invalidate on import) |
| 5.2 | Image optimization pipeline (Sharp → WebP, multiple sizes, CDN) |
| 5.3 | Rate-limit per-user (not just IP) for authenticated routes |
| 5.4 | Audit logging for admin actions |
| 5.5 | CI/CD: GitHub Actions (lint, test, build, deploy) |

---

## 5. Files to Create / Modify (Immediate)

| File | Action | Reason |
|------|--------|--------|
| `src/main.ts` | **UPDATE** | Add `@nestjs/swagger` setup; health check endpoint |
| `src/app.module.ts` | **UPDATE** | Import `SwaggerModule`, `ConfigModule` (if not global) |
| `test/*.spec.ts` | **CREATE** | Unit tests for each service + controller |
| `test/e2e/*.e2e-spec.ts` | **CREATE** | Full auth + collection flows |
| `prisma/schema.prisma` | **UPDATE** (Phase 2+) | Add `Set`, `CardPrice`, `CardLegality` models |
| `scripts/import-cards.ts` | **UPDATE** (Phase 3) | Support multiple sets, prices, legalities |
| `frontend/` | **CREATE** (Phase 4) | Next.js app with API integration |

---

## 6. Validation Commands

```bash
# Install deps
npm ci

# Lint + format
npm run lint
npm run format

# Type-check + build
npm run build

# Unit tests + coverage
npm run test:cov

# E2E tests
npm run test:e2e

# Dev server (API on :3002)
npm run start:dev

# Import cards (requires DATABASE_URL)
npm run import:cards

# Health check (after Phase 1.5)
curl http://localhost:3002/health

# Swagger docs (after Phase 1.3)
open http://localhost:3002/api/docs
```

---

## 7. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Scryfall API rate limits / schema changes | Medium | High (import breaks) | Cache responses; version-detect; fallback to MTGJSON |
| PostgreSQL full-text search performance | Low | Medium | GIN index + `tsvector` column; monitor query plans |
| Frontend/backend auth mismatch (CORS, cookies vs Bearer) | Medium | High | Document auth flow; integration test the handshake |
| Collection upsert race condition (concurrent adds) | Low | Medium | Prisma upsert is atomic; verify with load test |
| Image storage growth (user uploads) | Medium | Low | S3-compatible storage + lifecycle policy; reject >5MB |

---

## 8. Acceptance Criteria (Definition of Done)

- [ ] **Phase 1**: `npm run test:cov` ≥ 80%; `npm run test:e2e` passes; Swagger at `/api/docs`; `/health` returns 200
- [ ] **Phase 2**: Card search supports ≥5 filter types; collection summary includes estimated value; bulk import works
- [ ] **Phase 3**: Multiple sets importable; admin endpoints protected by `ADMINISTRATOR` role; cron job runs daily
- [ ] **Phase 4**: Frontend builds; login → collection view → card browser → deck export works end-to-end
- [ ] **All phases**: `npm run build` succeeds; no `any` types in new code; lint clean

---

## 9. Quick Start for Contributors

```bash
# 1. Clone & install
cd magic-x-ff-rest-api
npm ci

# 2. Configure env
cp .env.example .env
# Edit .env with your DATABASE_URL, JWT_SECRET

# 3. Database
npx prisma migrate dev --name init

# 4. Import cards (Final Fantasy set)
npm run import:cards

# 5. Run API
npm run start:dev
# → http://localhost:3002

# 6. (Phase 4+) Run frontend
cd frontend && npm ci && npm run dev
# → http://localhost:3000
```

---

*Generated from codebase analysis on 2026-11-16. Update this plan as phases complete.*