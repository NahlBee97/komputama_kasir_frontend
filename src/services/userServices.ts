import type { NewUser, SetPin, UpdateUser } from "../interfaces/userInterfaces";
import api from "../lib/axios";

export async function getAllUsers() {
  const response = await api.get("/api/users");
  return response.data.users;
}

export async function getUserById(userId: number) {
  const response = await api.get(`/api/users/${userId}`);
  return response.data.user;
}

export async function createUser(userData: NewUser) {
  const response = await api.post("/api/users", userData);
  return response.data.user;
}

export async function updateUser(userId: number, updateData: UpdateUser | SetPin) {
  const response = await api.put(`/api/users/${userId}`, updateData);
  return response.data.user;
}
export async function deleteUser(userId: number) {
  await api.delete(`/api/users/${userId}`);
}
