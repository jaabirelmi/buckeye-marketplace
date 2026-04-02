import type { CartItem as CartItemType } from "../../types/cart";
import styles from "../../pages/CartPage.module.css";

interface CartItemProps {
  item: CartItemType;
  onDecrease: (cartItemId: number, quantity: number) => void;
  onIncrease: (cartItemId: number, quantity: number) => void;
  onRemove: (cartItemId: number) => void;
}

export default function CartItem({
  item,
  onDecrease,
  onIncrease,
  onRemove,
}: CartItemProps) {
  return (
    <li className={styles.item}>
      <div className={styles.itemInfo}>
        <span className={styles.itemName}>{item.productName}</span>
        <span className={styles.itemPrice}>${item.price.toFixed(2)}</span>
      </div>

      <div className={styles.itemControls}>
        <div className={styles.quantitySelector}>
          <button
            type="button"
            className={styles.qtyButton}
            aria-label={`Decrease quantity of ${item.productName}`}
            disabled={item.quantity === 1}
            onClick={() => onDecrease(item.cartItemId, item.quantity)}
          >
            −
          </button>

          <span className={styles.qtyValue} aria-live="polite">
            {item.quantity}
          </span>

          <button
            type="button"
            className={styles.qtyButton}
            aria-label={`Increase quantity of ${item.productName}`}
            disabled={item.quantity === 99}
            onClick={() => onIncrease(item.cartItemId, item.quantity)}
          >
            +
          </button>
        </div>

        <span className={styles.lineTotal}>${item.lineTotal.toFixed(2)}</span>

        <button
          type="button"
          className={styles.removeButton}
          aria-label={`Remove ${item.productName} from cart`}
          onClick={() => onRemove(item.cartItemId)}
        >
          Remove
        </button>
      </div>
    </li>
  );
}