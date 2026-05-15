export default function TasksHeader({ total, visible, completed, unassigned }: { total: number; visible: number; completed: number; unassigned: number; }) {
  const cards = [
    { label: "Total Tasks", value: total, tone: "from-rose-100 via-pink-50 to-white", darkTone: "dark:from-rose-950/45 dark:via-zinc-900 dark:to-zinc-950" },
    { label: "Visible", value: visible, tone: "from-orange-100 via-amber-50 to-white", darkTone: "dark:from-orange-950/35 dark:via-zinc-900 dark:to-zinc-950" },
    { label: "Completed", value: completed, tone: "from-emerald-100 via-green-50 to-white", darkTone: "dark:from-emerald-950/35 dark:via-zinc-900 dark:to-zinc-950" },
    { label: "Unassigned", value: unassigned, tone: "from-violet-100 via-purple-50 to-white", darkTone: "dark:from-violet-950/35 dark:via-zinc-900 dark:to-zinc-950" },
  ];

  return (
    <section className="space-y-4 rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-2)] p-5 shadow-sm transition-colors dark:shadow-black/20 sm:p-6">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Tasks</h2>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-300 sm:text-base">Track assignments, priorities, and delivery status across all projects.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article key={card.label} className={`rounded-2xl border border-white/70 bg-gradient-to-br ${card.tone} ${card.darkTone} p-4 shadow-sm transition-colors dark:border-zinc-800 dark:shadow-black/20`}>
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-300">{card.label}</p>
            <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{card.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
