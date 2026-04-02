namespace api.DTOs
{
    public class CartItemResponse
    {
        public int CartItemId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = "";
        public decimal Price { get; set; }
        public string ImageUrl { get; set; } = "";
        public int Quantity { get; set; }
        public decimal LineTotal { get; set; }
    }

    public class CartResponse
    {
        public int CartId { get; set; }
        public string UserId { get; set; } = "";
        public List<CartItemResponse> Items { get; set; } = new();
        public int TotalItems { get; set; }
        public decimal TotalPrice { get; set; }
    }
}