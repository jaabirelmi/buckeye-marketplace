## Database Persistence / Test Scenario

This project uses Entity Framework Core with SQLite for persistence.

### Seed Data
The product catalog is seeded in the database through `AppDbContext` with 8 sample Buckeye Marketplace products across multiple categories:
- Textbooks
- Electronics
- Furniture
- School Supplies

### Cart Persistence Test Scenario
To verify cart persistence:
1. Run the backend API and frontend app
2. Add multiple products to the cart, including duplicate adds to test quantity updates
3. Open the cart page and confirm all items appear correctly
4. Refresh the browser and confirm the cart data remains available
5. Remove a single item and refresh again to confirm the change persists
6. Clear the cart and confirm the empty cart state persists after refresh
7. Use Swagger or the frontend to verify cart operations persist in the SQLite database