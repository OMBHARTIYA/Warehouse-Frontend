export default function ProjectsHeader({
  isCreateFormVisible,
  onToggleCreate,
}: {
  isCreateFormVisible: boolean;
  onToggleCreate: () => void;
}) {
  return (
    <header className="rounded-3xl border border-[var(--border-soft)] bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-red-strong)]">
            Workspace
          </p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            Projects
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500 sm:text-base">
            Manage your workspace projects, ownership, and delivery progress.
          </p>
        </div>

        <button
          type="button"
          onClick={onToggleCreate}
          className="inline-flex items-center justify-center rounded-full border border-[var(--brand-red-border)] bg-[var(--brand-red)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--brand-red-strong)] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--brand-red-soft)]"
        >
          {isCreateFormVisible ? "Cancel" : "Add Project"}
        </button>
      </div>
    </header>
  );
}
