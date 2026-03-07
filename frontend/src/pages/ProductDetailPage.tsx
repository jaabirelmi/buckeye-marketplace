import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Product } from "../types/Product";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`http://localhost:5206/api/products/${id}`);

        if (response.status === 404) {
          setError("Product not found.");
          setProduct(null);
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to load product.");
        }

        const data: Product = await response.json();
        setProduct(data);
      } catch {
        setError("Could not load product details.");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      <Link to="/">← Back to products</Link>

      {loading && <p>Loading product details...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && product && (
        <div style={{ marginTop: "20px" }}>
          <img
            src={product.imageUrl}
            alt={product.title}
            style={{
              width: "100%",
              maxWidth: "500px",
              height: "auto",
              borderRadius: "10px",
              marginBottom: "16px",
            }}
          />

          <h1>{product.title}</h1>
          <p><strong>Description:</strong> {product.description}</p>
          <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Seller:</strong> {product.sellerName}</p>
          <p><strong>Posted:</strong> {new Date(product.postedDate).toLocaleDateString()}</p>
          <p><strong>ID:</strong> {product.id}</p>
        </div>
      )}
    </div>
  );
}