import { LogOut } from "lucide-react";
import ThemeToggle from "../common/ThemeToggle";

type SidebarFooterProps = {
  onLogout: () => void;
  username: string;
  className?: string;
};

export default function SidebarFooter({ onLogout, username, className = "" }: SidebarFooterProps) {
  const initial = username.trim().charAt(0).toUpperCase() || "U";

  return (
    <div className={className}>
      <div className="mb-3 rounded-2xl border border-zinc-200 bg-white/80 p-3.5 dark:border-zinc-700 dark:bg-zinc-900/70">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">Account</p>
        <div className="mt-2 flex items-center gap-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand-red-soft)] text-xs font-semibold text-[var(--brand-red-strong)]">{initial}</span>
          <p className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-100">{username}</p>
        </div>
      </div>

      <div className="mb-3">
        <ThemeToggle />
      </div>

      <button
        type="button"
        onClick={onLogout}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-[var(--brand-red-soft)] dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-200 dark:hover:bg-zinc-800"
      >
        <LogOut size={16} aria-hidden="true" />
        Logout
      </button>
    </div>
  );
}
