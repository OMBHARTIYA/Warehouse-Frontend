import PriorityBadge from "./PriorityBadge";
import StatusBadge from "./StatusBadge";
import type { Task } from "./types";

type TaskListViewProps = {
  tasks: Task[];
  activeTaskActionId: string | number | null;
  activeTaskActionType: "edit" | "delete" | null;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string | number) => void;
};

export default function TaskListView({
  tasks,
  activeTaskActionId,
  activeTaskActionType,
  onEdit,
  onDelete,
}: TaskListViewProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <table className="min-w-[760px] text-left text-sm text-zinc-700 sm:min-w-full">
        <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
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
            <tr key={task.id} className="border-t border-zinc-200 transition-colors hover:bg-zinc-50/70">
              <td className="px-4 py-3.5 font-medium text-zinc-900">{task.title}</td>
              <td className="px-4 py-3.5">
                <StatusBadge status={task.status} />
              </td>
              <td className="px-4 py-3.5">
                <PriorityBadge priority={task.priority} />
              </td>
              <td className="px-4 py-3.5">{task.assignee ?? task.assigneeId ?? "Unassigned"}</td>
              <td className="whitespace-nowrap px-4 py-3.5">{task.created_at ? new Date(task.created_at).toLocaleString() : "N/A"}</td>
              <td className="px-4 py-3.5">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(task)}
                    className="rounded-md border border-zinc-300 px-2.5 py-1 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(task.id)}
                    disabled={activeTaskActionId === task.id && activeTaskActionType === "delete"}
                    className="rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white disabled:opacity-60"
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
