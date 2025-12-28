import { useState, type ReactNode } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../lib/axios";
import { jwtDecode } from "jwt-decode";
import type { User } from "../../interfaces/authInterfaces";

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

  const login = async (userId: number, pin: string) => {
    try {
      const response = await api.post("/api/auth/login", { userId, pin });
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
  
  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
      localStorage.removeItem("token");
      setUser(null);
      navigate("/");
      return true;
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
