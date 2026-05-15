import type { PriorityFilter, StatusFilter } from "./types";
import FilterDropdown from "../common/FilterDropdown";

const STATUS_OPTIONS: StatusFilter[] = ["all", "todo", "in_progress", "done"];
const PRIORITY_OPTIONS: PriorityFilter[] = ["all", "low", "medium", "high", "critical"];

function formatStatusOption(value: StatusFilter) {
  if (value === "all") return "All statuses";
  if (value === "in_progress") return "In Progress";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatPriorityOption(value: PriorityFilter) {
  if (value === "all") return "All priorities";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

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
  const hasActiveFilters = statusFilter !== "all" || priorityFilter !== "all";

  return (
    <section className="rounded-3xl border border-[var(--border-soft)] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:max-w-xl">
          <FilterDropdown
            id="tasks-status-filter"
            label="Status"
            value={statusFilter}
            options={STATUS_OPTIONS.map((value) => ({ value, label: formatStatusOption(value) }))}
            onChange={onStatusChange}
            className="space-y-1.5"
          />
          <FilterDropdown
            id="tasks-priority-filter"
            label="Priority"
            value={priorityFilter}
            options={PRIORITY_OPTIONS.map((value) => ({ value, label: formatPriorityOption(value) }))}
            onChange={onPriorityChange}
            className="space-y-1.5"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {hasActiveFilters && (
            <span className="inline-flex items-center rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-xs font-semibold text-[var(--brand-red-strong)]">
              Filters active
            </span>
          )}

          <button
            type="button"
            onClick={onReset}
            className="h-11 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--brand-red-soft)] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!hasActiveFilters}
          >
            Reset Filters
          </button>
        </div>
      </div>
    </section>
  );
}
