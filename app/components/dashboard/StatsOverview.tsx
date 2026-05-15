import { CheckCircle2, FolderKanban, ListChecks, TrendingUp } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string | number;
  helperText: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  gradient: string;
};

export function StatCard({ label, value, helperText, icon: Icon, gradient }: StatCardProps) {
  return (
    <div className={`group relative overflow-hidden rounded-3xl border border-white/60 p-6 text-zinc-900 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-zinc-700 dark:text-zinc-50 dark:shadow-black/20 dark:hover:shadow-black/30 ${gradient}`}>
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/25 blur-2xl dark:bg-white/10" aria-hidden="true" />
      <div className="relative flex items-start justify-between gap-3">
        <p className="text-sm font-semibold tracking-tight text-zinc-700 dark:text-zinc-200 sm:text-base">{label}</p>
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/75 text-zinc-700 backdrop-blur dark:bg-zinc-900/60 dark:text-zinc-100">
          <Icon size={18} />
        </span>
      </div>
      <p className="relative mt-4 text-4xl font-bold leading-none tracking-tight text-zinc-900 dark:text-zinc-50">{value}</p>
      <p className="relative mt-2 text-sm text-zinc-700 dark:text-zinc-300">{helperText}</p>
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
    { label: "Total Projects", value: totalProjects, helperText: "All tracked projects", icon: FolderKanban, gradient: "bg-gradient-to-br from-rose-100 via-pink-50 to-white dark:from-rose-950/60 dark:via-zinc-900 dark:to-zinc-950" },
    { label: "Total Tasks", value: totalTasks, helperText: "Across all projects", icon: ListChecks, gradient: "bg-gradient-to-br from-orange-100 via-amber-50 to-white dark:from-amber-950/50 dark:via-zinc-900 dark:to-zinc-950" },
    { label: "Completed Tasks", value: completedTasks, helperText: "Finished and marked done", icon: CheckCircle2, gradient: "bg-gradient-to-br from-emerald-100 via-green-50 to-white dark:from-emerald-950/50 dark:via-zinc-900 dark:to-zinc-950" },
    { label: "Completion Rate", value: completionRate, helperText: "Share of completed work", icon: TrendingUp, gradient: "bg-gradient-to-br from-violet-100 via-purple-50 to-white dark:from-violet-950/50 dark:via-zinc-900 dark:to-zinc-950" },
  ] as const;

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </section>
  );
}
