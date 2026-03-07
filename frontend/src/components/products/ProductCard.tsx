import { Link } from "react-router-dom";
import type { Product } from "../../types/Product";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const priceText =
    product.price === 0 ? "Free" : `$${product.price.toFixed(2)}`;

  return (
    <Link
      to={`/products/${product.id}`}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "block",
        width: "100%",
      }}
    >
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "12px",
          background: "#fff",
          color: "#111",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <img
          src={product.imageUrl}
          alt={product.title}
          style={{
            width: "100%",
            height: "160px",
            objectFit: "cover",
            borderRadius: "8px",
            marginBottom: "8px",
          }}
        />

        <h3 style={{ margin: "8px 0" }}>{product.title}</h3>
        <p style={{ margin: "6px 0" }}>
          <strong>{priceText}</strong>
        </p>
        <p style={{ margin: "6px 0" }}>Category: {product.category}</p>
        <p style={{ margin: "6px 0" }}>Seller: {product.sellerName}</p>
      </div>
    </Link>
  );
}