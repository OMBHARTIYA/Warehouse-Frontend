import { useMemo, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import ConfirmDialog from "../common/ConfirmDialog";
import FilterDropdown from "../common/FilterDropdown";
import LoadingSpinner from "../LoadingSpinner";
import UsersHeader from "./UsersHeader";
import UsersTable from "./UsersTable";
import { useUsers } from "./hooks/useUsers";
import type { AdminUser } from "./types";

export default function UsersView() {
  const { user, isLoading: authLoading } = useAuth();
  const state = useUsers(user, authLoading);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all");
  const [pendingDeleteUser, setPendingDeleteUser] = useState<AdminUser | null>(null);
  const [pendingResetUser, setPendingResetUser] = useState<AdminUser | null>(null);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return state.users.filter((u) => {
      const roleOk = roleFilter === "all" ? true : u.role === roleFilter;
      const text = `${u.username ?? ""} ${u.email ?? ""}`.toLowerCase();
      const queryOk = normalizedQuery.length === 0 ? true : text.includes(normalizedQuery);
      return roleOk && queryOk;
    });
  }, [roleFilter, searchQuery, state.users]);

  const totalUsers = state.users.length;
  const adminCount = state.users.filter((u) => u.role === "admin").length;
  const memberCount = totalUsers - adminCount;

  if (authLoading || user?.role !== "admin") return null;

  return (
    <section className="space-y-6">
      <UsersHeader totalUsers={totalUsers} adminCount={adminCount} memberCount={memberCount} />

      <div className="flex flex-col gap-3 rounded-3xl border border-[var(--border-soft)] bg-white p-5 shadow-sm sm:flex-row sm:items-end sm:p-6">
        <div className="sm:w-80">
          <label htmlFor="users-search" className="text-sm font-medium text-zinc-700">Search users</label>
          <input id="users-search" type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by username or email" className="mt-1 h-11 w-full rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] px-3.5 text-sm text-zinc-900 outline-none transition focus:border-[var(--brand-red-border)] focus:ring-2 focus:ring-[var(--brand-red-soft)]" />
        </div>
        <div className="sm:w-52">
          <FilterDropdown
            id="users-role-filter"
            label="Role"
            value={roleFilter}
            onChange={setRoleFilter}
            className="space-y-1.5 sm:w-52"
            options={[
              { value: "all", label: "All roles" },
              { value: "admin", label: "Admins" },
              { value: "user", label: "Members" },
            ]}
          />
        </div>
        <button type="button" onClick={() => { setSearchQuery(""); setRoleFilter("all"); }} className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 sm:ml-auto">Reset Filters</button>
      </div>

      {state.error && (
        <div className="rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-2)] p-5 sm:p-6">
          <p className="text-sm text-red-700">{state.error}</p>
        </div>
      )}

      {state.isLoading ? (
        <div className="rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-2)] p-5 sm:p-6">
          <LoadingSpinner label="Loading users..." />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="rounded-3xl border border-[var(--border-soft)] bg-white p-8 text-center shadow-sm">
          <p className="text-base font-medium text-zinc-800">No users found</p>
          <p className="mt-1 text-sm text-zinc-500">Try adjusting search or role filters.</p>
        </div>
      ) : (
        <UsersTable
          users={filteredUsers}
          currentUserId={user?.id}
          updatingUserId={state.updatingUserId}
          deletingUserId={state.deletingUserId}
          passwordFormUserId={state.passwordFormUserId}
          newPassword={state.newPassword}
          resettingPasswordUserId={state.resettingPasswordUserId}
          onRoleChange={state.handleRoleChange}
          onOpenPasswordReset={state.openPasswordReset}
          onCancelPasswordReset={state.cancelPasswordReset}
          onPasswordChange={state.setNewPassword}
          onRequestDelete={setPendingDeleteUser}
          onRequestReset={setPendingResetUser}
        />
      )}

      <ConfirmDialog
        isOpen={pendingDeleteUser !== null}
        title="Delete user"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmLabel="Delete user"
        onCancel={() => setPendingDeleteUser(null)}
        onConfirm={async () => {
          if (!pendingDeleteUser) return;
          await state.handleDelete(pendingDeleteUser);
          setPendingDeleteUser(null);
        }}
        isBusy={state.deletingUserId !== null}
      />

      <ConfirmDialog
        isOpen={pendingResetUser !== null}
        title="Reset password"
        message={`Reset password for ${pendingResetUser?.username ?? "this user"}?`}
        confirmLabel="Reset password"
        onCancel={() => setPendingResetUser(null)}
        onConfirm={async () => {
          if (!pendingResetUser) return;
          await state.handlePasswordReset(pendingResetUser);
          setPendingResetUser(null);
        }}
        isBusy={state.resettingPasswordUserId !== null}
      />
    </section>
  );
}
