export function getStatusBadgeClass(status: string): string {
  const normalized = status.trim().toLowerCase();
  if (normalized === "done") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (normalized === "in_progress") return "bg-amber-50 text-amber-700 ring-amber-200";
  return "bg-red-50 text-red-700 ring-red-200";
}

export function getPriorityBadgeClass(priority: string): string {
  const normalized = priority.trim().toLowerCase();
  if (normalized === "critical") return "bg-red-100 text-red-800 ring-red-200";
  if (normalized === "high") return "bg-red-50 text-red-700 ring-red-200";
  if (normalized === "medium") return "bg-amber-50 text-amber-700 ring-amber-200";
  return "bg-emerald-50 text-emerald-700 ring-emerald-200";
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
