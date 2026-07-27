"use client";

import { ReactNode, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import MobileSidebar from "./MobileSidebar";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { getNavItems } from "./navItems";

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const username = typeof user?.username === "string" ? user.username : "Unknown user";
  const isAdmin = user?.role === "admin";
  const navItems = getNavItems(isAdmin);

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    logout();
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-[var(--background)] md:h-screen md:overflow-hidden">
      <div className="mx-auto max-w-[1600px] md:flex md:h-full md:w-full md:gap-4 md:p-4">
      <TopBar onOpenMenu={() => setIsMobileMenuOpen(true)} />

      <MobileSidebar
        isOpen={isMobileMenuOpen}
        username={username}
        navItems={navItems}
        pathname={pathname}
        onClose={() => setIsMobileMenuOpen(false)}
        onLogout={handleLogout}
      />

      <Sidebar username={username} navItems={navItems} pathname={pathname} onLogout={handleLogout} />

      <main className="flex-1 p-4 sm:p-5 md:h-full md:overflow-y-auto md:rounded-[28px] md:border md:border-[var(--border-soft)] md:bg-[var(--surface)] md:p-4 lg:p-5">{children}</main>
      </div>
    </div>
  );
}
