import { X } from "lucide-react";
import SidebarFooter from "./SidebarFooter";
import SidebarNav from "./SidebarNav";
import type { NavItem } from "./navItems";

type MobileSidebarProps = {
  isOpen: boolean;
  username: string;
  navItems: NavItem[];
  pathname: string;
  onClose: () => void;
  onLogout: () => void;
};

export default function MobileSidebar({
  isOpen,
  username,
  navItems,
  pathname,
  onClose,
  onLogout,
}: MobileSidebarProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-30 bg-black/50 backdrop-blur-[2px] md:hidden"
        onClick={onClose}
        aria-label="Close navigation menu"
      />
      <aside className="fixed inset-y-0 left-0 z-40 m-3 flex w-[calc(100%-1.5rem)] max-w-72 flex-col overflow-y-auto rounded-[28px] border border-zinc-200 bg-white p-5 shadow-2xl shadow-black/20 dark:border-zinc-700 dark:bg-[var(--surface-2)] dark:shadow-black/50 md:hidden">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold text-zinc-900 dark:text-zinc-50">Task-Manager-App</h1>
            <p className="mt-1 break-words text-sm text-zinc-600 dark:text-zinc-300">Signed in as {username}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-zinc-300 bg-white text-zinc-700 transition hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-[var(--brand-red-soft)] dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Close navigation menu"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <SidebarNav
          navItems={navItems}
          pathname={pathname}
          onItemClick={onClose}
          className="mt-6 flex flex-col gap-2"
        />

        <SidebarFooter onLogout={onLogout} username={username} className="mt-auto pt-6" />
      </aside>
    </>
  );
}
