import type { CartResponse } from "../types/cart";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/cart`;

function getAuthHeaders(includeJson = false): HeadersInit {
  const token = localStorage.getItem("auth_token");

  return {
    ...(includeJson ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchCart(): Promise<CartResponse> {
  const response = await fetch(API_BASE_URL, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to load cart.");
  }

  return response.json();
}

export async function postAddToCart(productId: number, quantity: number): Promise<CartResponse> {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(true),
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
    headers: getAuthHeaders(true),
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
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to remove cart item.");
  }

  return response.json();
}

export async function deleteClearCart(): Promise<CartResponse> {
  const response = await fetch(`${API_BASE_URL}/clear`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to clear cart.");
  }

  return response.json();
}