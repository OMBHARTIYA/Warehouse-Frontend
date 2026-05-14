import { CheckCircle2, FolderKanban, ListChecks, TrendingUp } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string | number;
  helperText: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  isPrimary?: boolean;
};

export function StatCard({ label, value, helperText, icon: Icon, isPrimary = false }: StatCardProps) {
  return (
    <div
      className={`rounded-3xl border p-5 sm:p-6 ${
        isPrimary
          ? "border-[var(--brand-red-soft)] bg-[var(--brand-red-soft)]/45 text-zinc-900"
          : "border-[var(--border-soft)] bg-white text-zinc-900"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold tracking-tight text-zinc-700 sm:text-base">{label}</p>
        <span
          className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${
            isPrimary ? "bg-white/80 text-[var(--brand-red-strong)]" : "bg-zinc-100 text-zinc-600"
          }`}
        >
          <Icon size={16} />
        </span>
      </div>
      <p
        className="mt-3 font-semibold leading-none text-zinc-900 sm:mt-4"
        style={{ fontSize: "clamp(1.4rem, 3vw, 2.1rem)" }}
      >
        {value}
      </p>
      <p className="mt-2 text-xs text-zinc-600 sm:text-sm">{helperText}</p>
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
  const cards = [
    { label: "Total Projects", value: totalProjects, helperText: "All tracked projects", icon: FolderKanban, isPrimary: true },
    { label: "Total Tasks", value: totalTasks, helperText: "Across all projects", icon: ListChecks },
    { label: "Completed Tasks", value: completedTasks, helperText: "Finished and marked done", icon: CheckCircle2 },
    { label: "Completion Rate", value: completionRate, helperText: "Share of completed work", icon: TrendingUp },
  ] as const;

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:gap-5 xl:grid-cols-4">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </section>
  );
}

