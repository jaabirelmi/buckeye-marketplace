using System.Data.Common;
using api.Data;
using api.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace api.Tests.Integration
{
    public class TestWebApplicationFactory : WebApplicationFactory<Program>
    {
        private readonly SqliteConnection _connection;

        public TestWebApplicationFactory()
        {
            _connection = new SqliteConnection("DataSource=:memory:");
            _connection.Open();
        }

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.UseEnvironment("Testing");
            Environment.SetEnvironmentVariable("Jwt__Key", "ThisIsATestJwtKey123456789012345");

            builder.ConfigureAppConfiguration((_, config) =>
            {
                config.AddInMemoryCollection(new Dictionary<string, string?>
                {
                    ["Jwt:Key"] = "ThisIsATestJwtKey123456789012345"
                });
            });

            builder.ConfigureServices(services =>
            {
                services.RemoveAll(typeof(DbContextOptions<AppDbContext>));
                services.RemoveAll(typeof(DbConnection));

                services.AddSingleton<DbConnection>(_connection);

                services.AddDbContext<AppDbContext>((serviceProvider, options) =>
                {
                    var connection = serviceProvider.GetRequiredService<DbConnection>();
                    options.UseSqlite(connection);
                });

                var serviceProvider = services.BuildServiceProvider();

                using var scope = serviceProvider.CreateScope();
                var scopedServices = scope.ServiceProvider;

                var db = scopedServices.GetRequiredService<AppDbContext>();
                var userManager = scopedServices.GetRequiredService<UserManager<ApplicationUser>>();
                var roleManager = scopedServices.GetRequiredService<RoleManager<IdentityRole>>();

                db.Database.EnsureCreated();

                SeedData(db, userManager, roleManager).GetAwaiter().GetResult();
            });
        }

        private static async Task SeedData(
            AppDbContext db,
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager)
        {
            if (!await roleManager.RoleExistsAsync("User"))
            {
                await roleManager.CreateAsync(new IdentityRole("User"));
            }

            var email = "integration@test.com";
            var password = "Password1";

            var user = await userManager.FindByEmailAsync(email);
            if (user == null)
            {
                user = new ApplicationUser
                {
                    UserName = email,
                    Email = email,
                    EmailConfirmed = true
                };

                var createResult = await userManager.CreateAsync(user, password);
                if (createResult.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, "User");
                }
            }

            if (!db.Products.Any(p => p.Id == 100))
            {
                db.Products.Add(new Product
                {
                    Id = 100,
                    Title = "Integration Product",
                    Description = "Test product",
                    Price = 10m,
                    Category = "Test",
                    SellerName = "Seeder",
                    PostedDate = DateTime.UtcNow,
                    ImageUrl = "/images/test.jpg"
                });

                await db.SaveChangesAsync();
            }

            var existingUser = await userManager.FindByEmailAsync(email);
            if (existingUser == null)
            {
                throw new InvalidOperationException("Integration test user was not created.");
            }

            var existingCart = await db.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.UserId == existingUser.Id);

            if (existingCart == null)
            {
                existingCart = new Cart
                {
                    UserId = existingUser.Id
                };

                db.Carts.Add(existingCart);
                await db.SaveChangesAsync();
            }

            if (!db.CartItems.Any(ci => ci.CartId == existingCart.Id && ci.ProductId == 100))
            {
                db.CartItems.Add(new CartItem
                {
                    CartId = existingCart.Id,
                    ProductId = 100,
                    Quantity = 2
                });

                await db.SaveChangesAsync();
            }
        }

        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);

            if (disposing)
            {
                _connection.Dispose();
            }
        }
    }
}