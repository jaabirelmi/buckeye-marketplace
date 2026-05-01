# Architecture Decision Records

This document records the major technical decisions made during the Buckeye Marketplace project, why they were made, and what alternatives were considered. Each decision is grounded in the user needs identified during Milestone 1 (Design Thinking) and the rubric requirements across Milestones 2 through 6.

---

## ADR 1: Frontend framework — React with TypeScript and Vite

**Decision:** Use React 19 with TypeScript and Vite.

**Context:** The frontend needs to render a product catalog, manage cart state across pages, and integrate with a JWT-authenticated backend. The course curriculum centers on React, so the team has working knowledge of it.

**Reasoning:**
- React's component model maps cleanly to the Atomic Design hierarchy required in Milestone 2.
- TypeScript adds type safety to API contracts (`Product`, `CartResponse`, `OrderResponse`) and catches integration bugs at compile time rather than runtime.
- Vite provides fast HMR during development and an optimized production build, with first-class support for environment-based configuration via `import.meta.env`.

**Alternatives considered:**
- Plain JavaScript React: rejected — TypeScript's type checking caught several real bugs during development (e.g. mismatched response shapes between cart and order APIs).
- Next.js: rejected — server-side rendering is not needed for an authenticated marketplace, and the additional complexity is not justified for the scope.

---

## ADR 2: Backend framework — .NET 10 / ASP.NET Core Web API

**Decision:** Use ASP.NET Core 10 Web API with Entity Framework Core for the backend.

**Context:** The course curriculum centers on .NET, and the rubric explicitly requires a .NET API.

**Reasoning:**
- Strong, well-documented ecosystem for REST APIs, JWT auth, EF Core, and testing.
- ASP.NET Core Identity provides production-grade password hashing and user management out of the box, removing any temptation to "roll our own" auth.
- xUnit + `WebApplicationFactory<Program>` allows realistic integration testing against an in-memory database without spinning up Docker or a real SQL Server during CI.

**Alternatives considered:**
- Node.js with Express: rejected — would not have leveraged the course material, and would have required hand-rolling identity, password hashing, and migrations that ASP.NET Core Identity gives for free.

---

## ADR 3: Database — SQLite (development and production)

**Decision:** Use SQLite via EF Core for both local development and production.

**Context:** The Milestone 6 rubric specifies Azure SQL Database for the production instance. The Azure for Students subscription assigned to this project blocked SQL Database provisioning in every region available to it, returning `RequestDisallowedByAzure` policy errors.

**Reasoning:**
- The application code is provider-agnostic: `Program.cs` inspects the connection string and selects either `UseSqlite()` or `UseSqlServer()` at runtime. Both EF Core providers are referenced in `api.csproj`.
- SQLite running on Azure App Service's persistent `/home/data/` volume provides durable storage across container restarts and deployments.
- Switching to Azure SQL in the future requires only a configuration change (App Service connection string), not code changes.

**Alternatives considered:**
- Continue trying to provision Azure SQL in different regions: rejected after multiple attempts in `eastus`, `eastus2`, `centralus`, `southcentralus`, and `northeurope` all returned policy errors. The deadline did not allow further region hunting.
- Use Cosmos DB free tier: rejected — would have required rewriting all EF Core data access against a different paradigm (document database), which is well beyond a configuration change.
- Persist to a file in `/tmp`: rejected — `/tmp` is not durable across container restarts.

This decision is documented in the README and accepted as a deviation from the rubric's stated database choice.

---

## ADR 4: Authentication — JWT bearer tokens with refresh tokens

**Decision:** Use JWT bearer tokens for API authentication, signed with a symmetric HS256 key. Issue a short-lived access token plus a long-lived refresh token on login.

**Context:** The API is consumed by a SPA that needs stateless auth. The Milestone 5 rubric requires JWT auth, password hashing via Identity, and proper handling of broken object-level authorization.

**Reasoning:**
- JWT works cleanly with the SPA's `Authorization: Bearer <token>` header pattern and avoids server-side session state.
- Refresh tokens enable longer-lived sessions without making the access token long-lived (which would be a security problem).
- Roles are encoded as claims so the `[Authorize(Roles = "Admin")]` attribute and frontend `AdminRoute` guard share the same source of truth.
- The signing key is stored in `dotnet user-secrets` locally and as an Azure App Service application setting in production. It is never written to `appsettings.json` and never committed to git.

**Alternatives considered:**
- Cookie-based auth: rejected — adds CSRF complexity that isn't justified for a SPA, and complicates the cross-origin Static Web Apps -> App Service setup.

---

## ADR 5: Hosting — Azure App Service (backend) + Azure Static Web Apps (frontend)

**Decision:** Deploy the backend as a Linux App Service (B1 tier) and the frontend as an Azure Static Web App.

**Context:** Milestone 6 requires production deployment to Azure with HTTPS and proper environment configuration.

**Reasoning:**
- Azure Static Web Apps provides a globally distributed CDN for the React build, free TLS, and a built-in GitHub Actions workflow generated automatically when the resource is created. This single-step gives us both Deliverable 1 (deployment) and the foundation for Deliverable 2 (CI/CD).
- App Service Linux supports .NET 10 natively and exposes a writable, durable `/home/` mount that survives restarts and slot swaps — critical for SQLite persistence given ADR 3.
- B1 tier is required because the F1 Free tier enforces a 60-minute daily CPU quota that was hit during the deployment debugging phase.

**Alternatives considered:**
- Azure Container Apps: rejected — would require building and pushing a container image, adding deployment complexity beyond what the rubric asks for.
- Single App Service hosting both static and API: rejected — Static Web Apps is purpose-built for this and is free.

---

## ADR 6: CI/CD — GitHub Actions, dual workflow

**Decision:** Maintain two GitHub Actions workflows. The frontend workflow runs Vitest then deploys automatically to Static Web Apps. The backend workflow runs the xUnit tests and verifies a clean publish on every push, with deployment performed manually using a published, repeatable PowerShell script.

**Context:** The rubric calls for an automated pipeline. Deploying the backend automatically via `azure/webapps-deploy@v2`, `@v3`, and Kudu zip-deploy all failed against this specific Linux App Service due to a publish-profile/runtime-OS detection issue. Service-principal authentication (the alternative path) was blocked by the OSU Azure tenant policy.

**Reasoning:**
- Tests-on-push for both frontend and backend still gates merges to main on green tests, which is the practical value of CI.
- Frontend deployment is fully automatic — every push to `main` ends with the new build live on Static Web Apps.
- Backend deployment uses a fully scripted, deterministic process documented in the README. The script is what would have run in CI; running it manually is a workaround for the platform issue, not a process gap.

This is a pragmatic compromise driven by environmental blockers, not a design preference.

---

## AI Tool Usage in Decision Making

AI tools (ChatGPT, Claude, GitHub Copilot) were used throughout decision making for this project. AI assisted in:

- Comparing tradeoffs between hosting options when Azure SQL provisioning failed
- Drafting and iterating on CI/CD workflow YAML as different deployment paths failed
- Identifying the root cause of cryptic deployment errors (e.g. recognizing Windows-vs-Linux path separator issues in zip extraction)
- Validating that decisions matched both the rubric and the realistic constraints of the Azure for Students subscription

Final decisions were always validated by the author against the actual project state, the rubric, and the deadline. AI suggestions that did not fit the constraints (e.g. service-principal-based deployment after the tenant blocked it) were rejected.