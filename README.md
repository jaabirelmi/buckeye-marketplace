# Buckeye Marketplace

A web marketplace built for Ohio State students to buy and sell items within the campus community.

**Course:** ACCTMIS 4630 — Business Systems Application Development  
**Instructor:** Chad Thomas  
**Semester:** Spring 2026  
**Author:** Jaabir Elmi

---

## Live Application

| Component | URL |
| --- | --- |
| Frontend (Azure Static Web Apps) | https://agreeable-mushroom-0fcb93e0f.7.azurestaticapps.net |
| Backend API (Azure App Service) | https://buckeye-api-jaabir.azurewebsites.net |
| Sample API endpoint | https://buckeye-api-jaabir.azurewebsites.net/api/products |

### Test Credentials

| Role | Email | Password |
| --- | --- | --- |
| Regular user | user@buckeyemarketplace.com | User1234 |
| Admin | admin@buckeyemarketplace.com | Admin123 |

These accounts are seeded automatically on first startup. The admin account unlocks the `/admin` dashboard for product and order management.

---

## Project Description

Buckeye Marketplace solves a real problem on the OSU campus: students who want to buy and sell items to each other are forced onto general-purpose platforms like Facebook Marketplace, where deals frequently fall through with non-students, and there is no campus-only context for trust or convenience.

Buckeye Marketplace is a closed marketplace scoped to the OSU community. Students can list items, browse listings by category, manage a persistent cart, check out, and track their order history. Admins can manage the catalog and update order statuses through a dedicated dashboard.

The project follows a full SDLC arc across six milestones, beginning with Design Thinking and user research and ending with deployment to Azure with a CI pipeline, automated tests, and full documentation.

---

## Features

- Browse the product catalog by category (Textbooks, Electronics, Furniture, School Supplies)
- Product detail pages with images, descriptions, prices, and seller information
- User registration with enforced password complexity (8+ chars, digit, uppercase)
- JWT-based authentication with refresh token support
- Role-based authorization (User vs. Admin)
- Persistent shopping cart backed by the database
- Optimistic UI updates with backend synchronization
- Checkout flow with shipping address capture and order confirmation numbers
- Per-user order history (scoped via JWT claims, not URL parameters)
- Admin dashboard with product CRUD and order status management
- HTTPS enforced on all production endpoints
- Automated CI pipelines for both frontend and backend

---

## Technology Stack

### Backend

- **.NET 10** (`Microsoft.NET.Sdk.Web`)
- **ASP.NET Core 10** Web API
- **Entity Framework Core 10.0.5** with **SQLite** for data persistence
- **ASP.NET Core Identity** for authentication and user management
- **JWT Bearer tokens** (`Microsoft.AspNetCore.Authentication.JwtBearer 10.0.5`)
- **Swagger / OpenAPI** (`Swashbuckle.AspNetCore 10.1.7`) for API documentation in development

### Frontend

- **React 19.2** with **TypeScript 5.9**
- **Vite 7.3** for the dev server and build pipeline
- **React Router 7.13** for client-side routing
- React Context + `useReducer` for cart state management

### Testing

- **xUnit** for backend unit and integration tests
- **WebApplicationFactory<Program>** with the in-memory database provider for integration tests
- **Vitest 4.1** + **React Testing Library** for frontend unit/component tests
- **Playwright 1.55** for end-to-end happy-path testing

### Infrastructure

- **Azure App Service** (Linux, B1 plan) — backend API
- **Azure Static Web Apps** (Free tier) — frontend
- **GitHub Actions** — CI/CD
- **SQLite on Azure App Service persistent storage** (`/home/data/`) — production database

> **Note on the production database:** The original architecture targeted Azure SQL Database. The Azure for Students subscription assigned to this project blocked SQL Database provisioning across every region offered to it (`RequestDisallowedByAzure`). Rather than burn deadline time chasing capacity, the application was deployed using SQLite on App Service's persistent `/home/data/` volume. The application code is database-agnostic — `Program.cs` selects between SQLite and SQL Server based on the connection string at runtime — so swapping back to Azure SQL is a configuration change, not a code change.

---

## Repository Structure

The repository is organized as follows. The `api/` folder is the .NET backend, `frontend/` is the React SPA, `api.Tests/` holds backend tests, `docs/` contains all design and process documentation, and `.github/workflows/` defines the CI/CD pipelines.

- **api/** — .NET 10 Web API (Controllers, Data, DTOs, Migrations, Models, Services, Program.cs, appsettings)
- **api.Tests/** — xUnit unit and integration tests
- **frontend/** — React + TypeScript SPA (components, contexts, pages, services, reducers, types, e2e tests)
- **docs/** — ADR, ComponentArchitecture, AI usage log, ERD/architecture PNGs, test plans, evidence files
- **.github/workflows/** — GitHub Actions CI/CD pipelines for frontend and backend

---

## Local Development Setup

### Prerequisites

- .NET 10 SDK
- Node.js 20 or newer (npm 10+)
- Git

### 1. Clone the repository
### 1. Clone the repository
git clone https://github.com/jaabirelmi/buckeye-marketplace.git
cd buckeye-marketplace
### 2. Backend setup
cd api
dotnet restore
dotnet user-secrets set "Jwt:Key" "super-long-m5-secret-key-1234567890"
dotnet run

The API will start at http://localhost:5206 and run EF Core migrations against a local SQLite file (`buckeye-marketplace.db`). Two accounts are seeded on first run (see Test Credentials above).

Swagger UI is available in development at http://localhost:5206/swagger.

### 3. Frontend setup (in a second terminal)
cd frontend
npm install
npm run dev
The frontend will start at http://localhost:5173 and read its API base URL from `frontend/.env.development`, which points at http://localhost:5206/api.

### 4. Sign in

Open http://localhost:5173 and sign in with one of the seeded accounts above, or register a new one.

---

## Environment Variables

### Local development

| Location | Variable | Notes |
| --- | --- | --- |
| Backend | `Jwt:Key` (user-secrets) | JWT signing key. Set via `dotnet user-secrets`. Never committed. |
| Backend | `ConnectionStrings:DefaultConnection` (`appsettings.json`) | Defaults to SQLite file `buckeye-marketplace.db`. |
| Backend | `Cors:AllowedOrigins:0` (`appsettings.json`) | Defaults to http://localhost:5173. |
| Frontend | `VITE_API_BASE_URL` (`.env.development`) | Defaults to http://localhost:5206/api. |

### Production (Azure App Service application settings)

| Variable | Value |
| --- | --- |
| `Jwt__Key` | Strong random base64 key (set via `az webapp config appsettings set`) |
| `Cors__AllowedOrigins__0` | https://agreeable-mushroom-0fcb93e0f.7.azurestaticapps.net |
| `ASPNETCORE_ENVIRONMENT` | Production |
| `WEBSITES_PORT` | 8080 |
| `SCM_DO_BUILD_DURING_DEPLOYMENT` | false |
| `ENABLE_ORYX_BUILD` | false |

> .NET maps environment-variable keys with `__` (double underscore) to nested config keys (e.g. `Jwt__Key` maps to `Jwt:Key`).

### Frontend production

| Location | Variable | Value |
| --- | --- | --- |
| `frontend/.env.production` | `VITE_API_BASE_URL` | https://buckeye-api-jaabir.azurewebsites.net/api |

---

## API Documentation

### Swagger (development)

Run the backend locally and visit http://localhost:5206/swagger. All endpoints are documented with request/response schemas and a "Try it out" UI. JWT authentication is integrated — paste a token from `/api/auth/login` into the Authorize dialog to exercise protected endpoints.

### Endpoint summary

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | none | Register a new user |
| POST | `/api/auth/login` | none | Log in, receive JWT + refresh token |
| POST | `/api/auth/refresh` | none | Exchange refresh token for new JWT |
| GET | `/api/products` | none | List all products |
| GET | `/api/products/{id}` | none | Single product or 404 |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/{id}` | Admin | Update product |
| DELETE | `/api/products/{id}` | Admin | Delete product |
| GET | `/api/cart` | User | Current user's cart |
| POST | `/api/cart` | User | Add item to cart |
| PUT | `/api/cart/{cartItemId}` | User | Update item quantity |
| DELETE | `/api/cart/{cartItemId}` | User | Remove item from cart |
| DELETE | `/api/cart/clear` | User | Empty the cart |
| POST | `/api/orders` | User | Create an order from current cart |
| GET | `/api/orders/mine` | User | Current user's order history (user resolved from JWT) |
| GET | `/api/orders` | Admin | All orders across all users |
| PUT | `/api/orders/{orderId}/status` | Admin | Update an order's status |

---

## Architecture Documentation

### High-level system architecture

The original system architecture diagram is in `docs/System Architecture - Buckeye Marketplace.png` (created in Milestone 2). The diagram shows the React SPA, the .NET API, and the database as separate tiers communicating over HTTP.

For Milestone 6 the deployed architecture adds an Azure layer on top of that same logical structure: the browser hits Azure Static Web Apps, which serves the React bundle. The frontend then calls the backend at the Azure App Service domain, with HTTPS enforced and CORS allowlisted to the Static Web Apps origin only. The App Service runs ASP.NET Core on Linux (B1 tier), and EF Core writes to a SQLite database stored on the App Service `/home/data/` persistent volume.

CI/CD sits beside this architecture: every push to `main` triggers two GitHub Actions workflows — one for the frontend (run Vitest, build, deploy to Static Web Apps) and one for the backend (run xUnit tests, build, publish, upload artifact).

### Component architecture

See `docs/ComponentArchitecture.md` for the Atomic Design hierarchy used by the React frontend.

### Database schema (ERD)

See `docs/ERD - Buckeye Marketplace.png` for the entity relationship diagram. The schema covers:

- **AspNetUsers / AspNetRoles / AspNetUserRoles** — ASP.NET Core Identity tables
- **RefreshTokens** — refresh token storage tied to a user
- **Products** — catalog items
- **Carts / CartItems** — one cart per user, many items per cart
- **Orders / OrderItems** — orders snapshot the cart contents at checkout

Key relationships:
- One ApplicationUser has many RefreshTokens, one Cart, and many Orders
- One Cart has many CartItems (cascade delete)
- One Order has many OrderItems (cascade delete)
- CartItem and OrderItem reference Product with `DeleteBehavior.Restrict` so products can't be deleted while in active use

### Architecture Decision Records

See `docs/ADR.md` for the recorded decisions on framework, persistence, hosting, and authentication choices.

---

## Deployment

### Frontend deployment (automatic)

Every push to `main` triggers `.github/workflows/azure-static-web-apps-agreeable-mushroom-0fcb93e0f.yml`, which:

1. Runs `npm test -- --run` in a dedicated test job
2. If tests pass, builds the React app
3. Deploys the `dist/` output to Azure Static Web Apps

Evidence: https://github.com/jaabirelmi/buckeye-marketplace/actions

### Backend deployment

Every push to `main` (touching `api/` or the workflow file) triggers `.github/workflows/deploy-backend.yml`, which:

1. Runs `dotnet test` against the unit and integration suites
2. Verifies the project publishes successfully
3. Uploads the publish artifact to GitHub Actions

Auto-deploying that artifact to Azure App Service was attempted with `azure/webapps-deploy@v3`, `@v2`, and a Kudu zip-deploy fallback, all of which failed against this Linux App Service due to a known interaction with the publish profile XML in this configuration. Service-principal authentication was blocked by the OSU Azure tenant. Backend deployment is therefore manual, using a PowerShell script that publishes, creates a Linux-compatible zip (with forward-slash path entries), and uploads via the Azure CLI.

---

## Testing

See `docs/test-plan.md` for the comprehensive test plan and results matrix.

### Run automated tests locally
Backend
cd api.Tests
dotnet test
Frontend
cd frontend
npm test -- --run
End-to-end (requires backend + frontend running)
cd frontend
npx playwright test

### Test coverage summary

| Layer | Type | Count | Status |
| --- | --- | --- | --- |
| Backend | xUnit unit | 3+ | All passing |
| Backend | xUnit integration | 1+ | All passing |
| Frontend | Vitest component | 6 | All passing |
| End-to-end | Playwright happy-path | 1 spec | Passing |

---

## Security Practices

The application implements multiple security best practices appropriate for a student-facing marketplace:

1. **Password hashing** via ASP.NET Core Identity's built-in PBKDF2 implementation — no custom crypto.
2. **Password complexity rules** enforced server-side: 8+ characters, digit, uppercase.
3. **Parameterized queries** through EF Core LINQ — no `FromSqlRaw` with string concatenation, eliminating SQL injection risk.
4. **JWT signing key stored as a secret** — `dotnet user-secrets` locally, Azure App Service application settings in production. Never in `appsettings.json` or git.
5. **Broken object-level authorization addressed**: the order history endpoint (`GET /api/orders/mine`) resolves the current user from JWT claims, not from a URL parameter.
6. **HTTPS-only** enforced at the App Service edge (`httpsOnly: true`).
7. **CORS configured allowlist-style** with the production frontend origin only — no wildcard.
8. **No `dangerouslySetInnerHTML`** used on user-controlled content in the React app.

---

## AI Tool Usage Summary

This project was developed with extensive use of AI tools across all six milestones. See `docs/ai-usage-log.md` for the full per-milestone log including specific prompts, what was accepted, and what was modified or rejected.

### Tools used

- **ChatGPT** — used heavily during early milestones (M1 through M4) for breaking down requirements, drafting persona/journey artifacts, scaffolding code, and rubric checking.
- **Claude (Anthropic)** — used as the primary collaborator for Milestones 5 and 6. Specifically used for the full Azure deployment journey, debugging Linux App Service zip deployment issues, designing the SQLite-on-/home fallback when Azure SQL was blocked, generating CI/CD workflows, and drafting all M6 documentation.
- **GitHub Copilot** — used inline during coding for autocompletion and small refactors, especially in the React component layer and EF Core migration scaffolding. Also used in agent mode (with Playwright MCP) to generate the end-to-end test in Milestone 5.

### Where AI helped most

- Mapping cryptic Azure deployment errors to concrete fixes (for example, recognizing that `rsync error: Invalid argument` against `runtimes\linux-musl-x64\...` was a Windows-vs-Linux zip path-separator problem)
- Navigating Azure for Students region/quota restrictions and choosing pragmatic fallbacks (e.g. SQLite on persistent App Service storage when SQL Database provisioning was disallowed)
- Drafting CI workflow YAML and iterating on it as deployment methods failed
- Writing comprehensive documentation in the project's voice rather than generic boilerplate

### Where I made the calls

- Choosing scope reductions (e.g. dropping custom domain, accepting manual backend deploy) versus burning more deadline time on each blocker
- Validating that AI-suggested code matched the existing project structure before pasting it in
- Manually testing every user flow on the live production site after each change
- Final architectural decisions on auth strategy, database schema relationships, and which features to ship in each milestone

---

## Submission

See `SUBMISSION.md` at the repository root for the Milestone 6 submission summary, including grader credentials, security practices, and links.

This project is tagged `v1.0` for the M6 submission.

---

## License

This project is part of OSU coursework (ACCTMIS 4630, Spring 2026). Not licensed for redistribution outside the course context.
