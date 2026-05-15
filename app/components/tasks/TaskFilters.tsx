import type { PriorityFilter, StatusFilter } from "./types";
import FilterDropdown from "../common/FilterDropdown";

const STATUS_OPTIONS: StatusFilter[] = ["all", "todo", "in_progress", "done"];
const PRIORITY_OPTIONS: PriorityFilter[] = ["all", "low", "medium", "high", "critical"];

export default function TaskFilters({
  statusFilter,
  priorityFilter,
  onStatusChange,
  onPriorityChange,
  onReset,
}: {
  statusFilter: StatusFilter;
  priorityFilter: PriorityFilter;
  onStatusChange: (value: StatusFilter) => void;
  onPriorityChange: (value: PriorityFilter) => void;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-[var(--border-soft)] bg-white p-5 shadow-sm sm:flex-row sm:items-end sm:gap-3 sm:p-6">
      <FilterDropdown id="tasks-status-filter" label="Status" value={statusFilter} options={STATUS_OPTIONS.map((value) => ({ value, label: value === "in_progress" ? "In Progress" : value.charAt(0).toUpperCase() + value.slice(1) }))} onChange={onStatusChange} className="space-y-1.5 sm:w-56" />
      <FilterDropdown id="tasks-priority-filter" label="Priority" value={priorityFilter} options={PRIORITY_OPTIONS.map((value) => ({ value, label: value.charAt(0).toUpperCase() + value.slice(1) }))} onChange={onPriorityChange} className="space-y-1.5 sm:w-56" />
      <button
        type="button"
        onClick={onReset}
        className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-[var(--brand-red-soft)] sm:ml-auto"
      >
        Reset Filters
      </button>
    </div>
  );
}
