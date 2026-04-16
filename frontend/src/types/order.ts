export type OrderItem = {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  lineTotal: number;
};

export type OrderResponse = {
  orderId: number;
  orderDate: string;
  status: string;
  total: number;
  shippingAddress: string;
  confirmationNumber: string;
  items: OrderItem[];
};