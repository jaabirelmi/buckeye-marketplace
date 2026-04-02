import { Link } from "react-router-dom";
import type { Product } from "../../types/Product";
import AddToCartButton from "../AddToCartButton/AddToCartButton";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
      }}
    >
      <img
        src={product.imageUrl}
        alt={product.title}
        style={{
          width: "100%",
          height: "200px",
          objectFit: "cover",
          borderRadius: "8px",
        }}
      />

      <h2>{product.title}</h2>
      <p>{product.description}</p>
      <p>${product.price.toFixed(2)}</p>

      <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
        <Link to={`/products/${product.id}`}>View Details</Link>
        <AddToCartButton product={product} />
      </div>
    </div>
  );
}