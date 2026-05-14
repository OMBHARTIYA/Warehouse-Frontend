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
    <aside className="hidden border-b border-[var(--border-soft)] bg-gradient-to-b from-[var(--surface)] to-[var(--surface-2)] p-4 md:flex md:h-full md:w-72 md:flex-col md:rounded-[28px] md:border md:p-6">
      <div className="rounded-2xl border border-zinc-200/80 bg-white/70 p-3.5">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--brand-red-soft)] text-[var(--brand-red-strong)]">
            <CheckSquare size={17} aria-hidden="true" />
          </span>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900">JIRA</h1>
        </div>
        <p className="mt-2 break-words text-xs text-zinc-600">Signed in as {username}</p>
      </div>

      <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">Main</p>

      <SidebarNav
        navItems={navItems}
        pathname={pathname}
        className="mt-2 flex flex-wrap gap-1.5 md:flex-col"
        itemClassName="rounded-xl border border-transparent px-3 py-2 text-sm whitespace-nowrap"
      />

      <SidebarFooter onLogout={onLogout} username={username} className="mt-auto pt-6" />
    </aside>
  );
}
