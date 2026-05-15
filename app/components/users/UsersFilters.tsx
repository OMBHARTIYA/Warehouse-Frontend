import FilterDropdown from "../common/FilterDropdown";

type UsersFiltersProps = {
  searchQuery: string;
  roleFilter: "all" | "admin" | "user";
  onSearchChange: (value: string) => void;
  onRoleChange: (value: "all" | "admin" | "user") => void;
  onReset: () => void;
};

export default function UsersFilters({ searchQuery, roleFilter, onSearchChange, onRoleChange, onReset }: UsersFiltersProps) {
  const hasActiveFilters = searchQuery.trim().length > 0 || roleFilter !== "all";

  return (
    <section className="rounded-3xl border border-[var(--border-soft)] bg-white p-4 shadow-sm transition-colors dark:bg-[var(--surface-2)] dark:shadow-black/20 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid flex-1 gap-4 sm:grid-cols-[minmax(0,1fr)_220px] lg:max-w-3xl">
          <div className="space-y-1.5">
            <label htmlFor="users-search" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Search users
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">
                ⌕
              </span>
              <input
                id="users-search"
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by username or email"
                className="h-11 w-full rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] py-2 pl-9 pr-3.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-[var(--brand-red-border)] focus:bg-white focus:ring-2 focus:ring-[var(--brand-red-soft)] dark:bg-zinc-900/70 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:bg-zinc-900"
              />
            </div>
          </div>

          <FilterDropdown
            id="users-role-filter"
            label="Role"
            value={roleFilter}
            onChange={onRoleChange}
            className="space-y-1.5"
            options={[
              { value: "all", label: "All roles" },
              { value: "admin", label: "Admins" },
              { value: "user", label: "Members" },
            ]}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {hasActiveFilters && (
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-xs font-semibold text-[var(--brand-red-strong)] dark:border-rose-900/70 dark:bg-rose-950/50 dark:text-rose-200">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-red)]" />
              Filters active
            </span>
          )}

          <button
            type="button"
            onClick={onReset}
            disabled={!hasActiveFilters}
            className={`h-11 rounded-2xl px-4 py-2 text-sm font-semibold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-[var(--brand-red-soft)] ${
              hasActiveFilters
                ? "border border-[var(--brand-red-border)] bg-[var(--brand-red)] text-white hover:-translate-y-0.5 hover:bg-[var(--brand-red-strong)] hover:shadow-md"
                : "border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}
            title={hasActiveFilters ? "Clear selected filters" : "No filters are active"}
          >
            Reset Filters
          </button>
        </div>
      </div>
    </section>
  );
}
