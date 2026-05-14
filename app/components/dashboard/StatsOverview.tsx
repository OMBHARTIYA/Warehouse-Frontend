type StatCardProps = {
  label: string;
  value: string | number;
};

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-2)] p-6 text-zinc-900 sm:p-7">
      <p className="text-base font-medium text-zinc-700 sm:text-lg">{label}</p>
      <p
        className="mt-3 font-semibold leading-none text-zinc-900"
        style={{ fontSize: "clamp(1rem, 4vw, 2rem)" }}
      >
        {value}
      </p>
    </div>
  );
}

export default function StatsOverview({
  totalProjects,
  totalTasks,
  completedTasks,
  completionRate,
}: {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  completionRate: string;
}) {
  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Total Projects" value={totalProjects} />
      <StatCard label="Total Tasks" value={totalTasks} />
      <StatCard label="Completed Tasks" value={completedTasks} />
      <StatCard label="Completion Rate" value={completionRate} />
    </section>
  );
}

