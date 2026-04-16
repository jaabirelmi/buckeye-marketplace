import { useEffect, useState } from "react";
import { fetchMyOrders } from "../services/orderApi";
import type { OrderResponse } from "../types/order";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        setError("");
        const data = await fetchMyOrders();
        setOrders(data);
      } catch {
        setError("Could not load order history.");
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px" }}>
      <h1>My Orders</h1>

      {loading && <p>Loading orders...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && orders.length === 0 && <p>No orders yet.</p>}

      {!loading && !error && orders.length > 0 && (
        <div style={{ display: "grid", gap: "20px" }}>
          {orders.map((order) => (
            <div
              key={order.orderId}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "16px",
              }}
            >
              <p><strong>Order ID:</strong> {order.orderId}</p>
              <p><strong>Confirmation Number:</strong> {order.confirmationNumber}</p>
              <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
              <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>

              <div style={{ marginTop: "12px" }}>
                <strong>Items:</strong>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={`${order.orderId}-${item.productId}-${index}`}>
                      {item.productName} x {item.quantity} — ${item.lineTotal.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}