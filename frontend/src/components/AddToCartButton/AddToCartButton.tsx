import { useState } from "react";
import type { Product } from "../../types/Product";
import { useCartContext } from "../../contexts/CartContext";
import styles from "./AddToCartButton.module.css";

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCartContext();
  const [added, setAdded] = useState(false);

  async function handleClick() {
    const success = await addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl,
    });

    if (success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  }

  return (
    <button
      className={`${styles.button} ${added ? styles.added : ""}`}
      onClick={handleClick}
      aria-label={`Add ${product.title} to cart`}
    >
      {added ? "Added!" : "Add to Cart"}
    </button>
  );
}