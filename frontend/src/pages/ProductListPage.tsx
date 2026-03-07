import { useEffect, useState } from "react";
import ProductList from "../components/products/ProductList";
import type { Product } from "../types/Product";

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("http://localhost:5206/api/products");

        if (!response.ok) {
          throw new Error("Failed to load products.");
        }

        const data: Product[] = await response.json();
        setProducts(data);
      } catch {
        setError("Could not load products from the API.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return (
  <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
    <h1>Buckeye Marketplace</h1>

    {loading && <p>Loading products...</p>}

    {error && <p>{error}</p>}

    {!loading && !error && <ProductList products={products} />}
  </div>
);
}