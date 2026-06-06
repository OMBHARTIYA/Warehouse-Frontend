export type Project = {
  id: string | number;
  code?: string | null;
  name: string;
  description: string | null;
  address?: string | null;
  manager_id?: string | number | null;
  manager_name?: string | null;
  owner_id?: string | number | null;
  owner?: string | null;
  owner_name?: string | null;
  owner_username?: string | null;
  owner_email?: string | null;
  created_at: string;
  product_count?: number;
  total_units?: number;
};

export type ProjectTaskSummary = {
  total: number;
  completed: number;
  inProgress: number;
  critical: number;
};

export type SortBy = "name-asc" | "name-desc" | "date-asc" | "date-desc";
