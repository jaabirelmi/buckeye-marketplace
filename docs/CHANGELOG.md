# CHANGELOG

## Milestone 5
- Added JWT authentication with ASP.NET Core Identity
- Added protected cart and order endpoints
- Added role-based authorization for admin features
- Added checkout, order confirmation, and order history flow
- Added admin dashboard product management and order status management
- Added backend unit tests and backend integration testing
- Added frontend Vitest component and route tests
- Added Playwright E2E happy-path test artifact
- Fixed auth, test, and selector issues discovered during QA
- Verified JWT key is stored in User Secrets / environment config
- Verified user-specific endpoints use JWT claims instead of trusting route/body user IDs