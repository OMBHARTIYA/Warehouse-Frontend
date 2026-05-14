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
    { value: "name-asc", label: "Name ASC" },
    { value: "name-desc", label: "Name DESC" },
    { value: "date-asc", label: "Date ASC" },
    { value: "date-desc", label: "Date DESC" },
  ];

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-2)] p-5 sm:flex-row sm:items-end sm:p-6">
      <div className="flex-1 space-y-1.5">
        <label htmlFor="project-search" className="text-sm font-medium text-zinc-700">
          Search by name
        </label>
        <input
          id="project-search"
          type="text"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Type a project name..."
          className="h-11 w-full rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] px-3.5 py-2 text-sm text-zinc-900 outline-none transition focus:border-[var(--brand-red-border)] focus:ring-2 focus:ring-[var(--brand-red-soft)]"
        />
      </div>
      <FilterDropdown id="project-sort" label="Sort" value={sortBy} options={sortOptions} onChange={onSortChange} />
    </div>
  );
}
