import { Menu } from "lucide-react";

type TopBarProps = {
  onOpenMenu: () => void;
};

export default function TopBar({ onOpenMenu }: TopBarProps) {
  return (
    <header className="flex items-center justify-between border-b border-[var(--border-soft)] bg-[var(--surface)] p-4 md:hidden">
      <h1 className="text-lg font-semibold text-zinc-900">JIRA</h1>
      <button
        type="button"
        onClick={onOpenMenu}
        className="rounded-xl border border-[var(--border-soft)] bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        aria-label="Open navigation menu"
      >
        <Menu size={16} aria-hidden="true" />
      </button>
    </header>
  );
}
