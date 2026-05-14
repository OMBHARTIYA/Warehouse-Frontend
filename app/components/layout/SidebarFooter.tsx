import { LogOut } from "lucide-react";

type SidebarFooterProps = {
  onLogout: () => void;
  username: string;
  className?: string;
};

export default function SidebarFooter({ onLogout, username, className = "" }: SidebarFooterProps) {
  return (
    <div className={className}>
      <div className="mb-3 rounded-xl border border-[var(--border-soft)] bg-[var(--surface-2)] px-3 py-2.5">
        <p className="truncate text-xs font-medium text-zinc-700">{username}</p>
      </div>
      <button
        type="button"
        onClick={onLogout}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border-soft)] bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
      >
        <LogOut size={16} aria-hidden="true" />
        Logout
      </button>
    </div>
  );
}
