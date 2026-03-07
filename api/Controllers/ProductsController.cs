using Microsoft.AspNetCore.Mvc;
using api.Models;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private static readonly List<Product> Products = new()
        {
            new Product
            {
                Id = 1,
                Title = "CSE 3241 Textbook",
                Description = "Used textbook in good condition.",
                Price = 35,
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
                Price = 18,
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
                Price = 12,
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
                Price = 28,
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
                Price = 80,
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
                Price = 45,
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
                Price = 30,
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
                Price = 8,
                Category = "School Supplies",
                SellerName = "Maya Patel",
                PostedDate = new DateTime(2026, 2, 26),
                ImageUrl = "/images/notebooks1.jpg"
            }
        };

        [HttpGet]
        public ActionResult<IEnumerable<Product>> GetProducts()
        {
            return Ok(Products);
        }

        [HttpGet("{id}")]
        public ActionResult<Product> GetProduct(int id)
        {
            var product = Products.FirstOrDefault(p => p.Id == id);

            if (product == null)
            {
                return NotFound();
            }

            return Ok(product);
        }
    }
}