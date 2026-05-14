import SidebarNavItem from "./SidebarNavItem";
import type { NavItem } from "./navItems";

type SidebarNavProps = {
  navItems: NavItem[];
  pathname: string;
  onItemClick?: () => void;
  className?: string;
  itemClassName?: string;
};

export default function SidebarNav({ navItems, pathname, onItemClick, className = "", itemClassName = "" }: SidebarNavProps) {
  return (
    <nav className={className}>
      {navItems.map((item) => (
        <SidebarNavItem
          key={item.href}
          item={item}
          isActive={pathname === item.href}
          onClick={onItemClick}
          className={itemClassName}
        />
      ))}
    </nav>
  );
}
