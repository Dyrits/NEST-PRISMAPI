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
