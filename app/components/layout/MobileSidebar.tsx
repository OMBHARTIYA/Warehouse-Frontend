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
        className="fixed inset-0 z-30 bg-black/40 md:hidden"
        onClick={onClose}
        aria-label="Close navigation menu"
      />
      <aside className="fixed inset-y-0 left-0 z-40 m-3 w-[calc(100%-1.5rem)] max-w-72 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm md:hidden">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-zinc-900">Task-Manager-App</h1>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-700 hover:bg-zinc-100"
            aria-label="Close navigation menu"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
        <p className="mt-1 break-words text-sm text-zinc-600">Signed in as {username}</p>

        <SidebarNav
          navItems={navItems}
          pathname={pathname}
          onItemClick={onClose}
          className="mt-6 flex flex-col gap-1.5"
        />

        <SidebarFooter onLogout={onLogout} username={username} className="mt-8" />
      </aside>
    </>
  );
}
