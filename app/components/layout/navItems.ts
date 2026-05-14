import {
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  type LucideIcon,
  Users,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const baseNavItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Tasks", href: "/tasks", icon: ListTodo },
];

export function getNavItems(isAdmin: boolean): NavItem[] {
  if (!isAdmin) {
    return baseNavItems;
  }

  return [...baseNavItems, { label: "Users", href: "/users", icon: Users }];
}

export type { NavItem };
