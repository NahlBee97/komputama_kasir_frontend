import type { NewUser, UpdateUser } from "../interfaces/userInterfaces";
import api from "../lib/axios";

export async function getAllUsers() {
  try {
    const response = await api.get("/api/users");
    return response.data.users;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

export async function getUserById(userId: number) {
  try {
    const response = await api.get(`/api/users/${userId}`);
    return response.data.user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
  }
}

export async function createUser(userData: NewUser) {
  try {
    const response = await api.post("/api/users", userData);
    return response.data.user;
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

export async function updateUser(
  userId: number,
  updateData: UpdateUser
) {
  try {
    const response = await api.put(`/api/users/${userId}`, updateData);
    return response.data.user;
  } catch (error) {
    console.error("Error updating user:", error);
  }
}
export async function deleteUser(userId: number) {
  try {
    await api.delete(`/api/users/${userId}`);
  } catch (error) {
    console.error("Error deleting user:", error);
  }
}
