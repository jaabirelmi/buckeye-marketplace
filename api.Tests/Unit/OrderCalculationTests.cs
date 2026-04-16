using api.Models;
using api.Services;
using FluentAssertions;

namespace api.Tests.Unit
{
    public class OrderCalculationTests
    {
        [Fact]
        public void CalculateOrderTotal_Should_Return_Correct_Total()
        {
            var items = new List<CartItem>
            {
                new CartItem
                {
                    ProductId = 1,
                    Quantity = 2,
                    Product = new Product { Id = 1, Title = "Book", Price = 10m }
                },
                new CartItem
                {
                    ProductId = 2,
                    Quantity = 3,
                    Product = new Product { Id = 2, Title = "Pen", Price = 5m }
                }
            };

            var total = OrderTestHelpers.CalculateOrderTotal(items);

            total.Should().Be(35m);
        }
    }
}