import {
  Boxes,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  PackageSearch,
  type LucideIcon,
  Users,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const baseNavItems: NavItem[] = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "Warehouses", href: "/projects", icon: FolderKanban },
  { label: "Movements", href: "/tasks", icon: ListTodo },
  { label: "Products", href: "/products", icon: PackageSearch },
  { label: "Stock", href: "/stock", icon: Boxes },
];

export function getNavItems(isAdmin: boolean): NavItem[] {
  if (!isAdmin) {
    return baseNavItems;
  }

  return [...baseNavItems, { label: "Users", href: "/users", icon: Users }];
}

export type { NavItem };
