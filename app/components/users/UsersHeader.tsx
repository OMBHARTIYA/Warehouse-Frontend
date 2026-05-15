export default function UsersHeader({ totalUsers, adminCount, memberCount }: { totalUsers: number; adminCount: number; memberCount: number; }) {
  const cards = [
    { label: "Total Users", value: totalUsers, tone: "from-rose-100 via-pink-50 to-white" },
    { label: "Admins", value: adminCount, tone: "from-violet-100 via-purple-50 to-white" },
    { label: "Members", value: memberCount, tone: "from-emerald-100 via-green-50 to-white" },
  ];

  return (
    <section className="space-y-4 rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-2)] p-5 sm:p-6">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">Users</h2>
        <p className="mt-2 text-sm text-zinc-500 sm:text-base">Manage access, roles, and account credentials across your workspace.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {cards.map((card) => (
          <article key={card.label} className={`rounded-2xl border border-white/70 bg-gradient-to-br ${card.tone} p-4`}>
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-600">{card.label}</p>
            <p className="mt-2 text-2xl font-bold text-zinc-900">{card.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
