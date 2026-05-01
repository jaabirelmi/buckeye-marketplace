# Buckeye Marketplace - Test Plan & Results

## Overview

This document records the comprehensive test suite for Buckeye Marketplace, including automated tests (unit, integration, end-to-end) and manual user flow validation against the live production deployment.

**Production URLs Tested:**
- Frontend: https://agreeable-mushroom-0fcb93e0f.7.azurestaticapps.net
- Backend API: https://buckeye-api-jaabir.azurewebsites.net

**Test Date:** April 30, 2026

---

## 1. Automated Test Coverage

### Backend (xUnit)

Located in `api.Tests/`. Total: **7 tests passing**.

**Unit tests (`api.Tests/Unit/`):**
- `OrderCalculationTests` — verifies order total calculation
- `OrderMappingTests` — verifies cart-to-order mapping logic
- `ConfirmationNumberTests` — verifies confirmation number generation

**Integration tests (`api.Tests/Integration/`):**
- `CartEndpointTests` — exercises the cart API end-to-end with `WebApplicationFactory<Program>` and an in-memory database, including authenticated cart retrieval

Evidence: `docs/test-evidence-backend.txt`

Run with:cd api.Tests and dotnet test



### Frontend (Vitest + React Testing Library)

Located in `frontend/src/test/`. Total: **6 tests passing across 3 test files**.

- `LoginPage.test.tsx` — renders login form, calls login service when submitted
- `ProtectedRoute.test.tsx` — redirects unauthenticated users, renders children for authenticated users
- `AdminRoute.test.tsx` — redirects non-admin users, renders children for admin users

Evidence: `docs/test-evidence-frontend.txt`

Run with:cd frontend and npm test -- --run




### End-to-End (Playwright MCP)

Located in `frontend/e2e/checkout.spec.ts`. Drives the happy-path user journey: register → login → browse → add to cart → checkout → view order in history.

Evidence and reflection: `docs/e2e-run.md`

Run with: cd frontend and npx playwright test

---

## 2. Manual User Flow Testing (Live Production)

All tests performed against the deployed production environment in Google Chrome (latest).

### User flows

| # | Test | Expected Result | Status |
|---|---|---|---|
| 1 | Browse products | 8 products load on home page | ✅ Pass |
| 2 | View product detail | Detail page shows all required fields | ✅ Pass |
| 3 | Register new account | Account created, redirected to login | ✅ Pass |
| 4 | Login | JWT received, navigated to home | ✅ Pass |
| 5 | Add items to cart | Cart count updates in header | ✅ Pass |
| 6 | Update cart quantity | Total recalculates correctly | ✅ Pass |
| 7 | Remove cart item | Item disappears, total adjusts | ✅ Pass |
| 8 | Checkout | Shipping form validates, order placed | ✅ Pass |
| 9 | Order confirmation | Confirmation page shows order details | ✅ Pass |
| 10 | Order history | Placed order visible in My Orders | ✅ Pass |

### Admin flows

| # | Test | Expected Result | Status |
|---|---|---|---|
| 11 | Login as admin | Admin link appears in nav | ✅ Pass |
| 12 | Open admin dashboard | Dashboard loads with products and orders | ✅ Pass |
| 13 | Create a product | Product appears in product list | ✅ Pass |
| 14 | Edit a product | Changes save and reflect in list | ✅ Pass |
| 15 | View all orders | All user orders listed | ✅ Pass |
| 16 | Update order status | Status change persists | ✅ Pass |

---

## 3. Cross-Browser Testing

| Browser | Smoke Test (browse + login + cart) | Status |
|---|---|---|
| Chrome (latest) | Full test suite (above) | ✅ Pass |
| Edge / Firefox | Browse, login, add to cart, checkout | ✅ Pass |

---

## 4. Mobile Responsiveness

Tested using Chrome DevTools device emulation (iPhone 14 Pro viewport).

| Test | Status |
|---|---|
| Layout renders without horizontal scroll | ✅ Pass |
| Navigation accessible on mobile | ✅ Pass |
| Product cards stack vertically | ✅ Pass |
| Cart and checkout flow usable on mobile | ✅ Pass |

---

## 5. Bugs Found & Fixed

### Bug #1: Admin dashboard fails to load on production

**Symptom:** When logged in as admin and navigating to the admin dashboard, the message "Could not load admin dashboard data." appeared. Browser console showed: localhost:5206/api/products:1 Failed to load resource: net::ERR_CONNECTION_REFUSED

**Root cause:** `AdminDashboardPage.tsx` had two hardcoded `localhost:5206` URLs that were missed during the production environment refactor (the rest of the app correctly used `import.meta.env.VITE_API_BASE_URL`).

**Fix:** Replaced hardcoded URLs with the configured environment variable in `AdminDashboardPage.tsx`. Committed in `M6: Fix admin dashboard URL + add SPA routing config for Azure`.

**Verification:** Re-tested all admin flows after the fix. All 6 admin flows now pass on the live production site.

### Bug #2: Direct navigation to client-side routes returned 404

**Symptom:** Visiting URLs like `/admin` or `/cart` directly (e.g., refreshing the page on those routes) returned a 404 from Azure Static Web Apps.

**Root cause:** Static Web Apps did not know to serve `index.html` for unknown routes so that React Router could handle client-side routing.

**Fix:** Added `frontend/staticwebapp.config.json` with a `navigationFallback` rule that rewrites unknown routes to `/index.html`.

**Verification:** Direct navigation to `/admin`, `/cart`, `/login`, etc. now loads correctly on production.

---

## 6. Continuous Integration Coverage

Both pipelines run automated tests on every push to `main`:

- **Frontend pipeline** (Azure Static Web Apps CI/CD): runs `npm test -- --run` in a dedicated `test` job before deploy. Deployment is gated on tests passing.
- **Backend pipeline** (Backend API CI): runs `dotnet test` against the integration and unit test projects, then verifies the project publishes successfully.

Evidence: GitHub Actions tab at `https://github.com/jaabirelmi/buckeye-marketplace/actions`.

---

## 7. Test Coverage Summary

| Layer | Test Type | Count | Status |
|---|---|---|---|
| Backend | Unit | 3+ | ✅ All passing |
| Backend | Integration | 1+ | ✅ All passing |
| Frontend | Unit/Component | 6 | ✅ All passing |
| End-to-End | Playwright | 1 happy-path spec | ✅ Passing |
| Manual | User flows | 10 | ✅ All passing |
| Manual | Admin flows | 6 | ✅ All passing |
| Manual | Cross-browser | 2 browsers | ✅ All passing |
| Manual | Mobile responsive | 4 checks | ✅ All passing |
| **Total bugs found and fixed during M6 testing** | | **2** | ✅ Both fixed |