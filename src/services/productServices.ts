import type { NewProduct, UpdateProduct } from "../interfaces/productInterfaces";
import api from "../lib/axios";

export async function getProducts() {
  try {
    const response = await api.get("/api/products");

    return response.data.products;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

export async function getTopProducts() {
  try {
    const response = await api.get("/api/products/top");

    return response.data.products;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

export async function getProductById(id: number) {
  try {
    const response = await api.get(`/api/products/${id}`);

    return response.data.product;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

export async function createProduct(data: NewProduct) {
  try {
    const response = await api.post("/api/products", data);

    return response.data.newProduct;
  } catch (error) {
    console.error("Error adding product:", error);
  }
}

export async function updateProduct(id: number, data: UpdateProduct) {
  try {
    const response = await api.put(`/api/products/${id}`, data);

    return response.data.updatedProduct;
  } catch (error) {
    console.error("Error updating product:", error);
  }
}

export async function deleteProduct(id: number) {
  try {
    await api.delete(`/api/products/${id}`);

  } catch (error) {
    console.error("Error updating product:", error);
  }
}
