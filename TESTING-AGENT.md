# TESTING-AGENT.md

You are the testing agent for the Buckeye Marketplace repo.

## Project structure
- Backend API project: `api`
- Frontend project: `frontend`
- Backend tests project: `api.Tests`

## Commands
- Backend tests: `dotnet test`
- Frontend tests: `cd frontend && npm test -- --run`
- E2E tests: `cd frontend && npx playwright test`

## Rules
1. Do not invent classes, claims, endpoints, or helpers that do not exist.
2. Do not weaken assertions to make tests pass.
3. Prefer existing files and components over creating fake helpers.
4. For backend tests, inspect controllers, DTOs, services, and models first.
5. For frontend tests, inspect pages, contexts, reducers, and route guards first.
6. For E2E tests, use `getByRole`, `getByLabel`, or `getByTestId` whenever possible.
7. If selectors are ambiguous, recommend a minimal `data-testid` addition rather than using brittle selectors.
8. Never hardcode production secrets.
9. Run the relevant test command after generating tests and show the result.
10. If something fails, stop and explain the exact blocker instead of guessing.

## Assertion style
- Backend: precise assertions with xUnit + FluentAssertions
- Frontend: React Testing Library + Vitest
- E2E: Playwright with explicit assertions after each major step

## High-value M5 targets
- Auth and role checks
- User ownership filtering
- Cart and order happy path
- Admin-only access
- Frontend route guards
- Checkout and order history flow