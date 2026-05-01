# Component Architecture (Atomic Design)

The Buckeye Marketplace frontend follows Atomic Design principles. Components are organized from smallest reusable units (atoms) up through full pages, with state managed through React Context and `useReducer`. This document describes the component hierarchy as it ships in `frontend/src/`.

---

## Atoms

The smallest reusable building blocks. These appear inline within larger components rather than as standalone files in many cases (consistent with how React's composition works in practice), but conceptually they are:

- **Button** — used for cart actions, login, register, admin CRUD, status changes
- **Input** — text inputs across login, register, checkout, and admin forms
- **Text label** — section headings, field labels, navigation links
- **Image** — product images, served from `frontend/public/images/`
- **Price tag** — formatted USD price displayed on product cards and detail pages
- **Form field** — label + input pair for shipping address and product editing

---

## Molecules

Compositions of multiple atoms that work together as a single unit.

- **AddToCartButton** (`components/AddToCartButton/AddToCartButton.tsx`) — combines a button atom, a quantity selector, and an optimistic-update handler that calls the cart API.
- **CartBadge** (`components/CartBadge/CartBadge.tsx`) — combines a cart icon and a numeric badge showing the live item count from `CartContext`. Visible in the header on every page.
- **CartItem** (`components/cart/CartItem.tsx`) — combines an image, title, price, quantity controls, and a remove button for a single line item in the cart.
- **CartSummary** (`components/cart/CartSummary.tsx`) — combines a list of subtotals and the order total for the current cart.

---

## Organisms

Larger composite sections built from molecules and atoms.

- **ProductCard** (`components/products/ProductCard.tsx`) — combines image, title, price, category, seller name, an "Add to Cart" button, and a link to the detail page. Used as the unit of the product grid.
- **ProductList** (`components/products/ProductList.tsx`) — renders a grid of ProductCard organisms. Handles empty state when no products are returned.
- **Cart** — the full cart contents on the cart page: a list of CartItem molecules plus a CartSummary molecule.
- **AdminProductTable** — the admin's manageable list of products with edit and delete affordances on each row (rendered inside `AdminDashboardPage`).
- **AdminOrderTable** — the admin's manageable list of orders with a status dropdown on each row (rendered inside `AdminDashboardPage`).
- **AuthForm** — the login and registration forms, including input atoms, validation messages, and submit buttons.

---

## Templates

Reusable page-level layouts.

- **AppShell** — the standing layout used on every authenticated page: a top navigation bar (with brand, category links, cart badge, login/logout, admin link if applicable) above the routed page content.
- **AuthLayout** — a centered, narrow layout used for the login and registration pages.

---

## Pages

Top-level route components in `frontend/src/pages/`. Each page composes templates, organisms, molecules, and atoms.

- **ProductListPage** — the catalog landing page. Loads products from the API and renders the `ProductList` organism.
- **ProductDetailPage** — single product view with an `AddToCartButton` molecule.
- **CartPage** — the cart management page. Renders `CartItem` molecules and a `CartSummary` molecule.
- **CheckoutPage** — the order placement form. Captures shipping address and triggers order creation.
- **OrderConfirmationPage** — shown after successful checkout with the order's confirmation number.
- **OrderHistoryPage** — the user's own orders, scoped via JWT (not URL parameters).
- **LoginPage** — login form and redirect to home on success.
- **RegisterPage** — registration form with password complexity feedback.
- **AdminDashboardPage** — admin-only page combining product CRUD and order status management.

---

## Cross-cutting state

State that doesn't fit cleanly into the component tree is managed via Context providers wrapping the app:

- **AuthContext** (`contexts/AuthContext.tsx`) — current user, JWT token, refresh token, login/logout/register methods. Persists the JWT to `localStorage` so refreshes don't log the user out.
- **CartContext** (`contexts/CartContext.tsx`) — cart contents, item count, totals, and methods to add/update/remove/clear items. Backed by the `cartReducer` (`reducers/cartReducer.ts`) and synchronized with the backend via `services/cartApi.ts`.

Routes are guarded with two route components:

- **ProtectedRoute** (`components/auth/ProtectedRoute.tsx`) — redirects unauthenticated users to login.
- **AdminRoute** (`components/auth/AdminRoute.tsx`) — redirects non-admin authenticated users back to the home page.

---

## Service layer

API calls live in their own modules under `frontend/src/services/`, not inside components. Each module reads `import.meta.env.VITE_API_BASE_URL` so it works against `localhost:5206` in development and the deployed Azure backend in production.

- `authApi.ts` — login, register, refresh
- `cartApi.ts` — get / add / update / remove / clear
- `orderApi.ts` — create order, get my orders
- `adminApi.ts` — product CRUD, all orders, order status updates

This keeps components free of fetch logic and makes it trivial to mock API calls in component tests.