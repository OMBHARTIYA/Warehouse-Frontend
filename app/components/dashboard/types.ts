export type MetricRow = {
  label: string;
  count: number;
};

export type RecentTask = {
  id: string | number;
  title: string;
  status?: string;
  priority?: string;
  projectName?: string;
  projectId?: string | number;
  project?: { id?: string | number; name?: string };
  assigneeName?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ProjectStat = {
  projectId?: string | number;
  id?: string | number;
  projectName?: string;
  name?: string;
  criticalTaskCount?: number;
  criticalTasks?: number;
  totalTasks?: number;
  completedTasks?: number;
  completionRate?: number;
};

export type UserActivity = {
  userId?: string | number;
  user_id?: string | number;
  id?: string | number;
  userName?: string;
  user_name?: string;
  name?: string;
  assignedTasks?: number;
  assigned_tasks?: number;
  completedTasks?: number;
  completed_tasks?: number;
  completionRate?: number;
  completion_rate?: number;
};

