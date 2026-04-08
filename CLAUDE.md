# Engineering Guidelines

## Source control

- NEVER make changes to git commit history

## TypeScript

- Never return a naked promise from an async function — always `await` the call.

```typescript
// Wrong
async function foo() {
  return db.user.findUnique({ where: { id } });
}

// Correct
async function foo() {
  return await db.user.findUnique({ where: { id } });
}
```

## GraphQL Schema (`packages/gql/schema/`)

- New GraphQL types for an entity go in the existing `[entity].types.graphql` file — do not create separate files (e.g. no `task.transitions.graphql`).
- Follow the existing per-entity folder structure: `schema/tasks/`, `schema/users/`, etc.
- Any new mappers must be added to `packages/gql/src/gql-codegen.ts`

## API Resolvers (`apps/api/src/gql/resolvers/`)

- All type resolvers for an entity go in the existing `[entity]/types.ts` file — do not create separate files per type (e.g. no `transitionTypes.ts`).
