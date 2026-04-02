/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import type { ReactNode } from "react";
import { cartReducer, initialCartState } from "../reducers/cartReducer";
import type { CartResponse, CartState } from "../types/cart";
import {
  deleteCartItem,
  deleteClearCart,
  fetchCart,
  postAddToCart,
  putUpdateCartItem,
} from "../services/cartApi";

interface CartContextValue {
  state: CartState;
  cartItemCount: number;
  cartTotal: number;
  loading: boolean;
  error: string;
  success: string;
  refreshCart: () => Promise<void>;
  addToCart: (product: {
    id: number;
    title: string;
    price: number;
    imageUrl?: string;
  }) => Promise<boolean>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  clearMessages: () => void;
}

interface CartProviderProps {
  children: ReactNode;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function applyCartResponse(data: CartResponse) {
    dispatch({
      type: "SET_CART",
      payload: {
        items: data.items,
      },
    });
  }

  function clearMessages() {
    setError("");
    setSuccess("");
  }

  async function refreshCart() {
    try {
      setLoading(true);
      setError("");
      const data = await fetchCart();
      applyCartResponse(data);
    } catch {
      setError("Could not load cart.");
    } finally {
      setLoading(false);
    }
  }

  async function addToCart(product: {
    id: number;
    title: string;
    price: number;
    imageUrl?: string;
  }): Promise<boolean> {
    try {
      setError("");
      setSuccess("");
      const data = await postAddToCart(product.id, 1);
      applyCartResponse(data);
      setSuccess("Item added to cart.");
      return true;
    } catch {
      setError("This product is unavailable or could not be added to the cart.");
      return false;
    }
  }

  async function updateQuantity(cartItemId: number, quantity: number) {
    try {
      setError("");
      setSuccess("");
      const data = await putUpdateCartItem(cartItemId, quantity);
      applyCartResponse(data);
      setSuccess("Cart updated.");
    } catch {
      setError("Could not update cart item.");
    }
  }

  async function removeFromCart(cartItemId: number) {
    try {
      setError("");
      setSuccess("");
      const data = await deleteCartItem(cartItemId);
      applyCartResponse(data);
      setSuccess("Item removed from cart.");
    } catch {
      setError("Could not remove cart item.");
    }
  }

  async function clearCart() {
    try {
      setError("");
      setSuccess("");
      const data = await deleteClearCart();
      applyCartResponse(data);
      setSuccess("Cart cleared.");
    } catch {
      setError("Could not clear cart.");
    }
  }

  useEffect(() => {
    refreshCart();
  }, []);

  const cartItemCount = useMemo(() => {
    return state.items.reduce((sum, item) => sum + item.quantity, 0);
  }, [state.items]);

  const cartTotal = useMemo(() => {
    return state.items.reduce((sum, item) => sum + item.lineTotal, 0);
  }, [state.items]);

  return (
    <CartContext.Provider
      value={{
        state,
        cartItemCount,
        cartTotal,
        loading,
        error,
        success,
        refreshCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        clearMessages,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext(): CartContextValue {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }

  return context;
}