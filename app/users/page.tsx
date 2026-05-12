"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function UsersPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role !== "admin") {
      router.replace("/");
    }
  }, [router, user]);

  if (user?.role !== "admin") {
    return null;
  }

  return (
    <>
      <h2 className="text-2xl font-semibold text-zinc-900">Users</h2>
      <p className="mt-2 text-zinc-600">Admin-only users page placeholder.</p>
    </>
  );
}
