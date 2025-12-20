import { useContext } from "react";
import { AuthContext, type AuthContextType } from "../context/AuthContext";

// 3. Create a custom hook to consume the context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
