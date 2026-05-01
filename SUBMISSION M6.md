# Buckeye Marketplace — Milestone 6 Submission

**Author:** Jaabir Elmi  
**Course:** ACCTMIS 4630 — Business Systems Application Development  
**Instructor:** Chad Thomas  
**Semester:** Spring 2026  
**Submitted:** May 1, 2026  
**Tag:** v1.0

---

## Quick Links

| Item | Link |
| --- | --- |
| GitHub repository | https://github.com/jaabirelmi/buckeye-marketplace |
| Live frontend | https://agreeable-mushroom-0fcb93e0f.7.azurestaticapps.net |
| Live backend API | https://buckeye-api-jaabir.azurewebsites.net |
| GitHub Actions runs | https://github.com/jaabirelmi/buckeye-marketplace/actions |
| Comprehensive README | [README.md](./README.md) |
| Test plan & results | [docs/test-plan.md](./docs/test-plan.md) |
| AI usage log | [docs/ai-usage-log.md](./docs/ai-usage-log.md) |
| Architecture decisions | [docs/ADR.md](./docs/ADR.md) |

---

## Test Credentials for Grader

These accounts are seeded automatically on first startup of either the local or production environment.

| Role | Email | Password |
| --- | --- | --- |
| Regular user | user@buckeyemarketplace.com | User1234 |
| Admin | admin@buckeyemarketplace.com | Admin123 |

The admin account unlocks the `/admin` dashboard for product and order management.

---

## Deliverable Checklist

| # | Deliverable | Status | Evidence |
| --- | --- | --- | --- |
| 1 | Production Deployment | Done | Live URLs above; HTTPS enforced; environment variables in App Service settings |
| 2 | CI/CD Pipeline | Done | Two workflows in `.github/workflows/` running on every push to main |
| 3 | Testing & QA | Done | [docs/test-plan.md](./docs/test-plan.md) + automated test evidence files |
| 4 | Technical Documentation | Done | This README + ADR + ComponentArchitecture + ERD/architecture PNGs |
| 5 | User Documentation | Done | [docs/user-guide.md](./docs/user-guide.md) and [docs/admin-guide.md](./docs/admin-guide.md) |
| 6 | AI Reflection | Done | [docs/ai-reflection.md](./docs/ai-reflection.md) |

---

## Security Practices Applied

The application implements the following security best practices, several of which directly satisfy the W13 OWASP coverage requirement carried over from Milestone 5:

1. **Password hashing via ASP.NET Core Identity** (PBKDF2). No custom crypto.
2. **Server-side password complexity rules**: minimum 8 characters, requires a digit, requires uppercase.
3. **Parameterized queries through EF Core LINQ** — no `FromSqlRaw` with string interpolation. SQL injection is structurally impossible in this codebase.
4. **JWT signing key stored as a secret** — `dotnet user-secrets` locally, Azure App Service application settings in production. Never in `appsettings.json`, never committed to git. Verified with `git grep -i "Jwt:Key\|password\|secret"`.
5. **Broken object-level authorization addressed**: the `GET /api/orders/mine` endpoint resolves the current user from JWT claims via `User.FindFirst(...)`, never from a URL parameter. A user cannot retrieve another user's orders by guessing IDs.
6. **HTTPS enforced** on the App Service edge (`httpsOnly: true`). Only the development environment redirects HTTP to HTTPS in middleware; in production, Azure terminates TLS at the load balancer.
7. **CORS allowlist-style** with the production frontend origin only. No wildcard origins.
8. **No `dangerouslySetInnerHTML`** on user-controlled content in the React frontend. XSS via product titles, descriptions, or seller names is structurally prevented.

---

## Known Limitations and Honest Disclosures

- **Database is SQLite, not Azure SQL Database.** The Azure for Students subscription assigned to this project blocked SQL Database provisioning in every region. The code remains provider-agnostic (it can run against SQL Server with a configuration change). See `docs/ADR.md` Decision 3 for details and `README.md` for the production data path.
- **Backend deployment is manual, not automatic.** The backend CI workflow runs build and tests on every push and uploads a publish artifact. Deployment to Azure App Service is performed by running a documented PowerShell script. Three different auto-deploy approaches (`azure/webapps-deploy@v3`, `@v2`, Kudu zip-deploy) failed with `Failed to get app runtime OS` against this Linux App Service; service-principal authentication was blocked by the OSU Azure tenant. The frontend remains fully auto-deployed.
- **No custom domain.** The bonus custom-domain item was not pursued. The application is served at the Azure-provided default domains.

---