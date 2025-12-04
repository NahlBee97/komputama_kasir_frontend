import { useState, type ReactNode } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";
import { jwtDecode } from "jwt-decode";
import type { User } from "../interfaces/dataInterfaces";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        return jwtDecode<User>(storedToken);
      }
      return null;
    } catch (error) {
      console.error("Invalid token, clearing storage." + error);
      localStorage.removeItem("token");
      return null;
    }
  });

  const login = async (role: string, pin: string) => {
    try {
      const response = await api.post("/api/auth/login", { role, pin });
      const { accessToken } = response.data;

      localStorage.setItem("token", accessToken);

      const decodedUser = jwtDecode<User>(accessToken);
      setUser(decodedUser);

      navigate("/pos");
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
