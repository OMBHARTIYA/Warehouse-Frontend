"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import AppLayout from "./AppLayout";
import ProtectedRoute from "./ProtectedRoute";

type RouteLayoutProps = {
  children: ReactNode;
};

export default function RouteLayout({ children }: RouteLayoutProps) {
  const pathname = usePathname();

  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
}
