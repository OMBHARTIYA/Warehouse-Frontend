import { useMemo, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import ConfirmDialog from "../common/ConfirmDialog";
import EmptyState from "../common/states/EmptyState";
import LoadingSpinner from "../LoadingSpinner";
import UsersFilters from "./UsersFilters";
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

      <UsersFilters
        searchQuery={searchQuery}
        roleFilter={roleFilter}
        onSearchChange={setSearchQuery}
        onRoleChange={setRoleFilter}
        onReset={() => { setSearchQuery(""); setRoleFilter("all"); }}
      />

      {state.error && (
        <div className="rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-2)] p-5 shadow-sm dark:shadow-black/20 sm:p-6">
          <p className="text-sm font-medium text-red-700 dark:text-rose-300">{state.error}</p>
        </div>
      )}

      {state.isLoading ? (
        <div className="rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-2)] p-5 shadow-sm dark:shadow-black/20 sm:p-6">
          <LoadingSpinner label="Loading users..." />
        </div>
      ) : filteredUsers.length === 0 ? (<EmptyState title="No users found" description="Try adjusting search or role filters." />) : (
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




