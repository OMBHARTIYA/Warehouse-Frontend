import type { RecentTask } from "./types";

function statusBadgeClass(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === "done") return "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-800";
  if (normalized === "in_progress") return "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:ring-amber-800";
  return "bg-zinc-100 text-zinc-700 ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700";
}

function priorityBadgeClass(priority: string) {
  const normalized = priority.toLowerCase();
  if (normalized === "critical") return "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:ring-rose-800";
  if (normalized === "high") return "bg-orange-50 text-orange-700 ring-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:ring-orange-800";
  if (normalized === "medium") return "bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:ring-sky-800";
  return "bg-zinc-100 text-zinc-700 ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700";
}

export default function RecentTasksSection({ tasks, emptyMessage }: { tasks: RecentTask[]; emptyMessage: string }) {
  return (
    <section className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition-colors dark:border-zinc-700 dark:bg-[var(--surface-2)] dark:shadow-black/20 sm:p-5">
      <h3 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-lg">Recent Tasks</h3>
      {tasks.length === 0 ? (
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">{emptyMessage}</p>
      ) : (
        <ul className="mt-3 space-y-2.5">
          {tasks.map((task, index) => (
            <li key={String(task.id ?? index)} className="rounded-xl border border-zinc-200/80 bg-zinc-50/70 px-3 py-2.5 transition-colors dark:border-zinc-700 dark:bg-zinc-900/60">
              <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100 sm:text-[15px]">{task.title}</p>
              <p className="mt-1 truncate text-xs text-zinc-600 dark:text-zinc-400 sm:text-sm">
                {task.projectName ??
                  (typeof task.project === "string" ? task.project : undefined) ??
                  task.project?.name ??
                  (task.projectId ?? task.project?.id ? `Project #${String(task.projectId ?? task.project?.id)}` : "Unknown project")}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium capitalize ring-1 ${statusBadgeClass(task.status ?? "unknown")}`}>
                  {(task.status ?? "Unknown status").replace("_", " ")}
                </span>
                <span className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium capitalize ring-1 ${priorityBadgeClass(task.priority ?? "unknown")}`}>
                  {task.priority ?? "Unknown priority"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
