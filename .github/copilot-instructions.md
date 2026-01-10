# StampCoin Platform - AI Coding Instructions

## Overview
StampCoin is a blockchain-powered NFT marketplace for rare stamp collecting. It combines a React 19 frontend, Node.js/Express backend with tRPC APIs, Drizzle ORM with MySQL, and Polygon/IPFS integration. **This is proprietary software** (see COPYRIGHT, IP_PROTECTION_SUMMARY.md).

## Project Architecture

### Three-Layer Structure
- **Frontend** (`client/src`): React 19 + TypeScript, Vite, TailwindCSS 4, wouter routing, shadcn/ui
- **Backend** (`server`): Express + tRPC 11, Drizzle ORM, business logic services
- **Shared** (`shared`): Types and constants used across frontend/backend

### Data Flow Pattern
1. Client sends request via tRPC client (`client/src/lib/trpc.ts`)
2. tRPC middleware validates auth (JWT cookies) in `server/_core/context.ts`
3. Procedure (public/protected/admin) executes business logic using `server/db.ts` helpers
4. Response serialized via SuperJSON transformer for Date/BigInt support

### Service-Oriented Backend
Core services in `server/`:
- **Database**: `db.ts` (Drizzle queries), `drizzle/schema.ts` (30+ tables)
- **Authentication**: `authentication.ts` (JWT verification, OAuth)
- **NFT Operations**: `nft-minting.ts` (Polygon, IPFS), `nft-pipeline.ts`
- **Routers** (in `routers/`): 6 specialized domains (auth, archive, stamps, trading, shipping)

### Database Pattern
Uses **Drizzle ORM with MySQL**. Never write raw SQL. Examples:
```typescript
// Query pattern (from db.ts)
const result = await db.query.stamps.findMany({ where: eq(stamps.id, stampId) });

// Insert pattern
await db.insert(users).values(userData).onDuplicateKeyUpdate({ set: updateData });

// Migrations
run: `db:push` (generates migrations + applies them)
```

### Router Organization
Each router is a separate tRPC router composed into `appRouter`:
- `archive-router.ts`: Digital stamp archive (10+ procedures)
- `stamp-authentication.ts`: Minting, uploads (826 lines, 12+ procedures)
- `stamp-trading.ts`: P2P trading, escrow (500+ lines)
- `stamp-shipping.ts`: Logistics tracking
- `downloads.ts`, `stamp-authentication.ts`: Asset/cert delivery

Add new procedures following this pattern:
```typescript
export const stampRouter = router({
  upload: protectedProcedure
    .input(z.object({ title: z.string(), image: z.unknown() }))
    .mutation(async ({ ctx, input }) => {
      // Access user: ctx.user (guaranteed due to protectedProcedure)
      // Call db helpers: await db.insert(...)
    }),
  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      // No ctx.user guarantee here
    }),
});
```

## Critical Workflows

### Development
```bash
pnpm dev          # Both frontend + backend
pnpm dev:client   # Frontend only (Vite port 5173)
pnpm dev:server   # Backend only (Express port 3000+)
```

### Database
```bash
pnpm db:push      # Generate migrations + apply to MySQL
# Schema is source-of-truth (drizzle/schema.ts)
```

### Testing & Quality
```bash
pnpm test         # vitest (archive.test.ts, stamps.test.ts, etc)
pnpm check        # tsc --noEmit (type checking, strict: false but enforced)
pnpm format       # prettier
```

### Building & Deployment
```bash
pnpm build        # Produces dist/ (backend + frontend bundle)
pnpm start        # NODE_ENV=production node dist/index.js
# Docker: docker-compose up -d or individual deploy scripts (Railway, Render, Fly.io)
```

## Key Patterns & Conventions

### Procedure Access Patterns
- `publicProcedure`: No auth required, `ctx.user` is null
- `protectedProcedure`: Requires auth, `ctx.user` guaranteed (thrown if missing)
- `adminProcedure`: Role check (ctx.user.role === 'admin'), throws TRPCError

### Schema Validation
- Use Zod for input validation (imported from 'zod')
- All procedures must define `.input(z.object({ ... }))`
- Consistent error messages in Arabic + English

### Multi-language Support
Database tables have `_Ar`, `_De`, `_Fr`, `_Es`, `_Zh`, `_Ko` fields for translations. Example:
```typescript
export const stamps = mysqlTable("stamps", {
  title: varchar("title", { length: 200 }).notNull(),
  titleAr: varchar("titleAr", { length: 200 }),
  // ... more language fields
});
```

### File Storage
Use `server/storage.ts` helpers (`storagePut`, `storageGet`):
```typescript
// Upload to cloud storage (AWS S3 proxy)
await storagePut(`stamps/${stampId}/image.jpg`, buffer, 'image/jpeg');

// Download URLs
const url = await storageGet(`stamps/${stampId}/image.jpg`);
```

### NFT & Blockchain Integration
- **Contracts** in `contracts/` (ERC-721, deployed on Polygon)
- **IPFS metadata** via `server/ipfs.ts` (Pinata integration)
- **ethers.js** for contract calls (ERC-721 minting)
- Serial numbers: `STAMP-{country}-{year}-{sequence}` (from `archive-downloader.ts`)

### Error Handling
Throw `TRPCError` with appropriate codes:
```typescript
throw new TRPCError({
  code: "NOT_FOUND",
  message: "Stamp not found"
});
// codes: UNAUTHORIZED, FORBIDDEN, NOT_FOUND, BAD_REQUEST, INTERNAL_SERVER_ERROR
```

## Project-Specific Conventions

### Naming
- Database tables: singular (stamps, users, transactions)
- Routers: domain-based (stampRouter, archiveRouter)
- Drizzle types: `T = typeof table.$inferSelect`, `InsertT = typeof table.$inferInsert`
- Components: PascalCase, hooks start with `use`

### Configuration
- Environment: `.env.local` (git-ignored), `.env.example` for reference
- `DATABASE_URL`: MySQL connection string (from TiDB Cloud or Docker)
- `NODE_ENV`: 'development' or 'production' (controls Vite vs static serving)
- OAuth: Google/Discord (from `.env` GOOGLE_OAUTH_*, DISCORD_*)

### Testing Focus
- Test archive pricing logic (`archive.test.ts`)
- Test authentication workflows (`auth.logout.test.ts`)
- Test payment flows (`payments.test.ts`, Stripe mocking)
- vitest config in `vitest.config.ts`

### Feature Domains
1. **Stamp Archive**: 50 historical stamps from Internet Archive (pricing algorithm, NFT generation)
2. **Authentication**: User signup, JWT verification, OAuth flow
3. **Trading**: P2P listings, escrow system, dispute resolution
4. **Shipping**: Address tracking, invoice generation (Stripe integration)
5. **Expertise Network**: Expert verification, appraisals, partnerships
6. **Admin**: Seed data loading, database status monitoring

## When Adding Features

1. **Add schema** → Update `drizzle/schema.ts`, run `pnpm db:push`
2. **Add router** → Create `server/routers/feature.ts`, import in `server/routers.ts`
3. **Add frontend** → Create pages in `client/src/pages/`, add route in `App.tsx`
4. **Use tRPC client** → `trpc.feature.getProcedure.useQuery()` or `.useMutation()`
5. **Handle auth** → Use `protectedProcedure` if user-specific data needed
6. **Test** → Add tests in `server/` using vitest, test data seeding via `seed-stamp-data.ts`

## Troubleshooting Tips

- **Port conflicts**: Server finds available port starting from 3000 (see `server/_core/index.ts` findAvailablePort)
- **Database connection**: DATABASE_URL must be MySQL-compatible; Docker compose provides local instance
- **Stripe webhook**: Registered BEFORE express.json() to preserve raw body (see index.ts)
- **Frontend build**: Vite chunks managed by rollupOptions in vite.config.ts (react, trpc, ui, charts separate chunks)
- **Type errors**: Run `pnpm check` before commit (strict: false but TypeScript enforced via build)

## File References
- API patterns: [server/routers.ts](server/routers.ts#L1), [stamp-authentication.ts](server/routers/stamp-authentication.ts#L1)
- Database: [drizzle/schema.ts](drizzle/schema.ts#L1)
- Server setup: [server/_core/index.ts](server/_core/index.ts#L1)
- Frontend setup: [client/src/App.tsx](client/src/App.tsx#L1)
