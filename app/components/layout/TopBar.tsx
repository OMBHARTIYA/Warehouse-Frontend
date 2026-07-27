import { Menu } from "lucide-react";

type TopBarProps = {
  onOpenMenu: () => void;
};

export default function TopBar({ onOpenMenu }: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[var(--border-soft)] bg-[var(--surface)]/95 p-4 backdrop-blur md:hidden">
      <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Warehouse OS</h1>
      <button
        type="button"
        onClick={onOpenMenu}
        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-2)] text-zinc-700 shadow-sm transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-red-soft)] dark:text-zinc-100 dark:hover:bg-zinc-800"
        aria-label="Open navigation menu"
      >
        <Menu size={20} aria-hidden="true" />
      </button>
    </header>
  );
}
