export type UserRole = "admin" | "user";

export type User = {
  id?: string | number;
  username: string;
  email?: string;
  role?: UserRole | string;
};

export type LoginCredentials = {
  username: string;
  password: string;
};

export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
};
