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
