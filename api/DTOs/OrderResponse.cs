namespace api.DTOs
{
    public class OrderItemResponse
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = "";
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public decimal LineTotal { get; set; }
    }

    public class OrderResponse
    {
        public int OrderId { get; set; }
        public DateTime OrderDate { get; set; }
        public string Status { get; set; } = "";
        public decimal Total { get; set; }
        public string ShippingAddress { get; set; } = "";
        public string ConfirmationNumber { get; set; } = "";
        public List<OrderItemResponse> Items { get; set; } = new();
    }
}