export type Task = {
  id: string | number;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  projectId?: string | number | null;
  project_id?: string | number | null;
  project?: string | null;
  assigneeId?: string | number | null;
  assignee_id?: string | number | null;
  assignee?: string | null;
  created_at?: string | null;
};

export type StatusFilter = "all" | "todo" | "in_progress" | "done";
export type PriorityFilter = "all" | "low" | "medium" | "high" | "critical";
