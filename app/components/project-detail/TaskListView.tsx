import PriorityBadge from "./PriorityBadge";
import StatusBadge from "./StatusBadge";
import type { Task } from "./types";

type TaskListViewProps = {
  tasks: Task[];
  activeTaskActionId: string | number | null;
  activeTaskActionType: "edit" | "delete" | null;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
};

function assigneeLabel(task: Task) {
  return task.assignee ?? task.assigneeName ?? task.assignee_name ?? "Unassigned";
}

export default function TaskListView({
  tasks,
  activeTaskActionId,
  activeTaskActionType,
  onEdit,
  onDelete,
}: TaskListViewProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm transition-colors dark:border-zinc-700 dark:bg-[var(--surface-2)] dark:shadow-black/20">
      <table className="min-w-[760px] text-left text-sm text-zinc-700 dark:text-zinc-300 sm:min-w-full">
        <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:bg-zinc-900/60 dark:text-zinc-400">
          <tr>
            <th className="px-4 py-3.5">Title</th>
            <th className="px-4 py-3.5">Status</th>
            <th className="px-4 py-3.5">Priority</th>
            <th className="px-4 py-3.5">Assignee</th>
            <th className="px-4 py-3.5">Created</th>
            <th className="px-4 py-3.5">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className="border-t border-zinc-200 transition-colors hover:bg-zinc-50/70 dark:border-zinc-800 dark:hover:bg-zinc-900/50">
              <td className="px-4 py-3.5 font-medium text-zinc-900 dark:text-zinc-100">{task.title}</td>
              <td className="px-4 py-3.5">
                <StatusBadge status={task.status} />
              </td>
              <td className="px-4 py-3.5">
                <PriorityBadge priority={task.priority} />
              </td>
              <td className="px-4 py-3.5">{assigneeLabel(task)}</td>
              <td className="whitespace-nowrap px-4 py-3.5">{task.created_at ? new Date(task.created_at).toLocaleDateString() : "N/A"}</td>
              <td className="px-4 py-3.5">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(task)}
                    className="rounded-md border border-zinc-300 px-2.5 py-1 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(task)}
                    disabled={activeTaskActionId === task.id && activeTaskActionType === "delete"}
                    className="rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
                  >
                    {activeTaskActionId === task.id && activeTaskActionType === "delete" ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
