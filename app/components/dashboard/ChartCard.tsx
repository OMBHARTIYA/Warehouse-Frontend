import type { ReactNode } from "react";

type ChartCardProps = {
  title: string;
  empty: boolean;
  emptyText: string;
  children: ReactNode;
};

export default function ChartCard({ title, empty, emptyText, children }: ChartCardProps) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition-all dark:border-zinc-700 dark:bg-[var(--surface-2)] dark:shadow-black/20 sm:p-5">
      <h3 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-lg">{title}</h3>

      {empty ? (
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">{emptyText}</p>
      ) : (
        <div className="mt-3 flex h-72 min-h-72 w-full items-center justify-center pb-2 sm:h-80 sm:min-h-80 sm:pb-0">
          <div className="h-full w-full">{children}</div>
        </div>
      )}
    </section>
  );
}
