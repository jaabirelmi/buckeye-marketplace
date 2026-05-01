# AI Tool Reflection — Buckeye Marketplace

**Author:** Jaabir Elmi  
**Course:** ACCTMIS 4630 — Business Systems Application Development  
**Milestone:** 6 (Final)  
**Date:** May 1, 2026

---

## Overview

This project was built end-to-end with AI assistance from the requirements phase through production deployment. Three AI tools were used at different points in the project lifecycle: ChatGPT, Claude, and GitHub Copilot. Each filled a different role, and each had clear strengths and equally clear failure modes. This document is an honest reflection on how those tools were used, what genuinely worked, and where I had to override or ignore their suggestions.

The honest summary: AI made me significantly faster on this project, but it did not make decisions for me. The most valuable use of AI was as a debugging partner during the brutal Azure deployment phase of Milestone 6, where it cut hours of frustration down to minutes by recognizing error patterns I would not have spotted on my own. The least valuable use was when I tried to let AI architect things instead of asking it to react to my decisions — every time I did that, the result needed to be partially undone.

---

## How I Used GitHub Copilot

GitHub Copilot ran inline in VS Code throughout the project. It was the smallest of the three tools by usage volume, but it was always-on and shaped the rhythm of writing code more than the bigger conversational tools did.

Where it pulled real weight:

- **Boilerplate component generation in React.** Once I had `ProductCard.tsx` written, Copilot would autocomplete most of `ProductList.tsx` correctly because it saw the patterns in the surrounding files. Same for the cart components and the admin tables.
- **EF Core migration scaffolding.** When I added new properties to entities, Copilot frequently suggested the right `protected override void Up(MigrationBuilder migrationBuilder)` body before I had to think about it.
- **Playwright E2E spec in Milestone 5.** Copilot agent mode (with Playwright MCP integration) generated the bulk of `e2e/checkout.spec.ts` from a single prompt describing the happy path. I had to fix some selectors that did not match my actual UI, but the structure of the test was solid.
- **Repetitive TypeScript types.** Once `Product` was defined, Copilot inferred the related cart and order types correctly almost every time.

Where it actively hurt:

- **Authentication code.** Copilot's first instinct on auth was always to write something simpler than ASP.NET Core Identity — sometimes a hand-rolled password hasher, sometimes JWT validation that skipped the lifetime check. Every one of those had to be rejected. The rubric required Identity, and the suggestions were genuinely insecure.
- **Hardcoding URLs.** Copilot had a strong tendency to write `fetch("http://localhost:5206/api/...")` even after I had refactored the rest of the codebase to use `import.meta.env.VITE_API_BASE_URL`. This bit me in production: the admin dashboard had two leftover hardcoded URLs that broke the deployed app and only surfaced when I tested the live site. That bug is documented as Bug #1 in the test plan.

Net assessment: Copilot is a real productivity multiplier for repetitive code but actively dangerous when stakes are higher (security, deployment configuration). I learned to disable it mentally for those areas and accept it for component-level work.

---

## How I Used Claude Across the SDLC

Claude was the primary collaborator for Milestones 5 and 6, where most of the conceptual difficulty of the project lived. Across SDLC phases:

**Discovery / Requirements (M1):** Light usage. Claude helped sharpen the wording of personas and journey maps but the underlying ideas were mine and my classmates'.

**Design (M2):** Used Claude to pressure-test architectural decisions. Specifically, when I was deciding between AWS and Azure, I described my actual constraints (student credit, course requirements, time available) and Claude pushed back on hand-wavy reasoning until I had concrete justifications for the choice.

**Implementation (M3, M4, M5):** Used Claude to break down each milestone's rubric into a sequence of concrete sub-tasks, then to debug whatever broke along the way. Particularly heavy use during M5 for ASP.NET Core Identity setup, JWT configuration, and the broken-object-level-authorization fix on `GET /api/orders/mine`.

**Testing (M5):** Used Claude to generate the structure of the xUnit unit tests and one integration test using `WebApplicationFactory<Program>`. The integration test required several iterations because Claude initially gave me a setup that conflicted with my Identity migrations; I described the conflict, and we landed on the in-memory database provider approach that ended up working cleanly.

**Deployment / Documentation (M6):** This is where Claude carried the most weight. The Azure deployment phase had at least seven distinct failure modes, each with its own cryptic error, and Claude recognized most of them quickly. The full Milestone 6 documentation set in `docs/` (test plan, user guide, admin guide, ADR rewrite, this file) was drafted with Claude and refined by me.

---

## Specific Examples — Prompts and Outcomes

These are real exchanges from the project. Each one made the difference between getting unstuck quickly and burning hours.

### Example 1 — Recognizing a Linux/Windows zip path bug

**Context:** After deploying my .NET API zip to Azure App Service for the third time, the build kept failing with `rsync error: Invalid argument '/home/site/wwwroot/runtimes\linux-musl-x64\native\libe_sqlite3.so'`.

**Prompt I used:** "I'm deploying a .NET 10 zip to Linux App Service. Build keeps failing with rsync errors about runtimes\linux-musl-x64. What does this mean?"

**Claude's response:** Identified within seconds that the backslashes inside what should be folder paths were the problem — PowerShell's `Compress-Archive` was writing zip entries with Windows path separators, and Linux's unzip was treating them as literal characters in filenames instead of folder separators.

**Outcome:** Replaced `Compress-Archive` with a `[System.IO.Compression.ZipFile]::Open(...)` loop that explicitly normalized every entry path with `.Replace('\', '/')`. The very next deployment succeeded. This was probably a 2-3 hour fix on my own; with Claude it was about 5 minutes.

### Example 2 — Pivoting away from Azure SQL when the subscription blocked it

**Context:** `az sql server create` kept failing with `RegionDoesNotAllowProvisioning` and then `RequestDisallowedByAzure` across `eastus`, `eastus2`, `centralus`, `southcentralus`, and `northeurope`.

**Prompt I used:** "What does RequestDisallowedByAzure mean and what are my realistic options if my subscription is locked out of SQL Database?"

**Claude's response:** Explained that Azure for Students has aggressive policy locks on SQL Database in many regions, and listed three concrete fallbacks ranked by effort and rubric impact: keep trying regions (low value), pivot to SQLite on App Service persistent storage (moderate effort, small rubric cost), or rewrite for Cosmos DB (high effort, not justified). It also recommended the SQLite fallback explicitly given my deadline.

**Outcome:** Made the call to go SQLite with a documented disclosure in the README and ADR. The application code already supported provider switching from earlier work, so the fallback required only a small change to the connection string handling and a path adjustment for App Service's persistent volume.

### Example 3 — Debugging the production-only admin dashboard bug

**Context:** All user flows worked on the deployed site, but logging in as admin showed "Could not load admin dashboard data."

**Prompt I used:** "Admin dashboard shows that error on production but works locally. Console shows ERR_CONNECTION_REFUSED for localhost:5206/api/products."

**Claude's response:** Immediately identified that `AdminDashboardPage.tsx` had two hardcoded `localhost:5206` URLs that were missed during the env-var refactor, asked to see the file, and returned the corrected version using `VITE_API_BASE_URL`.

**Outcome:** Five-minute fix. Pushed, auto-deployed by GitHub Actions, verified live. This is a great case study in how the production environment is the only real test of an env-var refactor.

### Example 4 — Backend auto-deploy escalation and pivot

**Context:** Three different GitHub Actions deployment strategies for the backend (`azure/webapps-deploy@v3`, `@v2`, Kudu zip-deploy) all failed with `Failed to get app runtime OS`. I tried to switch to service-principal auth and got `Insufficient privileges to complete the operation` from the OSU tenant.

**Prompt I used (paraphrased):** "How much more time should I spend on this versus pivoting to manual backend deploy and documenting it?"

**Claude's response:** Recommended pivoting immediately. Specifically pointed out that the rubric awards full credit for "automated pipeline working perfectly" but the frontend pipeline already qualified on its own, and a backend that runs build+tests on every push and is deployed via a documented script would still earn high marks. Also reminded me that I had limited deadline time.

**Outcome:** Stopped fighting it, redesigned the backend workflow to do build+test+publish without deploy, and documented the manual deploy script in the README. This decision probably saved 2+ hours and allowed me to actually finish documentation that night.

---

## What Worked Well

**Pattern recognition on cryptic errors.** This was the single highest-value thing AI did for me. Reading Azure deployment logs is a specialized skill, and Claude clearly has read enough of them to map error strings to causes immediately. I would not have figured out the Windows-vs-Linux zip path issue on my own in any reasonable time frame.

**Iterative documentation drafting.** AI is genuinely good at writing comprehensive markdown that doesn't sound generic, as long as you feed it actual project specifics. The README, ADR, user guide, admin guide, and this file were all drafted with Claude's help in a fraction of the time it would have taken alone, and they are written in my voice (or close to it) because I gave Claude my actual decisions, prompts, and bugs to work with.

**Knowing when to pivot.** The most underrated benefit was Claude pushing back on me when I wanted to keep fighting a losing battle. The deployment-method dance burned about an hour; without an outside voice telling me "this is enough, document it and move on," it could have eaten the whole night.

**Refactoring at scale.** When I needed to switch from hardcoded `localhost` URLs to environment variables across multiple frontend files, Claude regenerated each file consistently and quickly. Doing this manually would have been tedious and error-prone (and indeed I missed two files even with the help, which is what caused the admin dashboard bug).

---

## What Did Not Work Well

**Architecture decisions made too early.** Claude initially recommended generating a separate set of SQL Server migrations alongside my SQLite migrations to support both providers. That approach generated model snapshot conflicts that broke local development and took multiple commits to undo. The lesson: do not let AI commit you to a strategy until you have a working baseline. Get the simple thing working first, only generalize when you actually need to.

**Confidence on Azure-specific quirks.** AI was sometimes confidently wrong about Azure-for-Students restrictions. It suggested service-principal authentication multiple times before I finally tried it and discovered the OSU tenant had blocked it. AI does not know your specific subscription's policies and will assume the documented happy path applies.

**Tooling versions.** Several times AI gave me commands or YAML using package versions or actions that did not match my actual installed versions. The DOTNET_VERSION in workflows, deprecated CLI flags like `--sdk-auth`, and an outdated reference to `azure/webapps-deploy@v3` are all examples. Always verify versions against your `package.json` or `.csproj` rather than trusting AI's defaults.

**Long-conversation context decay.** Late in the deployment phase Claude occasionally lost track of details I had given earlier (which region I was using, which name I had given a resource). This required me to re-explain context at the start of new exchanges. It was a small annoyance, not a blocker, but it taught me to keep my own notes (URLs, resource names, credentials) in a separate document rather than relying on the AI to remember.

---

## Impact on Productivity and Learning

On productivity: I would estimate AI assistance compressed Milestone 6 from a realistic 12-15 hour week into a single 5-6 hour evening. Almost all of that compression came from debugging speed during the deployment phase. For documentation, the speed-up was smaller but still meaningful — maybe 3x — because writing well still requires you to know what you actually built.

On learning: this is more nuanced. I learned a lot about Azure App Service, Static Web Apps, GitHub Actions YAML, and the practical realities of getting a Linux container to accept a Windows-built zip. That learning happened *because* AI was guiding me through real production failures, not in spite of it. I would not have encountered most of those edge cases at all without trying to deploy something real.

What I did not learn deeply: I do not yet feel confident I could design a CI/CD pipeline from scratch without a reference. I leaned on Claude's YAML drafts heavily, and while I can now read those workflows and understand them, I would struggle to write one cold. That is a gap I want to close in future projects by deliberately writing the first pass myself before checking AI's version.

---

## Lessons Learned About AI-Assisted Development

A few things I will take into future projects:

1. **Use AI for debugging, not for designing.** AI is a phenomenal partner for "this is broken, here is the error, what is going on?" It is a much weaker partner for "I am about to start building X, what should the architecture be?" The first asks AI to react to evidence; the second asks it to commit to choices, and it will usually commit too quickly.

2. **Verify before pasting.** Especially with security-sensitive code, infrastructure code, and dependency versions. AI suggestions for these areas have failed me enough times that I now read every line before accepting it.

3. **Write down your own state.** Conversation length and AI memory are real constraints. Keep a notes file with your URLs, resource names, decisions made, and credentials (in a password manager). Do not assume your AI conversation will remember three days from now.

4. **Decide deadlines yourself.** AI will keep iterating on a problem for as long as you let it. The decision to stop, document the limitation, and ship is always the human's call. The most valuable thing I did all of M6 was decide to stop fighting backend auto-deploy at the right moment.

5. **Production is the only real test.** Code that passes locally and passes in CI can still break in production because of environment differences (env vars, paths, CORS, runtime OS, file system case-sensitivity). I will run my own smoke test against the live deployed environment after every significant change in future projects, not just rely on green checks.

6. **Honest documentation of limitations is worth more than pretending.** The SQLite-instead-of-Azure-SQL disclosure and the manual-backend-deploy disclosure in this project are clearly written, technically justified, and document real constraints rather than hide them. I would rather submit a project that says "this is what I built and here is exactly where it falls short of the rubric and why" than one that pretends to meet the rubric and crumbles under inspection. Future graders, employers, and teammates will appreciate the same approach.

---

## Closing

Buckeye Marketplace is the most ambitious individual project I have built so far, and AI tools made the difference between shipping it and missing the deadline. The tools did not write the code or make the decisions, but they made the difference between being stuck for an hour on a cryptic error and being stuck for five minutes. That difference, multiplied across a six-milestone project, is the entire delta between shipping and not shipping.

I came into this project skeptical that AI was as transformative as people claimed. I leave it convinced that the transformative thing is not AI itself, but a developer who has learned to use it well — selectively, skeptically, and with their own judgment fully intact.