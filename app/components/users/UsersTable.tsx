import { Fragment, useEffect, useRef, useState } from "react";
import { UserRole } from "@/types/auth";
import { AdminUser, formatDate, getRoleValue } from "./types";

type UsersTableProps = {
  users: AdminUser[];
  currentUserId?: string | number;
  updatingUserId: string | number | null;
  deletingUserId: string | number | null;
  passwordFormUserId: string | number | null;
  newPassword: string;
  resettingPasswordUserId: string | number | null;
  onRoleChange: (targetUser: AdminUser, nextRole: UserRole) => Promise<void>;
  onDelete: (targetUser: AdminUser) => Promise<void>;
  onOpenPasswordReset: (targetUser: AdminUser) => void;
  onCancelPasswordReset: () => void;
  onPasswordChange: (value: string) => void;
  onPasswordReset: (targetUser: AdminUser) => Promise<void>;
};

export default function UsersTable(props: UsersTableProps) {
  const [openRoleRowId, setOpenRoleRowId] = useState<string | null>(null);
  const roleMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!roleMenuRef.current) return;
      if (!roleMenuRef.current.contains(event.target as Node)) {
        setOpenRoleRowId(null);
      }
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenRoleRowId(null);
    };
    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onEscape);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onEscape);
    };
  }, []);

  return (
    <div className="overflow-x-auto rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-2)] p-3">
      <table className="min-w-full text-left text-sm text-zinc-700">
        <thead className="text-xs uppercase text-zinc-500">
          <tr>
            <th className="px-4 py-3 font-medium">Username</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Role</th>
            <th className="px-4 py-3 font-medium">Created</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {props.users.map((row, index) => {
            const rowId = row.id ?? index;
            const isCurrentUser =
              props.currentUserId !== undefined &&
              props.currentUserId !== null &&
              row.id !== undefined &&
              row.id !== null
                ? String(props.currentUserId) === String(row.id)
                : false;
            const roleValue = getRoleValue(row.role);

            return (
              <Fragment key={String(rowId)}>
                <tr className="border-t border-zinc-100 first:border-t-0 hover:bg-zinc-50/60">
                  <td className="px-4 py-3.5 font-medium text-zinc-900">{row.username ?? "-"}</td>
                  <td className="px-4 py-3.5 text-zinc-600">{row.email ?? "-"}</td>
                  <td className="px-4 py-3.5 text-zinc-600">
                    <div ref={openRoleRowId === String(rowId) ? roleMenuRef : null} className="relative w-32">
                      <button
                        type="button"
                        disabled={props.updatingUserId === row.id}
                        onClick={() =>
                          setOpenRoleRowId((prev) => (prev === String(rowId) ? null : String(rowId)))
                        }
                        className="flex h-10 w-full items-center justify-between rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] px-3 text-sm text-zinc-900 outline-none transition hover:bg-white focus:border-[var(--brand-red-border)] focus:ring-2 focus:ring-[var(--brand-red-soft)] disabled:opacity-60"
                      >
                        <span>{roleValue}</span>
                        <span className="text-zinc-500">v</span>
                      </button>
                      {openRoleRowId === String(rowId) && (
                        <ul className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-20 overflow-hidden rounded-xl border border-[var(--border-soft)] bg-white shadow-sm">
                          {(["user", "admin"] as UserRole[]).map((role) => (
                            <li key={role}>
                              <button
                                type="button"
                                onClick={() => {
                                  void props.onRoleChange(row, role);
                                  setOpenRoleRowId(null);
                                }}
                                className={`w-full px-3 py-2 text-left text-sm transition ${
                                  roleValue === role ? "bg-[var(--brand-red-soft)] text-[var(--brand-red-strong)]" : "text-zinc-700 hover:bg-zinc-50"
                                }`}
                              >
                                {role}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-zinc-600">{formatDate(row.created_at ?? row.createdAt)}</td>
                  <td className="px-4 py-3.5 text-zinc-600">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        className="rounded-full border border-[var(--border-soft)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-red-soft)]"
                        onClick={() => props.onOpenPasswordReset(row)}
                      >
                        Reset Password
                      </button>
                      <button
                        type="button"
                        className="rounded-full border border-[var(--brand-red-border)] bg-[var(--brand-red)] px-3 py-2 text-sm font-medium text-white transition hover:bg-[var(--brand-red-strong)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-red-soft)] disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() => void props.onDelete(row)}
                        disabled={isCurrentUser || props.deletingUserId === row.id}
                        title={isCurrentUser ? "You cannot delete your own account." : undefined}
                      >
                        {props.deletingUserId === row.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
                {props.passwordFormUserId === row.id && (
                  <tr>
                    <td colSpan={5} className="border-t border-zinc-100 bg-[var(--surface)] px-4 py-4">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <input
                          type="password"
                          minLength={6}
                          value={props.newPassword}
                          onChange={(event) => props.onPasswordChange(event.target.value)}
                          placeholder="New password (min 6 characters)"
                          className="h-11 w-full max-w-sm rounded-xl border border-[var(--border-soft)] bg-white px-3.5 py-2 text-sm text-zinc-900 outline-none transition focus:border-[var(--brand-red-border)] focus:ring-2 focus:ring-[var(--brand-red-soft)]"
                        />
                        <button
                          type="button"
                          className="rounded-full border border-[var(--border-soft)] bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-[var(--brand-red-soft)]"
                          onClick={props.onCancelPasswordReset}
                          disabled={props.resettingPasswordUserId === row.id}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="rounded-full border border-[var(--brand-red-border)] bg-[var(--brand-red)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--brand-red-strong)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-red-soft)] disabled:cursor-not-allowed disabled:opacity-50"
                          onClick={() => void props.onPasswordReset(row)}
                          disabled={props.resettingPasswordUserId === row.id || props.newPassword.trim().length < 6}
                        >
                          {props.resettingPasswordUserId === row.id ? "Saving..." : "Save Password"}
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
