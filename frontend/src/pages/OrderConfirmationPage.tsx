import { Link, useLocation, useParams } from "react-router-dom";
import type { OrderResponse } from "../types/order";

export default function OrderConfirmationPage() {
  const location = useLocation();
  const { orderId } = useParams();

  const order = (location.state as { order?: OrderResponse } | null)?.order;

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "24px" }}>
      <h1>Order Confirmation</h1>

      {!order ? (
        <>
          <p>Your order was placed successfully.</p>
          <p>Order ID: {orderId}</p>
        </>
      ) : (
        <>
          <p>Your order was placed successfully.</p>
          <p><strong>Confirmation Number:</strong> {order.confirmationNumber}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
          <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
        </>
      )}

      <div style={{ marginTop: "20px", display: "flex", gap: "16px" }}>
        <Link to="/orders">View Order History</Link>
        <Link to="/">Continue Shopping</Link>
      </div>
    </div>
  );
}