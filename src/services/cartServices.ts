import api from "../lib/axios";

export async function getUserCart() {
  try {
    const cart = await api.get("/api/carts");
    return cart.data.cart;
  } catch (error) {
    console.error("Error fetching cart:", error);
  }
}
