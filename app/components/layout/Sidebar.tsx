import SidebarFooter from "./SidebarFooter";
import SidebarNav from "./SidebarNav";
import type { NavItem } from "./navItems";

type SidebarProps = {
  username: string;
  navItems: NavItem[];
  pathname: string;
  onLogout: () => void;
};

export default function Sidebar({ username, navItems, pathname, onLogout }: SidebarProps) {
  return (
    <aside className="hidden border-b border-[var(--border-soft)] bg-[var(--surface)] p-4 md:block md:h-full md:w-72 md:rounded-[28px] md:border md:p-7">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">Task Manager</h1>
      <p className="mt-2 break-words text-sm text-zinc-800">Signed in as {username}</p>

      <SidebarNav
        navItems={navItems}
        pathname={pathname}
        className="mt-8 flex flex-wrap gap-2 md:flex-col"
        itemClassName="rounded-xl border border-transparent px-4 py-3 text-base whitespace-nowrap transition hover:border-[var(--border-soft)] hover:bg-[var(--surface-2)] data-[active=true]:bg-[var(--brand-red-soft)] data-[active=true]:text-[var(--brand-red-strong)]"
      />

      <SidebarFooter onLogout={onLogout} className="mt-6 md:mt-10" />
    </aside>
  );
}

