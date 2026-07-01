# General Guidelines

- Don't assume anything, always ask clarifying questions

# Engineering Guidelines

- Always follow existing convention and architecture whenever possible
- If you believe a different convention or architecture is appropriate, ask for permission first

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

- Always use curly braces in if/for/while blocks, even if only a single line

```typescript
// Wrong
function foo() {
  if (param) return;
}

// Correct
function foo() {
  if (param) {
    return;
  }
}
```

- When dealing with arrays, always prefer non-mutating methods (e.g. map, filter, slice, concat, etc.) over mutation. The only exception is if there is a critical performance concern, in which case the concern should be commented
- Functions should have clear input and output types
- Always prefer reusing existing type definitions rather than creating new inline type definitions
- Functions should always be pure (i.e. no side effects) unless absolutely necessary. If a side effect is necessary, then that side effect should be relegated to its own function
- Always use named exports. Never use default exports.
- Avoid complex numerical calculations in one variable assignment. Prefer smaller numerical calculations that get assigned to clearly named temporary variables.
- Avoid magic numbers (i.e. numeric literals with no explanation). If a static number is required, assign it to a clearly named constant

## React

- Files containing component shall contain ONLY the exported component function, the non-exported props type definition, and in the case of react native comopnents, a non-exported stylesheet object
- Do not perform excessive logic inside of a component function. If it's more than just a couple of lines it needs to be pulled out to a util function or hook.
- Avoid excessive component nesting. Excessive component nesting is a sign that the component function needs to be refactored using private child components.
- If a component needs custom hooks, util functions, or private child components, those need to be in their own files
- If the result is only one component file, that component file can live by itself. If the result is a component file plus one or more supporting files (e.g. utils or hooks), all files should exist in a directory with the same name as the component. Inside that directory will be the component file and all supporting files. The component file will have the same name as the component. An index file will export only the named component.

## GraphQL Schema (`packages/gql/schema/`)

- New GraphQL types for an entity go in the existing `[entity].types.graphql` file — do not create separate files (e.g. no `task.transitions.graphql`).
- Follow the existing per-entity folder structure: `schema/tasks/`, `schema/users/`, etc.
- Any new mappers must be added to `packages/gql/src/gql-codegen.ts`

## API Resolvers (`apps/api/src/gql/resolvers/`)

- All type resolvers for an entity go in the existing `[entity]/types.ts` file — do not create separate files per type (e.g. no `transitionTypes.ts`).
