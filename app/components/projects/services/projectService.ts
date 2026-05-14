import api from "@/lib/api";
import type { Project } from "../types";

type ProjectPayload = {
  name: string;
  description: string;
};

export async function getProjects(): Promise<Project[]> {
  const response = await api.get("/api/projects");
  const data = Array.isArray(response.data) ? response.data : response.data?.projects;
  return Array.isArray(data) ? (data as Project[]) : [];
}

export async function createProject(payload: ProjectPayload) {
  await api.post("/api/projects", payload);
}

export async function updateProject(projectId: string | number, payload: ProjectPayload) {
  await api.put(`/api/projects/${projectId}`, payload);
}

export async function deleteProject(projectId: string | number) {
  await api.delete(`/api/projects/${projectId}`);
}
