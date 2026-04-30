import type { OrderResponse } from "../types/order";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/orders`;

function getAuthHeaders(includeJson = false): HeadersInit {
  const token = localStorage.getItem("auth_token");

  return {
    ...(includeJson ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function createOrder(shippingAddress: string): Promise<OrderResponse> {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify({ shippingAddress }),
  });

  if (!response.ok) {
    throw new Error("Failed to place order.");
  }

  return response.json();
}

export async function fetchMyOrders(): Promise<OrderResponse[]> {
  const response = await fetch(`${API_BASE_URL}/mine`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to load order history.");
  }

  return response.json();
}