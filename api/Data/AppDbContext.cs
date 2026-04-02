using Microsoft.EntityFrameworkCore;
using api.Models;

namespace api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Product> Products => Set<Product>();
        public DbSet<Cart> Carts => Set<Cart>();
        public DbSet<CartItem> CartItems => Set<CartItem>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Cart>()
                .HasMany(c => c.Items)
                .WithOne(ci => ci.Cart)
                .HasForeignKey(ci => ci.CartId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Product>()
                .HasMany(p => p.CartItems)
                .WithOne(ci => ci.Product)
                .HasForeignKey(ci => ci.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Cart>()
                .HasIndex(c => c.UserId)
                .IsUnique();

            modelBuilder.Entity<Product>().HasData(
                new Product
                {
                    Id = 1,
                    Title = "CSE 3241 Textbook",
                    Description = "Used textbook in good condition.",
                    Price = 35m,
                    Category = "Textbooks",
                    SellerName = "William Murdoch",
                    PostedDate = new DateTime(2026, 3, 5),
                    ImageUrl = "/images/textbook1.jpg"
                },
                new Product
                {
                    Id = 2,
                    Title = "Laptop Charger",
                    Description = "Works perfectly and fits most Dell laptops.",
                    Price = 18m,
                    Category = "Electronics",
                    SellerName = "William Murdoch",
                    PostedDate = new DateTime(2026, 3, 4),
                    ImageUrl = "/images/laptop1.jpg"
                },
                new Product
                {
                    Id = 3,
                    Title = "Biology Lab Goggles",
                    Description = "Barely used, clean and ready for lab.",
                    Price = 12m,
                    Category = "School Supplies",
                    SellerName = "Maya Patel",
                    PostedDate = new DateTime(2026, 3, 3),
                    ImageUrl = "/images/goggles1.jpg"
                },
                new Product
                {
                    Id = 4,
                    Title = "General Chemistry Textbook",
                    Description = "Some highlighting but still in solid condition.",
                    Price = 28m,
                    Category = "Textbooks",
                    SellerName = "Maya Patel",
                    PostedDate = new DateTime(2026, 3, 2),
                    ImageUrl = "/images/textbook2.jpg"
                },
                new Product
                {
                    Id = 5,
                    Title = "Mini Fridge",
                    Description = "Works great, perfect for dorms or apartments.",
                    Price = 80m,
                    Category = "Furniture",
                    SellerName = "Justin Westerling",
                    PostedDate = new DateTime(2026, 3, 1),
                    ImageUrl = "/images/fridge1.jpg"
                },
                new Product
                {
                    Id = 6,
                    Title = "Desk Chair",
                    Description = "Comfortable chair for studying or gaming.",
                    Price = 45m,
                    Category = "Furniture",
                    SellerName = "Justin Westerling",
                    PostedDate = new DateTime(2026, 2, 28),
                    ImageUrl = "/images/chair1.jpg"
                },
                new Product
                {
                    Id = 7,
                    Title = "Microwave",
                    Description = "Small apartment microwave in good working condition.",
                    Price = 30m,
                    Category = "Electronics",
                    SellerName = "Justin Westerling",
                    PostedDate = new DateTime(2026, 2, 27),
                    ImageUrl = "/images/microwave1.jpg"
                },
                new Product
                {
                    Id = 8,
                    Title = "Notebook Pack",
                    Description = "Five unused notebooks for classes.",
                    Price = 8m,
                    Category = "School Supplies",
                    SellerName = "Maya Patel",
                    PostedDate = new DateTime(2026, 2, 26),
                    ImageUrl = "/images/notebooks1.jpg"
                }
            );
        }
    }
}