import type { OrderStatus } from "./authInterfaces";
import type { Product } from "./productInterfaces";

export interface Order {
  id: number;
  userId: number;
  totalAmount: number;
  paymentCash: number;
  paymentChange: number;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: Date;
}

export interface OrderItem {
  id: number;
  quantity: number;
  unitPrice: number;
  orderId: number;
  productId: number;
  product?: Product;
}

export interface NewOrder {
  userId: number;
  totalAmount: number;
  paymentCash: number;
  paymentChange: number;
}

export interface NewOrderItem {
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
}
