import SidebarFooter from "./SidebarFooter";
import SidebarNav from "./SidebarNav";
import type { NavItem } from "./navItems";
import { CheckSquare } from "lucide-react";

type SidebarProps = {
  username: string;
  navItems: NavItem[];
  pathname: string;
  onLogout: () => void;
};

export default function Sidebar({ username, navItems, pathname, onLogout }: SidebarProps) {
  return (
    <aside className="hidden border-b border-[var(--border-soft)] bg-gradient-to-b from-[var(--surface)] via-[var(--surface)] to-[var(--surface-2)] p-4 md:flex md:h-full md:w-72 md:flex-col md:rounded-[28px] md:border md:p-6">
      <div className="rounded-2xl border border-zinc-200/80 bg-gradient-to-br from-white via-white to-rose-50 p-4 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-red-soft)] text-[var(--brand-red-strong)]">
            <CheckSquare size={18} aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-zinc-900">JIRA</h1>
            <p className="text-xs text-zinc-500">Project workspace</p>
          </div>
        </div>
      </div>

      <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">Main</p>

      <SidebarNav
        navItems={navItems}
        pathname={pathname}
        className="mt-2 flex flex-wrap gap-2 md:flex-col"
        itemClassName="whitespace-nowrap"
      />

      <SidebarFooter onLogout={onLogout} username={username} className="mt-auto pt-6" />
    </aside>
  );
}
