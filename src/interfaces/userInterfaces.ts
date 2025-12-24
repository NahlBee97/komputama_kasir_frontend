export interface NewUser {
  name: string;
  shift: string;
  pin: string;
}

export interface UpdateUser {
  name?: string;
  shift?: string;
  pin?: string;
}
