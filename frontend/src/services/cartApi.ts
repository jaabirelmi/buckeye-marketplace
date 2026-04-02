import type { CartResponse } from "../types/cart";

const API_BASE_URL = "http://localhost:5206/api/cart";

export async function fetchCart(): Promise<CartResponse> {
  const response = await fetch(API_BASE_URL);

  if (!response.ok) {
    throw new Error("Failed to load cart.");
  }

  return response.json();
}

export async function postAddToCart(productId: number, quantity: number): Promise<CartResponse> {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productId,
      quantity,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to add item to cart.");
  }

  return response.json();
}

export async function putUpdateCartItem(
  cartItemId: number,
  quantity: number
): Promise<CartResponse> {
  const response = await fetch(`${API_BASE_URL}/${cartItemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      quantity,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update cart item.");
  }

  return response.json();
}

export async function deleteCartItem(cartItemId: number): Promise<CartResponse> {
  const response = await fetch(`${API_BASE_URL}/${cartItemId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to remove cart item.");
  }

  return response.json();
}

export async function deleteClearCart(): Promise<CartResponse> {
  const response = await fetch(`${API_BASE_URL}/clear`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to clear cart.");
  }

  return response.json();
}