# AI Tool Usage

## Overview
AI was used throughout the Buckeye Marketplace project as a coding assistant and project guide. It helped me break down milestone requirements, understand errors, plan the project structure, refine code, and test against the rubric. I relied heavily on AI input throughout Milestone 4, but I was responsible for applying the code changes, reviewing the results, testing the application, and making sure the final implementation matched the assignment requirements.

## Milestone 3 AI Usage

### Example Prompts Used
- can you walk me through how to make the ProductsController and Product model
- how do i make GET /api/products and GET /api/products/{id} work
- im getting errors in Program.cs with swagger can you help me fix it
- can you help me make sure my backend matches what the teacher wants in the slides
- im getting a white screen again can you help me figure out what is wrong
- what does loading state and empty state mean for this project
- can you help me make the product list page pull data from the api instead of hardcoded data
- how do i make the product detail page and route to /products/:id
- can you help me make clicking a product card open the detail page
- why are my image URLs not working and why is the image broken
- can you help me update the backend so the imageUrl uses /images/filename instead of the old links
- would it be easier if i just downloaded my own images and put them in the project
- how do i make the frontend use images from a public folder
- do i change the image path in the backend or frontend
- can you help me match each image filename to the right product
- can you look at my rubric and tell me if im actually meeting every requirement

### What I Rejected or Changed
- In the `ProductsController`, some generated names and product details did not match my personas, so I personally corrected them to better fit each persona and the products they would realistically sell.
- I rejected some AI image suggestions because they were random and did not match the actual products in my marketplace.
- I reviewed and adjusted API/frontend details instead of blindly accepting all generated suggestions.

## Milestone 4 AI Usage

### How AI Helped
For Milestone 4, AI was used heavily as a project guide and coding assistant. It helped me:
- break the milestone into smaller parts
- understand the rubric and baseline requirements
- plan the shopping cart feature step by step
- debug frontend and backend errors
- build Entity Framework models and database persistence
- connect the React cart to the .NET API
- test cart behavior against the rubric
- clean up the repo and identify leftover lab files

### Example Prompts Used
- can you help me clean up my milestone 3 project so it builds correctly for milestone 4
- can you look at the milestone 4 rubric and make sure each part of my project matches it
- can you help me build the shopping cart frontend step by step
- can you help me create the cart reducer and context
- can you help me add add-to-cart from both the product list and the product detail page
- can you help me make the cart count show in the header
- can you help me build the cart API endpoints in .NET
- can you help me set up Entity Framework Core with SQLite
- can you help me create Cart and CartItem models with relationships to Product
- can you help me run migrations and confirm persistence works
- can you help me connect the frontend cart to the backend API
- can you help me make the cart persist after refresh
- can you help me add loading states, success feedback, and error handling
- can you help me test each rubric item one by one
- can you help me identify leftover files from the lab that should not be submitted
- can you help me fix my `.gitignore` so build artifacts are not committed
- can you help me review the teacher’s milestone 3 PR and make sure I am not missing any baseline requirements

### What I Rejected or Changed
- I did not blindly accept all generated code. I reviewed it, pasted it into my project, tested it, and adjusted it when needed.
- I kept the backend and frontend behavior aligned with my actual project structure instead of accepting suggestions that did not fit.
- I made sure the final shopping cart flow matched the rubric, including add, update, remove, clear, persistence, and frontend-backend synchronization.
- I removed outdated or leftover lab-related files that were not part of the Milestone 4 requirements.

## Testing and Verification
After using AI suggestions, I tested the project manually in both the frontend app and Swagger. This included:
- loading the product catalog from the API
- viewing product details
- adding items to the cart from the list page and detail page
- updating quantity
- removing items
- clearing the cart
- verifying persistence after refresh
- verifying synchronization between frontend and backend
- verifying status codes in Swagger
- testing error handling when the backend was unavailable
- checking the project against the milestone rubric before submission

## Milestone 5 AI Usage

### How AI Helped
For Milestone 5, AI was used heavily as a project guide, debugging assistant, and testing helper. It helped me:
- break the milestone into smaller parts
- understand the rubric and protected endpoint requirements
- set up authentication and role-based authorization
- connect frontend authentication to the backend
- build checkout, confirmation, order history, and admin flows
- debug backend and frontend test setup issues
- generate and refine backend unit tests, frontend tests, and a Playwright E2E flow
- review the project against the milestone rubric before submission

### Example Prompts Used
- can you help me set up ASP.NET Core Identity and JWT auth without hardcoding secrets
- can you help me protect the cart and order endpoints with authorize attributes
- can you help me build login and register pages and connect them to the backend
- can you help me make protected routes work in the frontend
- can you help me create orders from the cart and clear the cart after checkout
- can you help me build order history and order confirmation pages
- can you help me build admin product CRUD and order status updates
- can you help me add backend unit tests and one integration test
- can you help me set up Vitest and React Testing Library for frontend tests
- can you help me fix the frontend testing config when Vitest and Playwright conflict
- can you help me use Copilot agent mode and Playwright MCP for the E2E happy path
- can you help me document the testing evidence, AI usage, and security practices for submission

### What I Rejected or Changed
- I did not blindly accept all generated code. I reviewed it, pasted it into my project, tested it, and adjusted it when needed.
- I rejected some test setup suggestions that would have hardcoded behavior or weakened the assignment requirements.
- I corrected AI-generated selectors and testing setup when they did not match my actual frontend structure.
- I kept the implementation aligned with my real project files, routes, and UI instead of accepting suggestions that did not fit my app.

## Testing and Verification
After using AI suggestions, I tested the project manually and automatically. This included:
- registering and logging in users
- verifying admin login and role-restricted behavior
- testing protected endpoints in Swagger
- testing cart access and order history with authenticated users
- verifying checkout, confirmation, and order history in the frontend
- running `dotnet test`
- running `npm test -- --run`
- running `npx playwright test`
- checking the final project against the milestone rubric before submission

## Milestone 6 AI Usage

### How AI Helped

For Milestone 6, AI was used as the primary deployment partner, debugger, and documentation drafter. The deployment phase was by far the highest-risk part of the entire project, and AI assistance was crucial in:

- Walking through Azure resource creation step-by-step (resource group, App Service plan, App Service, Static Web App)
- Diagnosing cryptic Azure errors and translating them into concrete fixes
- Designing pragmatic fallbacks when Azure for Students subscription policies blocked the rubric's stated approach (Azure SQL Database, F1 free tier quotas, etc.)
- Drafting and iterating on GitHub Actions CI/CD workflows
- Writing comprehensive technical documentation in a single sitting that would otherwise have taken much longer

### Example Prompts Used

- can you help me plan out how to deploy this whole thing to Azure step by step
- I'm getting RegionDoesNotAllowProvisioning when creating a SQL server, what regions should I try
- the Azure CLI says my subscription has policy restrictions, what does that mean and what are my options
- how do I deploy a .NET 10 zip to Azure App Service when webapps-deploy keeps failing with "Failed to get app runtime OS"
- the deployment log says "Invalid argument: /home/site/wwwroot/runtimes\linux-musl-x64\..." what does this mean
- can you help me make the SQLite path persistent on Azure App Service so it survives restarts
- can you help me write a GitHub Actions workflow that runs my dotnet tests and deploys to App Service
- can you help me update the frontend to use an environment variable for the API URL instead of hardcoding localhost
- the admin dashboard says "Could not load admin dashboard data" on production but works locally, what's wrong
- can you write a comprehensive README that hits every requirement on the M6 rubric
- can you draft an AI reflection document that's specific to my actual project rather than generic
- I lost my terminal/PC restarted, did I lose any work
- when do I commit so I have a save state to revert to if something breaks

### Key AI-Assisted Debugging Wins

1. **Linux zip deployment failure.** The deployment log showed `rsync error: Invalid argument '/home/site/wwwroot/runtimes\linux-musl-x64\native\libe_sqlite3.so'`. AI immediately recognized this as a Windows-vs-Linux path separator issue caused by PowerShell's `Compress-Archive` writing zip entries with backslashes. The fix — using `[System.IO.Compression.ZipFile]` directly and explicitly normalizing entry paths to forward slashes — was a five-line change that unblocked deployment after multiple failed attempts.

2. **Azure SQL provisioning policy block.** When `az sql server create` failed with `RequestDisallowedByAzure` across multiple regions, AI suggested checking the Azure portal's region dropdown directly (which only shows regions the subscription is allowed to use) and, when that confirmed a hard policy block, immediately pivoted to a SQLite-on-`/home/data/` plan rather than burning more time on regions.

3. **Production-only admin dashboard bug.** After deploying, the admin dashboard failed to load data on production but worked locally. The browser console showed `localhost:5206` connection refused — instantly identifiable as a hardcoded URL that was missed during the env-var refactor. AI located the two `fetch()` calls in `AdminDashboardPage.tsx`, replaced them with the `VITE_API_BASE_URL`-based URL, and the issue was fixed and deployed in under five minutes.

4. **F1 quota block + B1 upgrade.** When the App Service silently entered a "QuotaExceeded" state after several failed deployment attempts blew through the F1 tier's 60-minute daily CPU quota, AI explained what was happening, that B1 cost cents-per-hour against the student credit (no actual money), and walked through the upgrade in a single command.

### What I Rejected or Changed

- AI initially suggested a "two providers, one EF migration set" approach for SQL Server vs. SQLite. After watching that strategy generate model snapshot conflicts that broke local development, I worked with AI to revert it and use a simpler approach: SQLite migrations only, with the SQL Server provider available in code but not used.
- AI suggested service-principal authentication for the GitHub Actions backend deploy. After the OSU Azure tenant rejected `az ad sp create-for-rbac` with "Insufficient privileges to complete the operation," I made the call to drop auto-deploy on the backend and document the manual deploy script instead. AI agreed and drafted that documentation rather than spending more time looking for workarounds.
- I rejected several iterations of the deployment workflow that were technically valid but would have required additional Azure infrastructure (Azure Container Registry, etc.) — the rubric points didn't justify the complexity.

### What I Did Without AI

- Made every "stop chasing this and pivot" decision based on time remaining vs. rubric impact
- Manually tested every user flow on the live production site after every fix and confirmed functional correctness end-to-end
- Caught and fixed bugs AI didn't surface (e.g. when CORS needed updating to the real Static Web App URL after the placeholder)
- Made the call to upgrade to B1 specifically (vs. continuing to fight F1 quotas)
- Final review of every documentation file before committing — including this one

### Testing and Verification

After each change in M6, the following were checked:

- The live frontend loads at the production Static Web Apps URL
- The live backend serves products at `/api/products` over HTTPS
- Authentication works end-to-end on the deployed environment (register, login, JWT in subsequent requests)
- Cart, checkout, and order history work on the deployed environment as a regular user
- Admin product CRUD and order status updates work on the deployed environment as the admin user
- `dotnet test` and `npm test -- --run` continue to pass on the latest code (`docs/test-evidence-backend.txt`, `docs/test-evidence-frontend.txt`)
- Both GitHub Actions workflows run green on push to `main`

### Reflection on AI-Assisted Development

The biggest lesson from M6 was that AI is most valuable not as a code generator but as a debugging partner who has read every Stack Overflow thread on Azure errors. The Azure deployment phase had at least six different cryptic failure modes, and the time-to-fix on each was dramatically lower with AI than it would have been alone. The flip side is that AI is willing to keep trying, sometimes past the point where the human should have stopped and pivoted; the human's job in this collaboration was to call those pivots and protect the deadline.