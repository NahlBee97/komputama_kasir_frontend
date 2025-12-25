import { createContext } from "react";
import type { Product } from "../interfaces/productInterfaces";
import type { Cart, CartItem } from "../interfaces/cartInterfaces";

export interface CartContextType {
  cart: Cart;
  cartItems: CartItem[];
  totalAmount: number;
  addToCart: (product: Product) => void;
  removeFromCart: (cartItemId: number) => void;
  updateItem: (itemId: number, quantity: number) => void;
  refreshCart: () => Promise<void>; // <--- Added this
  isLoading: boolean;
  isError: boolean;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);
