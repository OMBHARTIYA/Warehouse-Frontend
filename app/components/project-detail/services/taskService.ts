import api from "../../../../lib/api";
import type { Task } from "../types";

function normalizeTask(task: Task): Task {
  return {
    ...task,
    assigneeId: task.assigneeId ?? task.assignee_id ?? null,
    assignee: task.assignee ?? task.assigneeName ?? task.assignee_name ?? null,
  };
}

export async function getProjectTasks(projectId: string) {
  const response = await api.get("/api/tasks", { params: { projectId } });
  const data = Array.isArray(response.data) ? response.data : response.data?.tasks;
  return (Array.isArray(data) ? data : []).map((task) => normalizeTask(task as Task));
}

export async function createTask(payload: {
  title: string;
  description: string;
  priority: string;
  status: "todo";
  projectId: string;
  assigneeId: string | null;
}) {
  await api.post("/api/tasks", payload);
}

export async function updateTask(taskId: string | number, payload: Record<string, unknown>) {
  await api.put(`/api/tasks/${taskId}`, payload);
}

export async function deleteTask(taskId: string | number) {
  await api.delete(`/api/tasks/${taskId}`);
}
