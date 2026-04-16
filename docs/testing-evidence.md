# Testing Evidence

## Backend tests
Command:
`dotnet test`

Result:
Passed

Notes:
- 3+ backend unit tests passed
- 1 backend integration test passed
- authenticated endpoint coverage was verified through the test project

## Frontend tests
Command:
`cd frontend && npm test -- --run`

Result:
Passed

Notes:
- 3 frontend test files passed
- 6 frontend tests total passed
- route protection and auth-related UI behavior were covered

## E2E test
Command:
`cd frontend && npx playwright test`

Result:
Passed

Notes:
- GitHub Copilot Agent mode and Playwright MCP were used to help generate and refine the happy-path E2E flow
- final E2E flow covered register, browse, add to cart, checkout, order confirmation, and order history

## Quality self-check

### Functionality
- Login, checkout, order history, and admin flows were tested manually and automatically

### Security
- Protected endpoints require JWT auth
- Admin routes enforce role checks
- JWT key is stored outside committed config

### Code quality
- Automated test commands are now part of the repo workflow
- Test files are committed and repeatable