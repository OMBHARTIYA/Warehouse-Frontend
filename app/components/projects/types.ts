export type Project = {
  id: string | number;
  name: string;
  description: string | null;
  owner_id: string | number;
  owner?: string | null;
  owner_name?: string | null;
  owner_username?: string | null;
  owner_email?: string | null;
  created_at: string;
};

export type ProjectTaskSummary = {
  total: number;
  completed: number;
  inProgress: number;
  critical: number;
};

export type SortBy = "name-asc" | "name-desc" | "date-asc" | "date-desc";
