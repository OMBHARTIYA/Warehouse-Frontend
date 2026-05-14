import { LogOut } from "lucide-react";

type SidebarFooterProps = {
  onLogout: () => void;
  className?: string;
};

export default function SidebarFooter({ onLogout, className = "" }: SidebarFooterProps) {
  return (
    <button
      type="button"
      onClick={onLogout}
      className={`flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border-soft)] bg-white px-4 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 ${className}`}
    >
      <LogOut size={16} aria-hidden="true" />
      Logout
    </button>
  );
}
