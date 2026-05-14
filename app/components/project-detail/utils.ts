import type { TaskPriority, TaskStatus, User } from "./types";

export const TASK_STATUS_OPTIONS: Array<TaskStatus | "all"> = ["all", "todo", "in_progress", "done"];
export const TASK_PRIORITY_OPTIONS: Array<TaskPriority | "all"> = ["all", "low", "medium", "high", "critical"];

export const getUserLabel = (user: User) => user.name?.trim() || user.email || `User ${user.id}`;
