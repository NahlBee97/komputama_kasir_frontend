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

export async function getTodayOrders(userId?: number) {
  try {
    const response = await api.get(userId ? `/api/orders/today/${userId}` : `/api/orders/today`);
    return response.data.orders;
  } catch (error) {
    console.error("Error get today's order:", error);
  }
}

// Update the function signature to accept all three parameters
export const getOrders = async (
  start: string,
  end: string,
  page: number,
  userId?: number
) => {
  try {
    // 2. Axios automatically handles parameter encoding using the 'params' property
    const response = await api.get("/api/orders", {
      params: {
        start: start,
        end: end,
        page: page.toString(), // Ensure page is a string for the query parameter
        userId: userId?.toString(), // Include userId if provided
      },
    });

    // 3. Axios automatically parses JSON and returns the data object on the 'data' property
    return response.data.ordersData;
  } catch (error) {
    // Axios throws an error for non-2xx status codes, making error handling cleaner
    // You can access the specific error response details if needed: error.response
    console.error("Error fetching orders with Axios:", error);
    
    // Throw a standardized error for the component to handle
    throw new Error("Failed to fetch orders.");
  }
};

export const getOrderSummary = async (
  start: string,
  end: string,
  userId?: number
) => {
  try {
    const response = await api.get("/api/orders/summary", {
      params: { start, end, userId },
    });
    return response.data.summary;
  } catch (error) {
    console.error("Error fetching order summary:", error);
    throw new Error("Failed to fetch order summary.");
  }
};

