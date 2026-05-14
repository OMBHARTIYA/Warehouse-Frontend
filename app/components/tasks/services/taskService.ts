import api from "@/lib/api";
import type { Task } from "../types";

export async function getTasks(): Promise<Task[]> {
  const response = await api.get("/api/tasks");
  const data = Array.isArray(response.data) ? response.data : response.data?.tasks;
  return Array.isArray(data) ? (data as Task[]) : [];
}
