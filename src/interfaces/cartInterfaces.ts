import type { Product } from "./productInterfaces";

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
}

export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  product: Product;
  quantity: number;
}

export interface AddToCartInput {
  userId: number;
  productId: number;
  quantity: number;
}
