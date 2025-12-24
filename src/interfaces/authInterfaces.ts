export type Role = "ADMIN" | "CASHIER";
export type Shift = "DAY" | "NIGHT";

export interface User {
  id: number;
  name: string;
  shift: Shift;
  role: Role;
  isActive?: boolean;
}


