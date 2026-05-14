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
      className={`relative flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
        isActive
          ? "bg-[var(--brand-red-soft)] text-[var(--brand-red-strong)]"
          : "text-zinc-600 hover:bg-[var(--surface-2)] hover:text-zinc-900"
      } ${className}`}
    >
      {isActive && <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-[var(--brand-red)]" />}
      <Icon size={16} aria-hidden="true" />
      {item.label}
    </Link>
  );
}

