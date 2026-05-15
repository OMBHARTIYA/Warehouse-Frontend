import Link from "next/link";
import type { NavItem } from "./navItems";

type SidebarNavItemProps = {
  item: NavItem;
  isActive: boolean;
  onClick?: () => void;
  className?: string;
};

export default function SidebarNavItem({ item, isActive, onClick, className = "" }: SidebarNavItemProps) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      data-active={isActive}
      className={`relative flex items-center gap-2.5 rounded-2xl border px-3.5 py-2.5 text-sm font-semibold transition-all ${
        isActive
          ? "border-[var(--brand-red-border)] bg-gradient-to-r from-[var(--brand-red-soft)] to-white text-[var(--brand-red-strong)] shadow-sm dark:from-rose-950/70 dark:to-zinc-900 dark:text-rose-200"
          : "border-transparent text-zinc-600 hover:border-zinc-200 hover:bg-white hover:text-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/80 dark:hover:text-zinc-50"
      } ${className}`}
    >
      <Icon size={16} aria-hidden="true" className={isActive ? "text-current" : "text-zinc-500 dark:text-zinc-400"} />
      <span>{item.label}</span>
    </Link>
  );
}
