import { UserRole } from "@/types/auth";

export type AdminUser = {
  id?: string | number;
  username?: string;
  email?: string;
  role?: string;
  created_at?: string;
  createdAt?: string;
};

export function normalizeUsers(payload: unknown): AdminUser[] {
  if (Array.isArray(payload)) return payload as AdminUser[];
  if (typeof payload === "object" && payload !== null) {
    const source = payload as Record<string, unknown>;
    if (Array.isArray(source.users)) return source.users as AdminUser[];
    if (Array.isArray(source.data)) return source.data as AdminUser[];
  }
  return [];
}

export function formatDate(value?: string): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export function getRoleValue(role?: string): UserRole {
  return role === "admin" ? "admin" : "user";
}
