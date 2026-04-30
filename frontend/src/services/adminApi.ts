import type { Product } from "../types/Product";
import type { OrderResponse } from "../types/order";

const PRODUCTS_URL = `${import.meta.env.VITE_API_BASE_URL}/products`;
const ORDERS_URL = `${import.meta.env.VITE_API_BASE_URL}/orders`;

function getAuthHeaders(includeJson = false): HeadersInit {
  const token = localStorage.getItem("auth_token");

  return {
    ...(includeJson ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function createProduct(product: Omit<Product, "id" | "postedDate">): Promise<Product> {
  const response = await fetch(PRODUCTS_URL, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error("Failed to create product.");
  }

  return response.json();
}

export async function updateProduct(id: number, product: Omit<Product, "id" | "postedDate">): Promise<Product> {
  const response = await fetch(`${PRODUCTS_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(true),
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error("Failed to update product.");
  }

  return response.json();
}

export async function deleteProduct(id: number): Promise<void> {
  const response = await fetch(`${PRODUCTS_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to delete product.");
  }
}

export async function fetchAllOrders(): Promise<OrderResponse[]> {
  const response = await fetch(ORDERS_URL, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to load orders.");
  }

  return response.json();
}

export async function updateOrderStatus(orderId: number, status: string): Promise<OrderResponse> {
  const response = await fetch(`${ORDERS_URL}/${orderId}/status`, {
    method: "PUT",
    headers: getAuthHeaders(true),
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error("Failed to update order status.");
  }

  return response.json();
}