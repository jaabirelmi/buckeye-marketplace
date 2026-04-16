# E2E Run Notes

## Tooling used
- GitHub Copilot Chat in Agent mode
- Playwright MCP
- Command run: `npx playwright test`

## Prompt used
I asked Copilot to:
- register or log in with a valid user
- browse products
- add an item to the cart
- go to checkout and place an order
- verify the order confirmation appears
- go to order history and verify the order is listed
- stop immediately and report exactly what failed if any step broke

## What failed the first time
The first Playwright failure happened at the Add to Cart step. The original selector did not account for the button’s dynamic accessible name, which includes the product title. After that, the selector matched multiple buttons on the page and had to be narrowed.

## What I corrected
I updated the Playwright selector to match the dynamic Add to Cart button label and then narrowed it to the first matching button so the happy path could continue. I also separated Vitest and Playwright configuration so frontend unit tests and E2E tests would not conflict.

## Final result
Passed

## Command output
- `npx playwright test` → passed