import api from "@/lib/api";
import type { UserRole } from "@/types/auth";
import type { AdminUser } from "../types";
import { normalizeUsers } from "../types";

export async function getUsers(): Promise<AdminUser[]> {
  const response = await api.get("/api/users");
  return normalizeUsers(response.data);
}

export async function updateUserRole(userId: string | number, role: UserRole) {
  await api.put(`/api/users/${userId}`, { role });
}

export async function deleteUser(userId: string | number) {
  await api.delete(`/api/users/${userId}`);
}

export async function resetUserPassword(userId: string | number, password: string) {
  await api.put(`/api/users/${userId}`, { password });
}
