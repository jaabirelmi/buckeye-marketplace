import { useEffect, useState } from "react";
import type { Product } from "../types/Product";
import type { OrderResponse } from "../types/order";
import {
  createProduct,
  deleteProduct,
  fetchAllOrders,
  updateOrderStatus,
  updateProduct,
} from "../services/adminApi";

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    id: 0,
    title: "",
    description: "",
    price: 0,
    category: "",
    sellerName: "",
    imageUrl: "",
  });

  useEffect(() => {
    async function loadAdminData() {
      try {
        setError("");

        const [productsResponse, ordersData] = await Promise.all([
          fetch("http://localhost:5206/api/products"),
          fetchAllOrders(),
        ]);

        const productsData: Product[] = await productsResponse.json();

        setProducts(productsData);
        setOrders(ordersData);
      } catch {
        setError("Could not load admin dashboard data.");
      }
    }

    loadAdminData();
  }, []);

  async function reloadProducts() {
    try {
      const response = await fetch("http://localhost:5206/api/products");
      const data: Product[] = await response.json();
      setProducts(data);
    } catch {
      setError("Could not load products.");
    }
  }

  async function reloadOrders() {
    try {
      const data = await fetchAllOrders();
      setOrders(data);
    } catch {
      setError("Could not load admin orders.");
    }
  }

  function resetForm() {
    setForm({
      id: 0,
      title: "",
      description: "",
      price: 0,
      category: "",
      sellerName: "",
      imageUrl: "",
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (form.id === 0) {
        await createProduct({
          title: form.title,
          description: form.description,
          price: Number(form.price),
          category: form.category,
          sellerName: form.sellerName,
          imageUrl: form.imageUrl,
        });
        setSuccess("Product created.");
      } else {
        await updateProduct(form.id, {
          title: form.title,
          description: form.description,
          price: Number(form.price),
          category: form.category,
          sellerName: form.sellerName,
          imageUrl: form.imageUrl,
        });
        setSuccess("Product updated.");
      }

      resetForm();
      reloadProducts();
    } catch {
      setError("Could not save product.");
    }
  }

  async function handleDeleteProduct(id: number) {
    try {
      setError("");
      setSuccess("");
      await deleteProduct(id);
      setSuccess("Product deleted.");
      reloadProducts();
    } catch {
      setError("Could not delete product.");
    }
  }

  async function handleUpdateOrderStatus(orderId: number, status: string) {
    try {
      setError("");
      setSuccess("");
      await updateOrderStatus(orderId, status);
      setSuccess("Order status updated.");
      reloadOrders();
    } catch {
      setError("Could not update order status.");
    }
  }

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px" }}>
      <h1>Admin Dashboard</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <section style={{ marginBottom: "32px" }}>
        <h2>{form.id === 0 ? "Create Product" : "Edit Product"}</h2>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px", maxWidth: "600px" }}>
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          />
          <input
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <input
            placeholder="Seller Name"
            value={form.sellerName}
            onChange={(e) => setForm({ ...form, sellerName: e.target.value })}
          />
          <input
            placeholder="Image URL"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          />

          <div style={{ display: "flex", gap: "12px" }}>
            <button type="submit">{form.id === 0 ? "Create Product" : "Save Changes"}</button>
            {form.id !== 0 && (
              <button type="button" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2>Manage Products</h2>

        <div style={{ display: "grid", gap: "12px" }}>
          {products.map((product) => (
            <div
              key={product.id}
              style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "12px" }}
            >
              <p><strong>{product.title}</strong></p>
              <p>${product.price.toFixed(2)}</p>
              <p>{product.category}</p>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      id: product.id,
                      title: product.title,
                      description: product.description,
                      price: product.price,
                      category: product.category,
                      sellerName: product.sellerName,
                      imageUrl: product.imageUrl,
                    })
                  }
                >
                  Edit
                </button>

                <button type="button" onClick={() => handleDeleteProduct(product.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Manage Orders</h2>

        <div style={{ display: "grid", gap: "16px" }}>
          {orders.map((order) => (
            <div
              key={order.orderId}
              style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "12px" }}
            >
              <p><strong>Order #{order.orderId}</strong></p>
              <p>Confirmation: {order.confirmationNumber}</p>
              <p>Status: {order.status}</p>
              <p>Total: ${order.total.toFixed(2)}</p>
              <p>Shipping: {order.shippingAddress}</p>

              <select
                value={order.status}
                onChange={(e) => handleUpdateOrderStatus(order.orderId, e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}