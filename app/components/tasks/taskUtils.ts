export function getStatusBadgeClass(status: string): string {
  const normalized = status.trim().toLowerCase();
  if (normalized === "done") return "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/45 dark:text-emerald-300 dark:ring-emerald-900/70";
  if (normalized === "in_progress") return "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/45 dark:text-amber-300 dark:ring-amber-900/70";
  return "bg-zinc-100 text-zinc-700 ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700";
}

export function getPriorityBadgeClass(priority: string): string {
  const normalized = priority.trim().toLowerCase();
  if (normalized === "critical") return "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:ring-rose-900/70";
  if (normalized === "high") return "bg-orange-50 text-orange-700 ring-orange-200 dark:bg-orange-950/45 dark:text-orange-300 dark:ring-orange-900/70";
  if (normalized === "medium") return "bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-950/45 dark:text-sky-300 dark:ring-sky-900/70";
  return "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/45 dark:text-emerald-300 dark:ring-emerald-900/70";
}

export function formatStatusLabel(status: string): string {
  const normalized = status.trim().toLowerCase();
  if (normalized === "in_progress" || normalized === "in progress") return "In Progress";
  if (normalized === "done") return "Done";
  return "Todo";
}

export function formatPriorityLabel(priority: string): string {
  const normalized = priority.trim().toLowerCase();
  if (normalized === "critical") return "Critical";
  if (normalized === "high") return "High";
  if (normalized === "medium") return "Medium";
  return "Low";
}

export function formatEntityLabel(value: unknown, fallback: string): string {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number") return String(value);
  return fallback;
}
