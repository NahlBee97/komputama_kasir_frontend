import type { NewOrder } from "../interfaces/orderInterface";
import api from "../lib/axios";

export async function createOrder(orderData: NewOrder) {
  try {
    const response = await api.post("/api/orders", orderData);
    return response.data.order;
  } catch (error) {
    console.error("Error creating order:", error);
  }
}

export async function getTodayOrders() {
  try {
    const response = await api.get("/api/orders/today");
    return response.data.orders;
  } catch (error) {
    console.error("Error get today's order:", error);
  }
}

export async function getOrders() {
  try {
    const response = await api.get("/api/orders");
    return response.data.orders;
  } catch (error) {
    console.error("Error get all orders:", error);
  }
}

