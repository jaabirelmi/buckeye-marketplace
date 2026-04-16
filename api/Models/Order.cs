namespace api.Models
{
    public class Order
    {
        public int Id { get; set; }
        public string UserId { get; set; } = "";
        public DateTime OrderDate { get; set; }
        public string Status { get; set; } = "";
        public decimal Total { get; set; }
        public string ShippingAddress { get; set; } = "";
        public string ConfirmationNumber { get; set; } = "";

        public List<OrderItem> Items { get; set; } = new();
    }
}