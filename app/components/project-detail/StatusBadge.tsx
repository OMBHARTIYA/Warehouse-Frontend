import type { TaskStatus } from "./types";

type StatusBadgeProps = {
  status: string;
};

const statusClasses: Record<TaskStatus, string> = {
  todo: "bg-zinc-100 text-zinc-700 border-zinc-200",
  in_progress: "bg-blue-50 text-blue-700 border-blue-200",
  done: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = (status as TaskStatus) in statusClasses ? (status as TaskStatus) : "todo";
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${statusClasses[normalized]}`}>
      {status}
    </span>
  );
}
