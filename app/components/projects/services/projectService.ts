import api from "@/lib/api";
import type { Project } from "../types";

type WarehousePayload = {
  code: string;
  name: string;
  description: string;
  address: string;
};

export async function getProjects(): Promise<Project[]> {
  const response = await api.get("/api/warehouses");
  const data = Array.isArray(response.data) ? response.data : response.data?.warehouses;
  return Array.isArray(data) ? (data as Project[]) : [];
}

export async function createProject(payload: WarehousePayload) {
  await api.post("/api/warehouses", {
    code: payload.code,
    name: payload.name,
    description: payload.description,
    address: payload.address,
  });
}

export async function updateProject(projectId: string | number, payload: WarehousePayload) {
  await api.put(`/api/warehouses/${projectId}`, {
    code: payload.code,
    name: payload.name,
    description: payload.description,
    address: payload.address,
  });
}

export async function deleteProject(projectId: string | number) {
  await api.delete(`/api/warehouses/${projectId}`);
}
