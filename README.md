# Mi Casa

A collaborative home management app built as a TypeScript monorepo. Three apps backed by four shared packages.

## Structure

```
/
├── apps/
│   ├── api/       # GraphQL API (Fastify + GraphQL Yoga)
│   ├── mobile/    # React Native app (Expo v54)
│   └── service/   # Background job processor (BullMQ)
├── packages/
│   ├── common/    # Shared types & Zod validation
│   ├── db/        # Prisma ORM + generated client
│   ├── domain/    # Business logic (tasks, recurring tasks)
│   └── gql/       # GraphQL schema & codegen'd types
└── docker-compose.yml
```

## Tech Stack

| Layer | Tech |
|---|---|
| Mobile | React Native (Expo), Apollo Client, Zustand, TanStack Form |
| API | Fastify, GraphQL Yoga, JWT auth, AWS S3 |
| Jobs | BullMQ + Redis |
| Database | PostgreSQL 17 via Prisma |
| Language | TypeScript (strict, ESM) |

## Data Flow

```
Mobile ──GraphQL (JWT)──▶ API ──Prisma──▶ PostgreSQL
                          │
                          └──enqueue──▶ Redis ──▶ Service ──▶ Push Notifications
```

## Key Domains

Business logic lives in `packages/domain/src`:

- **Tasks** — create, update, complete, status tracking
- **Recurring Tasks** — scheduling and generation

## Development

Docker Compose runs the full local environment:

| Service | Description |
|---|---|
| API | Fastify + GraphQL server |
| Service | BullMQ job processor |
| PostgreSQL | Primary database |
| Redis | Job queue backend |
| Durabull | BullMQ dashboard (http://localhost:3000) |
| Cloudflare Tunnel | Secure external access |

```bash
docker compose up
```
