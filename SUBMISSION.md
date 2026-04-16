# SUBMISSION

## Repository
Buckeye Marketplace - Milestone 5

## Test Credentials

### Regular User
- Email: `user@buckeyemarketplace.com`
- Password: `User1234`

### Admin User
- Email: `admin@buckeyemarketplace.com`
- Password: `Admin123`

## Security Practices Applied

1. JWT signing key stored outside committed source code  
The application reads the JWT signing key from User Secrets or environment configuration instead of `appsettings.json`, which reduces the risk of secrets being exposed in the repository.

2. Protected endpoints use JWT auth and role checks  
Cart and order endpoints require authentication, and admin-only endpoints use role-based authorization so regular users cannot access admin actions.

3. User ownership comes from JWT claims, not route/body input  
User-specific actions like cart access and order history are scoped from the authenticated JWT user instead of trusting a `userId` passed in the request, which helps prevent broken access control.

4. Safe database access through EF Core LINQ  
The project uses EF Core and LINQ queries rather than raw SQL string concatenation, which reduces SQL injection risk.

## AI Usage
See: `AI Tool Usage.md`

## Testing Summary
- `dotnet test` passed
- `cd frontend && npm test -- --run` passed
- `cd frontend && npx playwright test` passed

## Notes
- Admin user is seeded on a fresh database
- JWT key is not committed in appsettings
- Playwright spec file is included in `frontend/e2e/checkout.spec.ts`
- E2E notes are included in `docs/e2e-run.md`
- Testing evidence is included in `docs/testing-evidence.md`

## Local User Secrets Setup

To run the API locally, set the JWT signing key in user secrets for the `api` project.

Example command:
`dotnet user-secrets set "Jwt:Key" "REPLACE_WITH_YOUR_LOCAL_KEY"`

If grading requires the exact local key I used, I will provide it separately as requested.