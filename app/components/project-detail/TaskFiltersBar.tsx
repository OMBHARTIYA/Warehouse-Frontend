import type { User, TaskPriority, TaskStatus } from "./types";
import { getUserLabel, TASK_PRIORITY_OPTIONS, TASK_STATUS_OPTIONS } from "./utils";
import FilterDropdown from "../common/FilterDropdown";

type TaskFiltersBarProps = {
  users: User[];
  statusFilter: TaskStatus | "all";
  priorityFilter: TaskPriority | "all";
  assigneeFilter: string;
  onStatusChange: (value: TaskStatus | "all") => void;
  onPriorityChange: (value: TaskPriority | "all") => void;
  onAssigneeChange: (value: string) => void;
  onReset: () => void;
};

export default function TaskFiltersBar({
  users,
  statusFilter,
  priorityFilter,
  assigneeFilter,
  onStatusChange,
  onPriorityChange,
  onAssigneeChange,
  onReset,
}: TaskFiltersBarProps) {
  const assigneeOptions = [
    { value: "all", label: "all" },
    { value: "", label: "Unassigned" },
    ...users.map((user) => ({ value: String(user.id), label: getUserLabel(user) })),
  ];

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm ring-1 ring-zinc-200/80 sm:flex-row sm:items-end sm:p-6">
      <FilterDropdown
        id="status-filter"
        label="Status"
        value={statusFilter}
        options={TASK_STATUS_OPTIONS.map((value) => ({ value, label: value }))}
        onChange={onStatusChange}
      />
      <FilterDropdown
        id="priority-filter"
        label="Priority"
        value={priorityFilter}
        options={TASK_PRIORITY_OPTIONS.map((value) => ({ value, label: value }))}
        onChange={onPriorityChange}
      />
      <FilterDropdown id="assignee-filter" label="Assignee" value={assigneeFilter} options={assigneeOptions} onChange={onAssigneeChange} />
      <button
        type="button"
        onClick={onReset}
        className="h-11 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-red-200"
      >
        Reset filters
      </button>
    </div>
  );
}
