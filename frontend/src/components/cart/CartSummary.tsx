import styles from "../../pages/CartPage.module.css";

interface CartSummaryProps {
  cartItemCount: number;
  cartTotal: number;
  onClearCart: () => void;
}

export default function CartSummary({
  cartItemCount,
  cartTotal,
  onClearCart,
}: CartSummaryProps) {
  return (
    <>
      <div className={styles.summary}>
        <div>
          <span className={styles.totalLabel}>Total Items: </span>
          <span className={styles.totalValue}>{cartItemCount}</span>
        </div>
        <div>
          <span className={styles.totalLabel}>Total Price: </span>
          <span className={styles.totalValue}>${cartTotal.toFixed(2)}</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px", marginTop: "20px", flexWrap: "wrap" }}>
        <button
          type="button"
          className={styles.checkoutButton}
          onClick={onClearCart}
        >
          Clear Cart
        </button>
      </div>
    </>
  );
}