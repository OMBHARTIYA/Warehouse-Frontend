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
    <div className="flex flex-col gap-4 rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-2)] p-5 sm:flex-row sm:items-end sm:p-6">
      <FilterDropdown id="tasks-status-filter" label="Status" value={statusFilter} options={STATUS_OPTIONS.map((value) => ({ value, label: value }))} onChange={onStatusChange} />
      <FilterDropdown id="tasks-priority-filter" label="Priority" value={priorityFilter} options={PRIORITY_OPTIONS.map((value) => ({ value, label: value }))} onChange={onPriorityChange} />
      <button
        type="button"
        onClick={onReset}
        className="h-11 rounded-full border border-[var(--border-soft)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-red-soft)]"
      >
        Reset filters
      </button>
    </div>
  );
}
