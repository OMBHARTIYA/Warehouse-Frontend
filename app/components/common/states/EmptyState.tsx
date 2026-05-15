type EmptyStateProps = {
  title: string;
  description?: string;
  compact?: boolean;
};

export default function EmptyState({ title, description, compact = false }: EmptyStateProps) {
  if (compact) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600 shadow-sm">
        {title}
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-[var(--border-soft)] bg-white p-8 text-center shadow-sm">
      <p className="text-base font-medium text-zinc-800">{title}</p>
      {description && <p className="mt-1 text-sm text-zinc-500">{description}</p>}
    </div>
  );
}
