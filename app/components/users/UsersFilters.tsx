import FilterDropdown from "../common/FilterDropdown";

type UsersFiltersProps = {
  searchQuery: string;
  roleFilter: "all" | "admin" | "user";
  onSearchChange: (value: string) => void;
  onRoleChange: (value: "all" | "admin" | "user") => void;
  onReset: () => void;
};

export default function UsersFilters({ searchQuery, roleFilter, onSearchChange, onRoleChange, onReset }: UsersFiltersProps) {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-[var(--border-soft)] bg-white p-5 shadow-sm sm:flex-row sm:items-end sm:p-6">
      <div className="sm:w-80">
        <label htmlFor="users-search" className="text-sm font-medium text-zinc-700">Search users</label>
        <input
          id="users-search"
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by username or email"
          className="mt-1 h-11 w-full rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] px-3.5 text-sm text-zinc-900 outline-none transition focus:border-[var(--brand-red-border)] focus:ring-2 focus:ring-[var(--brand-red-soft)]"
        />
      </div>

      <FilterDropdown
        id="users-role-filter"
        label="Role"
        value={roleFilter}
        onChange={onRoleChange}
        className="space-y-1.5 sm:w-52"
        options={[
          { value: "all", label: "All roles" },
          { value: "admin", label: "Admins" },
          { value: "user", label: "Members" },
        ]}
      />

      <button
        type="button"
        onClick={onReset}
        className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 sm:ml-auto"
      >
        Reset Filters
      </button>
    </div>
  );
}
