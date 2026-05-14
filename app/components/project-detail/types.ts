export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high" | "critical";

export type Task = {
  id: string | number;
  title: string;
  description?: string | null;
  status: TaskStatus | string;
  priority: TaskPriority | string;
  assigneeId?: string | number | null;
  assignee_id?: string | number | null;
  assigneeName?: string | null;
  assignee_name?: string | null;
  assignee?: string | null;
  created_at?: string | null;
};

export type User = {
  id: string | number;
  name?: string | null;
  email?: string | null;
};

export type ProjectDetails = {
  id: string | number;
  name?: string | null;
  description?: string | null;
  owner?: string | null;
  owner_name?: string | null;
  owner_username?: string | null;
  owner_email?: string | null;
  owner_id?: string | number | null;
  created_at?: string | null;
};
