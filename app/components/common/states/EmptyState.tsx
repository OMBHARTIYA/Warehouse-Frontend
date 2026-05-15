type EmptyStateProps = {
  title: string;
  description?: string;
  compact?: boolean;
};

export default function EmptyState({ title, description, compact = false }: EmptyStateProps) {
  if (compact) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600 shadow-sm dark:border-zinc-700 dark:bg-[var(--surface-2)] dark:text-zinc-300 dark:shadow-black/20">
        {title}
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-[var(--border-soft)] bg-white p-8 text-center shadow-sm dark:bg-[var(--surface-2)] dark:shadow-black/20">
      <p className="text-base font-medium text-zinc-800 dark:text-zinc-100">{title}</p>
      {description && <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>}
    </div>
  );
}
