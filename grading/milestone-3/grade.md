# Lab Evaluation Report

**Student Repository**: `jaabirelmi/buckeye-marketplace`  
**Date**: March 22, 2026  
**Rubric**: rubric.md (Milestone 3 — 25 Points)

## 1. Build & Run Status

| Component           | Build | Runs | Notes                                                                                  |
| ------------------- | ----- | ---- | -------------------------------------------------------------------------------------- |
| Backend (.NET)      | ✅     | ✅    | `dotnet build` succeeded. Server runs on `http://localhost:5206`.                       |
| Frontend (React/TS) | ✅     | ✅    | `tsc -b && vite build` succeeded. Dev server starts cleanly on `http://localhost:5173`. |
| API Endpoints       | —     | ✅    | All endpoints tested and responding correctly (see below).                              |

**API Endpoint Test Results:**

| Endpoint                    | HTTP Status | Result                                                          |
| --------------------------- | ----------- | --------------------------------------------------------------- |
| GET /api/products           | 200         | Returns JSON array of 8 products with correct shape             |
| GET /api/products/1         | 200         | Returns single product ("CSE 3241 Textbook") with correct shape |
| GET /api/products/999       | 404         | Returns 404 for non-existent product                            |

### Project Structure Comparison

The rubric specifies this layout standard:

```text
/backend
/frontend
/docs
```

| Expected   | Found      | Status |
| ---------- | ---------- | ------ |
| `/backend` | `/api`     | ❌      |
| `/frontend`| `/frontend`| ✅      |
| `/docs`    | `/docs`    | ✅      |

**Note**: The backend directory is named `api/` instead of the expected `backend/`. This is a structural deviation from the solution layout standard but does not affect functionality. No points are deducted for this as the rubric does not assign points to directory naming.

## 2. Rubric Scorecard

| #   | Requirement                          | Points | Status  | Evidence                                                                                                                                                                                                                        |
| --- | ------------------------------------ | ------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | React Product List Page              | 5      | ✅ Met   | `ProductListPage.tsx` — fetches products, handles loading state (L7, L42), error state (L8, L44), and empty state via `ProductList.tsx` L9–11. Component hierarchy: Page → ProductList → ProductCard follows atomic design.       |
| 2   | React Product Detail Page            | 5      | ✅ Met   | `ProductDetailPage.tsx` — separate route at `/products/:id` (`App.tsx` L10). Displays all fields (title, description, price, category, seller, date, image). Back-to-list navigation via `<Link to="/">` (L46). Loading/error states handled. |
| 3   | API Endpoint: GET /api/products      | 5      | ✅ Met   | `ProductsController.cs` L105–108 — returns `Ok(Products)` (200 with JSON array). In-memory `List<Product>` data store (L10–103). Verified: returns 8 products with correct JSON shape.                                          |
| 4   | API Endpoint: GET /api/products/{id} | 5      | ✅ Met   | `ProductsController.cs` L110–121 — looks up product by ID, returns `NotFound()` (404) for unknown IDs, `Ok(product)` (200) for valid IDs. Verified: ID 1 → 200, ID 999 → 404.                                                  |
| 5   | Frontend-to-API Integration          | 5      | ✅ Met   | `ProductListPage.tsx` L17 — `fetch("http://localhost:5206/api/products")`. `ProductDetailPage.tsx` L19 — `fetch(…/api/products/${id})`. No hardcoded data in components. Error states handled in both pages.                      |

**Total: 25 / 25**

## 3. Detailed Findings

All rubric items are met. No deficiencies to report.

## 4. Action Plan

No corrective actions required — full marks earned.

## 5. Code Quality Coaching (Non-Scoring)

- **Hardcoded API base URL**: `ProductListPage.tsx` and `ProductDetailPage.tsx` both hardcode `http://localhost:5206`. Consider extracting this to an environment variable (e.g., `VITE_API_URL`) in a `.env` file so the URL can be configured per environment without code changes.

- **CORS origin mismatch risk**: `Program.cs` configures CORS to allow `http://localhost:5173`, but the frontend fetches from `http://localhost:5206`. This works because the CORS policy allows the frontend origin, but if either port changes, requests will break silently. Centralizing port configuration would reduce fragility.

- **No CSS modules or styled components**: All styling uses inline `style` objects. For maintainability and reuse, consider adopting CSS modules, a CSS-in-JS library, or a utility framework like Tailwind CSS.

- **Decimal precision in API**: The `Price` property in `Product.cs` is `decimal`, but some seed values are whole numbers (e.g., `35` instead of `35.00`). While JSON serialization handles this correctly, being explicit helps readability.

- **Missing `key` prop best practice**: `ProductList.tsx` uses `product.id` as the key, which is correct — good practice.

## 6. Git Practices Coaching (Non-Scoring)

- **Large single commits**: The bulk of Milestone 3 work was delivered in a single commit (`f506026 — Milestone 3 Buckeye Marketplace`). Professional workflows benefit from smaller, incremental commits (e.g., "Add Product model", "Add ProductsController", "Add ProductListPage") that make code review and debugging easier.

- **Merge commit**: Commit `0a371d7 — Merge existing repo with Milestone 3 updates` suggests the work was done separately and merged in. Developing on feature branches with incremental commits and then merging via pull request is a better practice.

- **Commit messages are descriptive**: The messages are clear about what each commit does, which is good. Consider adding more detail in commit bodies for larger changes.

---

**25/25** — All rubric requirements are fully met. The backend API returns correct data with proper status codes, the frontend renders product list and detail pages with loading/error states, and the two are integrated via live API calls. The coaching notes above (hardcoded URLs, inline styles, commit granularity) are suggestions for professional growth, not scoring deductions.
