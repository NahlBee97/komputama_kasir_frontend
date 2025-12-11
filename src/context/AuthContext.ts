import { createContext } from "react";
import type { User } from "../interfaces/authInterfaces";

export interface AuthContextType {
  user: User | null;
  login: (role: string, pin: string) => boolean | Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
