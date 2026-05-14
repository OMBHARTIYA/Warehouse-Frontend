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
    <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white shadow-sm">
      <table className="min-w-full text-left text-sm text-zinc-700">
        <thead className="bg-zinc-50 text-xs uppercase text-zinc-600">
          <tr>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3">Assignee</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className="border-t border-zinc-200">
              <td className="px-4 py-3 text-zinc-900">{task.title}</td>
              <td className="px-4 py-3">
                <StatusBadge status={task.status} />
              </td>
              <td className="px-4 py-3">
                <PriorityBadge priority={task.priority} />
              </td>
              <td className="px-4 py-3">{task.assignee ?? task.assigneeId ?? "Unassigned"}</td>
              <td className="px-4 py-3">{task.created_at ? new Date(task.created_at).toLocaleString() : "N/A"}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(task)}
                    className="rounded-md border border-zinc-300 px-2 py-1 text-xs font-medium text-zinc-700"
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
