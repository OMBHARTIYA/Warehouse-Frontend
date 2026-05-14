"use client";

import { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import AppLayout from "./layout/AppLayout";
import { useAuth } from "../context/AuthContext";

type RouteLayoutProps = {
  children: ReactNode;
};

const PUBLIC_ROUTES = ["/login", "/register"];

export default function RouteLayout({ children }: RouteLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!user && !isPublicRoute) {
      router.replace("/login");
      return;
    }

    if (user && isPublicRoute) {
      router.replace("/");
    }
  }, [isLoading, isPublicRoute, router, user]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-100">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900" />
      </div>
    );
  }

  if (isPublicRoute) {
    return <>{children}</>;
  }

  if (!user) {
    return null;
  }

  return <AppLayout>{children}</AppLayout>;
}
