import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import type { MetricRow, ProjectStat, RecentTask, UserActivity } from "../types";

type DashboardStatistics = {
  totalProjects?: number;
  totalTasks?: number;
  completedTasks?: number;
  completionRate?: number;
  tasksByStatus?: MetricRow[];
  tasksByPriority?: MetricRow[];
  recentTasks?: RecentTask[];
  projectStats?: ProjectStat[];
  userActivity?: UserActivity[];
};

function normalizeRecentTasks(value: unknown): RecentTask[] {
  if (!Array.isArray(value)) return [];
  const rows: RecentTask[] = [];
  for (const row of value) {
    if (typeof row !== "object" || row === null) continue;
    const source = row as Record<string, unknown>;
    rows.push({
      id: (source.id ?? source.taskId ?? source.task_id ?? `${Math.random()}`) as string | number,
      title: String(source.title ?? source.taskTitle ?? source.task_title ?? "Untitled"),
      status: (source.status as string | undefined) ?? undefined,
      priority: (source.priority as string | undefined) ?? undefined,
      projectName: (source.projectName ?? source.project_name ?? source.project_title) as string | undefined,
      projectId: (source.projectId ?? source.project_id) as string | number | undefined,
      project: typeof source.project === "object" && source.project !== null ? (source.project as { id?: string | number; name?: string }) : undefined,
      assigneeName: (source.assigneeName ?? source.assignee_name) as string | undefined,
      createdAt: (source.createdAt ?? source.created_at) as string | undefined,
      updatedAt: (source.updatedAt ?? source.updated_at) as string | undefined,
    });
  }
  return rows;
}

function normalizeProjectStats(value: unknown): ProjectStat[] {
  if (!Array.isArray(value)) return [];
  const rows: ProjectStat[] = [];
  for (const row of value) {
    if (typeof row !== "object" || row === null) continue;
    const source = row as Record<string, unknown>;
    const totalTasks = toNumber(source.totalTasks ?? source.total_tasks);
    const completedTasks = toNumber(source.completedTasks ?? source.completed_tasks ?? source.doneTasks ?? source.done_tasks);
    const completionRateValue = source.completionRate ?? source.completion_rate;
    rows.push({
      projectId: (source.projectId ?? source.project_id ?? source.id) as string | number | undefined,
      id: (source.id ?? source.projectId ?? source.project_id) as string | number | undefined,
      projectName: (source.projectName ?? source.project_name ?? source.name) as string | undefined,
      name: (source.name ?? source.projectName ?? source.project_name) as string | undefined,
      totalTasks,
      completedTasks,
      completionRate: completionRateValue != null ? toNumber(completionRateValue) : (totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0),
      criticalTaskCount: toNumber(source.criticalTaskCount ?? source.critical_task_count ?? source.criticalTasks ?? source.critical_tasks),
    });
  }
  return rows;
}

function normalizeUserActivityRows(value: unknown): UserActivity[] {
  if (!Array.isArray(value)) return [];
  const rows: UserActivity[] = [];
  for (const row of value) {
    if (typeof row !== "object" || row === null) continue;
    const source = row as Record<string, unknown>;
    const assignedTasks = toNumber(source.assignedTasks ?? source.assigned_tasks ?? source.tasksAssigned ?? source.tasks_assigned);
    const completedTasks = toNumber(source.completedTasks ?? source.completed_tasks ?? source.tasksCompleted ?? source.tasks_completed);
    const completionRateValue = source.completionRate ?? source.completion_rate;
    rows.push({
      userId: (source.userId ?? source.user_id ?? source.id) as string | number | undefined,
      userName: (source.userName ?? source.user_name ?? source.name ?? source.username ?? source.email) as string | undefined,
      assignedTasks,
      completedTasks,
      completionRate: completionRateValue != null ? toNumber(completionRateValue) : (assignedTasks > 0 ? (completedTasks / assignedTasks) * 100 : 0),
    });
  }
  return rows;
}

function normalizeMetricRows(value: unknown): MetricRow[] {
  if (!Array.isArray(value)) return [];
  return value.map((row) => {
    if (typeof row !== "object" || row === null) return null;
    const source = row as Record<string, unknown>;
    const label = typeof source.label === "string" ? source.label : typeof source.status === "string" ? source.status : typeof source.priority === "string" ? source.priority : "Unknown";
    const rawCount = source.count ?? source.total ?? source.value;
    const count = typeof rawCount === "number" ? rawCount : Number(rawCount ?? 0);
    if (Number.isNaN(count)) return null;
    return { label, count };
  }).filter((row): row is MetricRow => row !== null);
}

function toNumber(value: unknown): number { const parsed = Number(value ?? 0); return Number.isFinite(parsed) ? parsed : 0; }

function normalizePriorityBuckets(rows: MetricRow[]) {
  const buckets = { critical: 0, high: 0, medium: 0, low: 0 };
  for (const row of rows) {
    const key = row.label.trim().toLowerCase();
    if (key in buckets) buckets[key as keyof typeof buckets] += row.count;
  }
  return [
    { label: "Critical", count: buckets.critical, color: "#dc2626" },
    { label: "High", count: buckets.high, color: "#f97316" },
    { label: "Medium", count: buckets.medium, color: "#eab308" },
    { label: "Low", count: buckets.low, color: "#16a34a" },
  ];
}

function normalizeStatistics(payload: unknown): DashboardStatistics | null {
  if (typeof payload !== "object" || payload === null) return null;
  const root = payload as Record<string, unknown>;
  const dataRoot = (typeof root.data === "object" && root.data !== null ? (root.data as Record<string, unknown>) : null) ?? (typeof root.statistics === "object" && root.statistics !== null ? (root.statistics as Record<string, unknown>) : null) ?? root;
  const overview = (typeof dataRoot.overview === "object" && dataRoot.overview !== null ? (dataRoot.overview as Record<string, unknown>) : null) ?? dataRoot;
  return {
    totalProjects: toNumber(overview.totalProjects ?? overview.total_projects),
    totalTasks: toNumber(overview.totalTasks ?? overview.total_tasks),
    completedTasks: toNumber(overview.completedTasks ?? overview.completed_tasks),
    completionRate: toNumber(overview.completionRate ?? overview.completion_rate),
    tasksByStatus: normalizeMetricRows(dataRoot.tasksByStatus ?? dataRoot.tasks_by_status),
    tasksByPriority: normalizeMetricRows(dataRoot.tasksByPriority ?? dataRoot.tasks_by_priority),
    recentTasks: normalizeRecentTasks(dataRoot.recentTasks ?? dataRoot.recent_tasks),
    projectStats: normalizeProjectStats(dataRoot.projectStats ?? dataRoot.project_stats),
    userActivity: normalizeUserActivityRows(dataRoot.userActivity ?? dataRoot.user_activity),
  };
}

export function useDashboardStats() {
  const [data, setData] = useState<DashboardStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const fetchStatistics = async (showLoader: boolean) => {
      if (showLoader) setLoading(true);
      setError(null);
      try {
        const response = await api.get("/api/statistics");
        setData(normalizeStatistics(response.data));
      } catch {
        setError("Could not load dashboard statistics.");
        if (showLoader) setData(null);
      } finally {
        if (showLoader) setLoading(false);
      }
    };

    void fetchStatistics(true);

    const handleWindowFocus = () => {
      void fetchStatistics(false);
    };

    const intervalId = window.setInterval(() => {
      void fetchStatistics(false);
    }, 15000);

    window.addEventListener("focus", handleWindowFocus);
    return () => {
      window.removeEventListener("focus", handleWindowFocus);
      window.clearInterval(intervalId);
    };
  }, []);

  const tasksByStatus = useMemo(() => normalizeMetricRows(data?.tasksByStatus), [data?.tasksByStatus]);
  const tasksByPriority = useMemo(() => normalizeMetricRows(data?.tasksByPriority), [data?.tasksByPriority]);
  const priorityBars = useMemo(() => normalizePriorityBuckets(tasksByPriority), [tasksByPriority]);
  const recentTasks = Array.isArray(data?.recentTasks) ? data.recentTasks : [];
  const projectStats = useMemo(() => {
    const rows = Array.isArray(data?.projectStats) ? data.projectStats : [];
    return [...rows].sort((a, b) => {
      const totalDiff = (b.totalTasks ?? 0) - (a.totalTasks ?? 0);
      if (totalDiff !== 0) return totalDiff;
      const completionDiff = (b.completionRate ?? 0) - (a.completionRate ?? 0);
      if (completionDiff !== 0) return completionDiff;
      return String(a.projectName ?? a.name ?? "").localeCompare(String(b.projectName ?? b.name ?? ""));
    });
  }, [data]);
  const userActivity = Array.isArray(data?.userActivity) ? data.userActivity : [];

  const hasAnyData = Boolean(data) && ((data?.totalProjects ?? 0) > 0 || (data?.totalTasks ?? 0) > 0 || tasksByStatus.length > 0 || tasksByPriority.length > 0 || recentTasks.length > 0 || projectStats.length > 0 || userActivity.length > 0);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredRecentTasks = !normalizedQuery ? recentTasks : recentTasks.filter((task) => [task.title, task.status, task.priority, task.projectName, task.project?.name, task.assigneeName].some((value) => typeof value === "string" && value.toLowerCase().includes(normalizedQuery)));
  const searchSuggestions = normalizedQuery ? recentTasks.filter((task) => [task.title, task.projectName, task.project?.name].some((value) => typeof value === "string" && value.toLowerCase().includes(normalizedQuery))).slice(0, 6) : [];

  return { data, loading, error, searchQuery, isSearchFocused, tasksByStatus, priorityBars, filteredRecentTasks, projectStats, userActivity, hasAnyData, normalizedQuery, searchSuggestions, setSearchQuery, setIsSearchFocused };
}

export function percent(value: number): string { return `${Number.isFinite(value) ? value.toFixed(1) : "0.0"}%`; }
