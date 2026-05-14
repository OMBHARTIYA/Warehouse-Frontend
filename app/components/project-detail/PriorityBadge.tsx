import type { TaskPriority } from "./types";

type PriorityBadgeProps = {
  priority: string;
};

const priorityClasses: Record<TaskPriority, string> = {
  low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  high: "bg-orange-50 text-orange-700 border-orange-200",
  critical: "bg-red-50 text-red-700 border-red-200",
};

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const normalized = (priority as TaskPriority) in priorityClasses ? (priority as TaskPriority) : "medium";
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${priorityClasses[normalized]}`}>
      {priority}
    </span>
  );
}
