import { Link } from "react-router-dom";
import { useCartContext } from "../../contexts/CartContext";

export default function CartBadge() {
  const { cartItemCount } = useCartContext();

  return (
    <Link
      to="/cart"
      style={{
        textDecoration: "none",
        color: "inherit",
        fontWeight: "bold",
      }}
    >
      Cart ({cartItemCount})
    </Link>
  );
}