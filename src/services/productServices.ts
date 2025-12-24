import api from "../lib/axios";

export const getProducts = async (page: number = 1) => {
  try {
    const response = await api.get("/api/products", {
      params: {
        page: page.toString(),
      },
    });

    return response.data.productsData;
  } catch (error) {
    console.error("Error fetching paginated products with Axios:", error);
    throw new Error("Failed to fetch products.");
  }
};

export const getLowStockProducts = async () => {
  try {
    const response = await api.get("/api/products/low");

    return response.data.products;
  } catch (error) {
    console.error("Error get low stock products:", error);
    throw new Error("Failed to fetch products.");
  }
};

export const getTopProducts = async (start: string, end: string, userId?: number) => {
  try {
    const response = await api.get("/api/products/top", {
      params: { start, end, userId },
    });
    return response.data.products;
  } catch (error) {
    console.error("Error fetching top products:", error);
    throw new Error("Failed to fetch top products.");
  }
};

export async function getProductById(id: number) {
  try {
    const response = await api.get(`/api/products/${id}`);

    return response.data.product;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

export async function createProduct(data: FormData) {
  try {
    const response = await api.post("/api/products", data);

    return response.data.newProduct;
  } catch (error) {
    console.error("Error adding product:", error);
  }
}

export async function updateProduct(id: number, data: FormData) {
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
