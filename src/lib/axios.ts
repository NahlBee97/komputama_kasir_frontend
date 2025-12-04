import axios, { type InternalAxiosRequestConfig } from "axios";
import { apiUrl } from "../config";

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check if the error is specifically a 401
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");

      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default api;
