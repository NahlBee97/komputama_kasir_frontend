export type Role = "ADMIN" | "CASHIER";
export type OrderStatus = "COMPLETED" | "VOID";

export interface User {
  id: number;
  name: string;
  role: Role;
}


