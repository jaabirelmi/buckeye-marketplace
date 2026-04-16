import { Link } from "react-router-dom";
import { useCartContext } from "../contexts/CartContext";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import styles from "./CartPage.module.css";

export default function CartPage() {
  const {
    state,
    cartItemCount,
    cartTotal,
    loading,
    error,
    success,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCartContext();

  const { items } = state;

  if (loading) {
    return (
      <div className={styles.empty}>
        <h1 className={styles.heading}>Your Cart</h1>
        <p className={styles.statusInfo}>Loading cart...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <h1 className={styles.heading}>Your Cart</h1>
        {error && <p className={styles.statusError}>{error}</p>}
        {success && <p className={styles.statusSuccess}>{success}</p>}
        <p className={styles.emptyMessage}>Your cart is empty.</p>
        <Link to="/" className={styles.browseLink}>
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.heading}>Your Cart</h1>

      {error && <p className={styles.statusError}>{error}</p>}
      {success && <p className={styles.statusSuccess}>{success}</p>}

      <ul className={styles.itemList}>
        {items.map((item) => (
          <CartItem
            key={item.cartItemId}
            item={item}
            onDecrease={(cartItemId, quantity) =>
              updateQuantity(cartItemId, quantity - 1)
            }
            onIncrease={(cartItemId, quantity) =>
              updateQuantity(cartItemId, quantity + 1)
            }
            onRemove={removeFromCart}
          />
        ))}
      </ul>

      <CartSummary
        cartItemCount={cartItemCount}
        cartTotal={cartTotal}
        onClearCart={clearCart}
      />

      <div style={{ marginTop: "16px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <Link
          to="/checkout"
          className={styles.browseLink}
          style={{ display: "inline-flex", alignItems: "center" }}
        >
          Proceed to Checkout
        </Link>

        <Link
          to="/"
          className={styles.browseLink}
          style={{ display: "inline-flex", alignItems: "center" }}
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}