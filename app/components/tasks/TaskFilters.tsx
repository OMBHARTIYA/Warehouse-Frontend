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
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">Filter tasks</p>
          <p className="mt-1 text-sm text-zinc-500">Narrow the list by delivery status or priority.</p>
        </div>

        {hasActiveFilters ? (
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-xs font-semibold text-[var(--brand-red-strong)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-red)]" />
            Filters active
          </span>
        ) : (
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold text-zinc-500">
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
            Showing all tasks
          </span>
        )}
      </div>

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

        <button
          type="button"
          onClick={onReset}
          className={`h-11 rounded-2xl px-4 py-2 text-sm font-semibold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-[var(--brand-red-soft)] ${
            hasActiveFilters
              ? "border border-[var(--brand-red-border)] bg-[var(--brand-red)] text-white hover:-translate-y-0.5 hover:bg-[var(--brand-red-strong)] hover:shadow-md"
              : "border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50"
          }`}
          disabled={!hasActiveFilters}
          title={hasActiveFilters ? "Clear selected filters" : "No filters are active"}
        >
          Reset Filters
        </button>
      </div>
    </section>
  );
}
