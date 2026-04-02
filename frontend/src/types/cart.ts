export type CartItem = {
  cartItemId: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  lineTotal: number;
};

export type CartState = {
  items: CartItem[];
  isOpen: boolean;
};

export type CartResponse = {
  cartId: number;
  userId: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
};

export type CartAction =
  | {
      type: "SET_CART";
      payload: {
        items: CartItem[];
      };
    }
  | {
      type: "TOGGLE_CART";
    };