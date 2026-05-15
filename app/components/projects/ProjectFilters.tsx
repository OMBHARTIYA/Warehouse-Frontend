import type { SortBy } from "./types";
import FilterDropdown from "../common/FilterDropdown";

export default function ProjectFilters({
  searchQuery,
  sortBy,
  onSearchChange,
  onSortChange,
}: {
  searchQuery: string;
  sortBy: SortBy;
  onSearchChange: (value: string) => void;
  onSortChange: (value: SortBy) => void;
}) {
  const sortOptions: Array<{ value: SortBy; label: string }> = [
    { value: "name-asc", label: "Name A-Z" },
    { value: "name-desc", label: "Name Z-A" },
    { value: "date-asc", label: "Oldest first" },
    { value: "date-desc", label: "Newest first" },
  ];

  return (
    <section className="rounded-3xl border border-[var(--border-soft)] bg-white p-4 shadow-sm transition-colors dark:bg-[var(--surface-2)] dark:shadow-black/20 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-1.5">
          <label htmlFor="project-search" className="text-xs font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-300">
            Search projects
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">
              ⌕
            </span>
            <input
              id="project-search"
              type="text"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Type a project name..."
              className="h-11 w-full rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] py-2 pl-9 pr-3.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-[var(--brand-red-border)] focus:bg-white focus:ring-2 focus:ring-[var(--brand-red-soft)] dark:bg-zinc-900/70 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:bg-zinc-900"
            />
          </div>
        </div>

        <FilterDropdown
          id="project-sort"
          label="Sort"
          value={sortBy}
          options={sortOptions}
          onChange={onSortChange}
          className="space-y-1.5 sm:w-56"
        />
      </div>
    </section>
  );
}
