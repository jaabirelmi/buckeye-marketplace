import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../services/orderApi";
import { useCartContext } from "../contexts/CartContext";

export default function CheckoutPage() {
  const [shippingAddress, setShippingAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { cartTotal, state, refreshCart } = useCartContext();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!shippingAddress.trim()) {
      setError("Shipping address is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const order = await createOrder(shippingAddress);
      await refreshCart();

      navigate(`/orders/confirmation/${order.orderId}`, {
        state: { order },
      });
    } catch {
      setError("Could not place order.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "24px" }}>
      <h1>Checkout</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginBottom: "20px" }}>
        <h2>Order Summary</h2>
        <p>Total items: {state.items.length}</p>
        <p>Total price: ${cartTotal.toFixed(2)}</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
        <div>
          <label htmlFor="shippingAddress">Shipping Address</label>
          <textarea
            id="shippingAddress"
            value={shippingAddress}
            onChange={(event) => setShippingAddress(event.target.value)}
            style={{ width: "100%", minHeight: "120px", marginTop: "6px", padding: "10px" }}
          />
        </div>

        <button type="submit" disabled={loading} style={{ padding: "12px" }}>
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}