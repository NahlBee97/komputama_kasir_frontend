import api from "../lib/axios";

export async function getUserCart() {
  try {
    const cart = await api.get("/api/carts");
    return cart.data.cart;
  } catch (error) {
    console.error("Error fetching cart:", error);
  }
}

export async function addItemToCart(productId: number, quantity: number) {
  try {
    const response = await api.post("/api/carts/items", {
      productId,
      quantity,
    });
    return response.data.cart;
  } catch (error) {
    console.error("Error adding item to cart:", error);
  }
}

export async function updateItemQuantity(itemId: number, quantity: number) {
  try {
    const response = await api.put(`/api/carts/items/${itemId}`, {
      quantity,
    });
    return response.data.cart;
  } catch (error) {
    console.error("Error updating item quantity:", error);
  }
}

export async function removeItemFromCart(itemId: number) {
  try {
    const response = await api.delete(`/api/carts/items/${itemId}`);
    return response.data.cart;
  } catch (error) {
    console.error("Error removing item from cart:", error);
  }
}