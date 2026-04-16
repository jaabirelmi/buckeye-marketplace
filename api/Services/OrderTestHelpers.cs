using api.DTOs;
using api.Models;

namespace api.Services
{
    public static class OrderTestHelpers
    {
        public static decimal CalculateOrderTotal(IEnumerable<CartItem> items)
        {
            return items.Sum(item => (item.Product?.Price ?? 0) * item.Quantity);
        }

        public static string GenerateConfirmationNumber()
        {
            return $"ORD-{Guid.NewGuid().ToString("N")[..10].ToUpper()}";
        }

        public static List<OrderItem> MapCartItemsToOrderItems(IEnumerable<CartItem> items)
        {
            return items.Select(item => new OrderItem
            {
                ProductId = item.ProductId,
                ProductName = item.Product?.Title ?? "",
                Price = item.Product?.Price ?? 0,
                Quantity = item.Quantity,
                LineTotal = (item.Product?.Price ?? 0) * item.Quantity
            }).ToList();
        }

        public static CartResponse BuildCartResponse(Cart cart)
        {
            var items = cart.Items.Select(item => new CartItemResponse
            {
                CartItemId = item.Id,
                ProductId = item.ProductId,
                ProductName = item.Product?.Title ?? "",
                Price = item.Product?.Price ?? 0,
                ImageUrl = item.Product?.ImageUrl ?? "",
                Quantity = item.Quantity,
                LineTotal = (item.Product?.Price ?? 0) * item.Quantity
            }).ToList();

            return new CartResponse
            {
                CartId = cart.Id,
                UserId = cart.UserId,
                Items = items,
                TotalItems = items.Sum(i => i.Quantity),
                TotalPrice = items.Sum(i => i.LineTotal)
            };
        }
    }
}