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
    <div className={`group relative overflow-hidden rounded-3xl border border-white/60 p-6 text-zinc-900 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg ${gradient}`}>
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/25 blur-2xl" aria-hidden="true" />
      <div className="relative flex items-start justify-between gap-3">
        <p className="text-sm font-semibold tracking-tight text-zinc-700 sm:text-base">{label}</p>
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/75 text-zinc-700 backdrop-blur">
          <Icon size={18} />
        </span>
      </div>
      <p className="relative mt-4 text-4xl font-bold leading-none tracking-tight text-zinc-900">{value}</p>
      <p className="relative mt-2 text-sm text-zinc-700">{helperText}</p>
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
    { label: "Total Projects", value: totalProjects, helperText: "All tracked projects", icon: FolderKanban, gradient: "bg-gradient-to-br from-rose-100 via-pink-50 to-white" },
    { label: "Total Tasks", value: totalTasks, helperText: "Across all projects", icon: ListChecks, gradient: "bg-gradient-to-br from-orange-100 via-amber-50 to-white" },
    { label: "Completed Tasks", value: completedTasks, helperText: "Finished and marked done", icon: CheckCircle2, gradient: "bg-gradient-to-br from-emerald-100 via-green-50 to-white" },
    { label: "Completion Rate", value: completionRate, helperText: "Share of completed work", icon: TrendingUp, gradient: "bg-gradient-to-br from-violet-100 via-purple-50 to-white" },
  ] as const;

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </section>
  );
}
