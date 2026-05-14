import type { ProjectStat, RecentTask, UserActivity } from "./types";

function completionColor(value: number): string {
  if (value >= 70) return "#16a34a";
  if (value >= 40) return "#f97316";
  return "#dc2626";
}

function CompletionDonut({ value }: { value: number }) {
  const safeValue = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
  const radius = 7;
  const stroke = 3;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (safeValue / 100) * circumference;
  const color = completionColor(safeValue);

  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" className="shrink-0">
      <circle cx="10" cy="10" r={radius} fill="none" stroke="#e4e4e7" strokeWidth={stroke} />
      <circle
        cx="10"
        cy="10"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        transform="rotate(-90 10 10)"
      />
    </svg>
  );
}

function statusBadgeClass(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === "done") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (normalized === "in_progress") return "bg-amber-50 text-amber-700 ring-amber-200";
  return "bg-zinc-100 text-zinc-700 ring-zinc-200";
}

function priorityBadgeClass(priority: string) {
  const normalized = priority.toLowerCase();
  if (normalized === "critical") return "bg-rose-50 text-rose-700 ring-rose-200";
  if (normalized === "high") return "bg-orange-50 text-orange-700 ring-orange-200";
  if (normalized === "medium") return "bg-sky-50 text-sky-700 ring-sky-200";
  return "bg-zinc-100 text-zinc-700 ring-zinc-200";
}

export function RecentTasksSection({ tasks, emptyMessage }: { tasks: RecentTask[]; emptyMessage: string }) {
  return (
    <section className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
      <h3 className="text-base font-semibold tracking-tight text-zinc-900 sm:text-lg">Recent Tasks</h3>
      {tasks.length === 0 ? (
        <p className="mt-3 text-sm text-zinc-500">{emptyMessage}</p>
      ) : (
        <ul className="mt-3 space-y-2.5">
          {tasks.map((task, index) => (
            <li key={String(task.id ?? index)} className="rounded-xl border border-zinc-200/80 bg-zinc-50/70 px-3 py-2.5">
              <p className="truncate text-sm font-medium text-zinc-900 sm:text-[15px]">{task.title}</p>
              <p className="mt-1 truncate text-xs text-zinc-600 sm:text-sm">
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

export function ProjectStatsSection({ rows, percent }: { rows: ProjectStat[]; percent: (value: number) => string }) {
  return (
    <section className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
      <h3 className="text-base font-semibold tracking-tight text-zinc-900 sm:text-lg">Project Statistics</h3>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-zinc-500">No project statistics.</p>
      ) : (
        <div className="mt-3 w-full max-w-full overflow-x-auto">
          <table className="min-w-[640px] text-left text-sm sm:min-w-full">
            <thead>
              <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500">
                <th className="px-2 py-2 font-medium">Project</th>
                <th className="whitespace-nowrap px-2 py-2 text-right font-medium">Total</th>
                <th className="whitespace-nowrap px-2 py-2 text-right font-medium">Completed</th>
                <th className="whitespace-nowrap px-2 py-2 text-right font-medium">Completion</th>
                <th className="whitespace-nowrap px-2 py-2 text-right font-medium">Critical</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((project, index) => (
                <tr key={String(project.projectId ?? project.id ?? index)} className="border-b border-zinc-100/90 last:border-0">
                  <td className="px-2 py-2.5 text-zinc-900">
                    {project.projectName ?? project.name ?? (project.projectId ?? project.id ? `Project #${String(project.projectId ?? project.id)}` : "Untitled")}
                  </td>
                  <td className="whitespace-nowrap px-2 py-2.5 text-right tabular-nums text-zinc-700">{project.totalTasks ?? 0}</td>
                  <td className="whitespace-nowrap px-2 py-2.5 text-right tabular-nums text-zinc-700">{project.completedTasks ?? 0}</td>
                  <td className="whitespace-nowrap px-2 py-2.5 text-zinc-700">
                    <span className="inline-flex w-full items-center justify-end gap-2">
                      <CompletionDonut value={project.completionRate ?? 0} />
                      <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 tabular-nums text-zinc-800">{percent(project.completionRate ?? 0)}</span>
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-2 py-2.5 text-right tabular-nums text-zinc-700">{project.criticalTaskCount ?? project.criticalTasks ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

type UserActivityWithOptional = UserActivity & { username?: string; email?: string };

export function UserActivitySection({ rows, percent }: { rows: UserActivity[]; percent: (value: number) => string }) {
  if (rows.length === 0) return null;
  return (
    <section className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
      <h3 className="text-base font-semibold tracking-tight text-zinc-900 sm:text-lg">User Activity</h3>
      <div className="mt-3 w-full max-w-full overflow-x-auto">
        <table className="min-w-[560px] text-left text-sm sm:min-w-full">
          <thead>
            <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500">
              <th className="px-2 py-2 font-medium">User</th>
              <th className="whitespace-nowrap px-2 py-2 text-right font-medium">Assigned</th>
              <th className="whitespace-nowrap px-2 py-2 text-right font-medium">Completed</th>
              <th className="whitespace-nowrap px-2 py-2 text-right font-medium">Completion</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((user, index) => {
              const optional = user as UserActivityWithOptional;
              return (
                <tr key={String(user.userId ?? user.id ?? index)} className="border-b border-zinc-100/90 last:border-0">
                  <td className="px-2 py-2.5 text-zinc-900">{user.userName ?? user.user_name ?? user.name ?? optional.username ?? optional.email ?? "Unknown"}</td>
                  <td className="whitespace-nowrap px-2 py-2.5 text-right tabular-nums text-zinc-700">{user.assignedTasks ?? user.assigned_tasks ?? 0}</td>
                  <td className="whitespace-nowrap px-2 py-2.5 text-right tabular-nums text-zinc-700">{user.completedTasks ?? user.completed_tasks ?? 0}</td>
                  <td className="whitespace-nowrap px-2 py-2.5 text-zinc-700">
                    <span className="inline-flex w-full items-center justify-end gap-2">
                      <CompletionDonut value={user.completionRate ?? user.completion_rate ?? 0} />
                      <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 tabular-nums text-zinc-800">{percent(user.completionRate ?? user.completion_rate ?? 0)}</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
