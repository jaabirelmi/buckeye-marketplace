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