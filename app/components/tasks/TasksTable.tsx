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

export default function TasksTable({ tasks }: { tasks: Task[] }) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-zinc-200 bg-white shadow-sm">
      <table className="min-w-[980px] text-left text-sm text-zinc-700">
        <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
          <tr>
            <th className="px-4 py-3.5 font-semibold">#</th>
            <th className="px-4 py-3.5 font-semibold">Title</th>
            <th className="px-4 py-3.5 font-semibold">Description</th>
            <th className="px-4 py-3.5 font-semibold">Status</th>
            <th className="px-4 py-3.5 font-semibold">Priority</th>
            <th className="px-4 py-3.5 font-semibold">Project</th>
            <th className="px-4 py-3.5 font-semibold">Assignee</th>
            <th className="px-4 py-3.5 font-semibold text-right">Created</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => {
            const projectValue = resolveProjectName(task);
            const assigneeValue = resolveAssigneeName(task);

            return (
              <tr key={task.id} className="border-t border-zinc-100 first:border-t-0 transition-colors hover:bg-zinc-50/80">
                <td className="px-4 py-4 font-medium text-zinc-500">{index + 1}</td>
                <td className="px-4 py-4 font-semibold text-zinc-900">{task.title}</td>
                <td className="max-w-xs px-4 py-4 text-zinc-600">{task.description?.trim() ? task.description : "No description"}</td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${getStatusBadgeClass(task.status)}`}>
                    {formatStatusLabel(task.status)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${getPriorityBadgeClass(task.priority)}`}>
                    {formatPriorityLabel(task.priority)}
                  </span>
                </td>
                <td className="px-4 py-4 font-medium text-zinc-700">{projectValue}</td>
                <td className="px-4 py-4 text-zinc-700">{assigneeValue}</td>
                <td className="whitespace-nowrap px-4 py-4 text-right text-zinc-500">
                  {task.created_at ? new Date(task.created_at).toLocaleDateString() : "N/A"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
