using api.Models;
using api.Services;
using FluentAssertions;

namespace api.Tests.Unit
{
    public class OrderMappingTests
    {
        [Fact]
        public void MapCartItemsToOrderItems_Should_Copy_Product_Data_And_LineTotals()
        {
            var cartItems = new List<CartItem>
            {
                new CartItem
                {
                    ProductId = 1,
                    Quantity = 2,
                    Product = new Product
                    {
                        Id = 1,
                        Title = "Laptop Charger",
                        Price = 18m
                    }
                }
            };

            var orderItems = OrderTestHelpers.MapCartItemsToOrderItems(cartItems);

            orderItems.Should().HaveCount(1);
            orderItems[0].ProductId.Should().Be(1);
            orderItems[0].ProductName.Should().Be("Laptop Charger");
            orderItems[0].Price.Should().Be(18m);
            orderItems[0].Quantity.Should().Be(2);
            orderItems[0].LineTotal.Should().Be(36m);
        }

        [Fact]
        public void BuildCartResponse_Should_Calculate_TotalItems_And_TotalPrice()
        {
            var cart = new Cart
            {
                Id = 1,
                UserId = "user-1",
                Items = new List<CartItem>
                {
                    new CartItem
                    {
                        Id = 10,
                        ProductId = 1,
                        Quantity = 2,
                        Product = new Product
                        {
                            Id = 1,
                            Title = "Notebook Pack",
                            Price = 8m,
                            ImageUrl = "/images/notebooks1.jpg"
                        }
                    },
                    new CartItem
                    {
                        Id = 11,
                        ProductId = 2,
                        Quantity = 1,
                        Product = new Product
                        {
                            Id = 2,
                            Title = "Desk Chair",
                            Price = 45m,
                            ImageUrl = "/images/chair1.jpg"
                        }
                    }
                }
            };

            var response = OrderTestHelpers.BuildCartResponse(cart);

            response.TotalItems.Should().Be(3);
            response.TotalPrice.Should().Be(61m);
            response.Items.Should().HaveCount(2);
        }
    }
}