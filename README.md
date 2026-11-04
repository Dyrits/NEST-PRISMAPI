# NEST-PRISMAPI

A back-end REST API built with NestJS and Prisma, as a learning project.

**Status: work in progress.**

## About The Project

A NestJS REST API with JWT authentication, users and bookmarks, using Prisma with a PostgreSQL database running in Docker.

### Built With

- NestJS (Node.js + TypeScript)
- Prisma + PostgreSQL
- JWT / Passport (authentication)
- Docker Compose
- Jest (tests)

## Getting Started

### Prerequisites

- Node.js
- Docker and Docker Compose (for PostgreSQL)
- A `.env` file with `DATABASE_URL` and `JWT_SECRET`

### Installation

```sh
npm install
docker compose up -d        # start PostgreSQL
npx prisma migrate deploy   # apply the schema
```

### Development

```sh
npm run start:dev    # NestJS with watch mode
npm run test:e2e     # end-to-end tests (Jest)
```

## License

No license file is present in this repository.

## Contact

Dyrits - https://github.com/Dyrits

## Dependency verification (November 2026)

Targeted lockfile updates fix the form-data boundary randomness and proxy-addr trust-subnet advisories. Other dependency advisories remain, including high-severity findings; this is not a security clearance or a supported production-stack claim. Use Node.js 26.13.0 LTS and a clean `npm ci`, then `npm run build` and `npm run test:dependencies`.

The authentication HTTP check uses a stub authentication service to test routing and input validation. It does not test Prisma, a real database, password hashing, JWT issuance or a deployed service. A compatible jsonwebtoken update also fixes an actual startup failure on Node 26. The repository has no unit test files matching its default Jest command.

The Nest 10 adapter pins old Express/body-parser versions. Compatible-major overrides now select Express 4.22.3 and body-parser 1.20.9 to fix additional request-body advisories without a framework migration. The HTTP check also sends an invalid gzipped JSON request with trailing bytes over a real socket, expects HTTP 400 within two seconds and confirms the app still responds afterward. Other high and moderate dependency findings still remain.

The November 4, 2026 compatible transitive refresh removes another 36 distinct advisory IDs (78 to 42) without new IDs. Final local npm audit has 43 package findings: 0 critical, 16 high, 14 moderate, 13 low. Fresh install, build, and isolated dependency HTTP/malformed-gzip tests pass on Node.js 26. The authentication service remains stubbed for this smoke test; database access, real password hashing and JWT issuance are not covered. Existing framework/toolchain findings and broken legacy test fixtures remain unresolved.

The scoped Nest core path-to-regexp override selects the patched 3.3.0 release without changing Express's separate 0.1.x route parser. Fresh install, build and existing dependency HTTP/gzip smoke tests pass on Node.js 26. One more distinct advisory ID is removed with none added. Framework-major PRs and remaining security findings are unresolved.

## Coherent Nest 11 verification (November 2026)

Nest framework, Express adapter, testing, CLI and schematics move together to version 11. Config 4, JWT 11, Passport 11.0.5, Reflect Metadata 0.2 and Express 5 types accompany that migration. Node.js 26.13.0 LTS is the tested runtime. Old Express 4/body-parser/Nest 10 route-parser overrides are removed; patched Multer 2.5, CLI Glob 14.0.3 and Minimatch 9.0.7 are scoped and tested. The duplicate, ignored `name` option is removed from the passport-jwt options; the strategy still registers as `JWT` through PassportStrategy.

Clean npm installation and build pass. The existing stubbed-controller HTTP/validation/malformed-gzip test still passes. New tests exercise real Argon2 hashing and password verification, JWT issuance/signature verification, and Passport guarded HTTP: absent or invalid tokens return 401 and a valid token returns 200. Those tests use an isolated in-memory database fixture and an ephemeral signing key, not a real Prisma connection. The separate Nest FileInterceptor fixture returns 201 for a valid upload and 400 for an unexpected field; no application upload route was added.

The local audit changes from 42 to 37 package findings: high 14 to 0, moderate 15 to 33, low 13 to 4, critical 0. Distinct advisory IDs fall from 41 to 2 with no new IDs; residual Deepmerge and Minimatch findings remain. Package counts reflect inherited tooling findings, so a higher moderate count is not a new advisory family.

Prisma CLI 6.2.1 and client 5.10.2 remain at their previously locked versions and original ranges. An unrelated later Prisma CLI update introduced a new DeepmergeTS advisory and was not included. Their existing version mismatch, real database connectivity, migrations and deployed authentication remain unverified. No credentials were rotated and no hosted service was contacted. The versioned Nest 10-to-11 migration guide used for the route/DTO review is https://github.com/nestjs/docs.nestjs.com/blob/ba85c6a2/content/migration.md .
