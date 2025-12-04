import api from "../lib/axios";

export async function getProducts() {
  try {
    const response = await api.get("/api/products");

    return response.data.products;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}
