import type { Task } from "./types";
import {
  formatEntityLabel,
  formatPriorityLabel,
  formatStatusLabel,
  getPriorityBadgeClass,
  getStatusBadgeClass,
} from "./taskUtils";

function resolveProjectName(task: Task): string {
  return (
    formatEntityLabel(task.projectName, "") ||
    formatEntityLabel(task.project_name, "") ||
    formatEntityLabel(task.project, "") ||
    (task.projectId ?? task.project_id ? `Project #${String(task.projectId ?? task.project_id)}` : "Unknown project")
  );
}

function resolveAssigneeName(task: Task): string {
  return (
    formatEntityLabel(task.assigneeName, "") ||
    formatEntityLabel(task.assignee_name, "") ||
    formatEntityLabel(task.assignee, "") ||
    "Unassigned"
  );
}

function getAssigneeAvatarClass(assigneeValue: string) {
  return assigneeValue.toLowerCase() === "unassigned"
    ? "bg-zinc-100 text-zinc-500 ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700"
    : "bg-rose-50 text-[var(--brand-red-strong)] ring-rose-100 dark:bg-rose-950/60 dark:text-rose-200 dark:ring-rose-900/70";
}

export default function TasksTable({ tasks }: { tasks: Task[] }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition-colors dark:border-zinc-700 dark:bg-[var(--surface-2)] dark:shadow-black/20">
      <div className="overflow-x-auto">
        <table className="min-w-[980px] text-left text-sm text-zinc-700 dark:text-zinc-300">
          <thead className="bg-gradient-to-r from-zinc-50 to-white text-[11px] uppercase tracking-[0.14em] text-zinc-500 dark:from-zinc-900/80 dark:to-zinc-950/60 dark:text-zinc-400">
            <tr>
              <th className="w-12 px-4 py-4 font-bold">#</th>
              <th className="px-4 py-4 font-bold">Title</th>
              <th className="px-4 py-4 font-bold">Description</th>
              <th className="px-4 py-4 font-bold">Status</th>
              <th className="px-4 py-4 font-bold">Priority</th>
              <th className="px-4 py-4 font-bold">Project</th>
              <th className="px-4 py-4 font-bold">Assignee</th>
              <th className="px-4 py-4 text-right font-bold">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {tasks.map((task, index) => {
              const projectValue = resolveProjectName(task);
              const assigneeValue = resolveAssigneeName(task);
              const assigneeAvatarClass = getAssigneeAvatarClass(assigneeValue);

              return (
                <tr key={task.id} className="group transition-colors hover:bg-rose-50/30 dark:hover:bg-rose-950/10">
                  <td className="px-4 py-4 align-middle font-semibold text-zinc-400 group-hover:text-[var(--brand-red-strong)] dark:text-zinc-500 dark:group-hover:text-rose-300">{index + 1}</td>
                  <td className="px-4 py-4 align-middle">
                    <div className="max-w-[220px]">
                      <p className="truncate font-semibold text-zinc-900 transition-colors group-hover:text-[var(--brand-red-strong)] dark:text-zinc-100 dark:group-hover:text-rose-200">{task.title}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <p className="line-clamp-2 max-w-xs text-sm leading-5 text-zinc-500 dark:text-zinc-400">
                      {task.description?.trim() ? task.description : "No description"}
                    </p>
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <span className={`inline-flex whitespace-nowrap items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${getStatusBadgeClass(task.status)}`}>
                      {formatStatusLabel(task.status)}
                    </span>
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <span className={`inline-flex whitespace-nowrap items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${getPriorityBadgeClass(task.priority)}`}>
                      {formatPriorityLabel(task.priority)}
                    </span>
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <span className="inline-flex max-w-[180px] truncate rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-semibold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-200">
                      {projectValue}
                    </span>
                  </td>
                  <td className="px-4 py-4 align-middle text-zinc-700 dark:text-zinc-300">
                    <span className="inline-flex items-center gap-2">
                      <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold uppercase ring-1 ${assigneeAvatarClass}`}>
                        {assigneeValue.charAt(0)}
                      </span>
                      <span className="max-w-[130px] truncate font-medium">{assigneeValue}</span>
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-right align-middle text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    {task.created_at ? new Date(task.created_at).toLocaleDateString() : "N/A"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
