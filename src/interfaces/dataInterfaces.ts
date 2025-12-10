export type Role = "ADMIN" | "CASHIER";
export type OrderStatus = "COMPLETED" | "VOID";

export interface User {
  id: number;
  name: string;
  role: Role;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number; // Prisma Decimal is usually handled as number or string in TS
  stock: number;
  image: string | null; // Nullable because of String?
  isActive: boolean;
}

export interface Order {
  id: number;
  totalAmount: number;
  paymentCash: number;
  paymentChange: number;
  items: OrderItem[];
  status: OrderStatus;
}

export interface OrderItem {
  id: number;
  quantity: number;
  unitPrice: number;
  orderId: number;
  productId: number;
  product: Product;
}

export interface ProductWithSales extends Product {
  orderItems: OrderItem[];
}
