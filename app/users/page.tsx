"use client";

import { useAuth } from "../context/AuthContext";

export default function UsersPage() {
  const { user } = useAuth();

  if (user?.role !== "admin") {
    return (
      <>
        <h2 className="text-2xl font-semibold text-zinc-900">Access denied</h2>
        <p className="mt-2 text-zinc-600">You do not have permission to view users.</p>
      </>
    );
  }

  return <h2 className="text-2xl font-semibold text-zinc-900">Users</h2>;
}
