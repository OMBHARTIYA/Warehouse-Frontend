import LoadingSpinner from "../LoadingSpinner";
import UsersHeader from "./UsersHeader";
import UsersTable from "./UsersTable";
import { useUsers } from "./hooks/useUsers";
import { useAuth } from "@/app/context/AuthContext";

export default function UsersView() {
  const { user, isLoading: authLoading } = useAuth();
  const state = useUsers(user, authLoading);

  if (authLoading || user?.role !== "admin") return null;

  return (
    <section className="space-y-6">
      <UsersHeader />
      {state.error && (
        <div className="rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-2)] p-5 sm:p-6">
          <p className="text-sm text-red-700">{state.error}</p>
        </div>
      )}
      {state.isLoading ? (
        <div className="rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-2)] p-5 sm:p-6">
          <LoadingSpinner label="Loading users..." />
        </div>
      ) : state.users.length === 0 ? (
        <div className="rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-2)] p-5 sm:p-6">
          <p className="text-sm text-zinc-500">No users found.</p>
        </div>
      ) : (
        <UsersTable
          users={state.users}
          currentUserId={user?.id}
          updatingUserId={state.updatingUserId}
          deletingUserId={state.deletingUserId}
          passwordFormUserId={state.passwordFormUserId}
          newPassword={state.newPassword}
          resettingPasswordUserId={state.resettingPasswordUserId}
          onRoleChange={state.handleRoleChange}
          onDelete={state.handleDelete}
          onOpenPasswordReset={state.openPasswordReset}
          onCancelPasswordReset={state.cancelPasswordReset}
          onPasswordChange={state.setNewPassword}
          onPasswordReset={state.handlePasswordReset}
        />
      )}
    </section>
  );
}

