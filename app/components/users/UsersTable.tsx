import { Fragment, useEffect, useMemo, useRef, useState } from "react";
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
  onOpenPasswordReset: (targetUser: AdminUser) => void;
  onCancelPasswordReset: () => void;
  onPasswordChange: (value: string) => void;
  onRequestDelete: (targetUser: AdminUser) => void;
  onRequestReset: (targetUser: AdminUser) => void;
};

function initialsOf(user: AdminUser) {
  const name = user.username?.trim() || user.email?.trim() || "U";
  return name.slice(0, 2).toUpperCase();
}

export default function UsersTable(props: UsersTableProps) {
  const [openRoleRowId, setOpenRoleRowId] = useState<string | null>(null);
  const roleMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!roleMenuRef.current) return;
      if (!roleMenuRef.current.contains(event.target as Node)) setOpenRoleRowId(null);
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

  const roleOptions = useMemo(() => (["user", "admin"] as UserRole[]), []);

  return (
    <div className="overflow-x-auto rounded-3xl border border-zinc-200 bg-white shadow-sm">
      <table className="min-w-[980px] text-left text-sm text-zinc-700">
        <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
          <tr>
            <th className="px-4 py-3.5 font-semibold">User</th>
            <th className="px-4 py-3.5 font-semibold">Email</th>
            <th className="px-4 py-3.5 font-semibold">Role</th>
            <th className="px-4 py-3.5 font-semibold">Created</th>
            <th className="px-4 py-3.5 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {props.users.map((row, index) => {
            const rowId = row.id ?? index;
            const isCurrentUser = props.currentUserId != null && row.id != null ? String(props.currentUserId) === String(row.id) : false;
            const roleValue = getRoleValue(row.role);

            return (
              <Fragment key={String(rowId)}>
                <tr className="border-t border-zinc-100 first:border-t-0 transition-colors hover:bg-zinc-50/80">
                  <td className="px-4 py-4 text-zinc-900">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-red-soft)] text-xs font-semibold text-[var(--brand-red-strong)]">{initialsOf(row)}</span>
                      <span className="font-semibold">{row.username ?? "-"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-zinc-600">{row.email ?? "-"}</td>
                  <td className="px-4 py-4 text-zinc-600">
                    <div ref={openRoleRowId === String(rowId) ? roleMenuRef : null} className="relative w-36">
                      <button
                        type="button"
                        disabled={props.updatingUserId === row.id}
                        onClick={() => setOpenRoleRowId((prev) => (prev === String(rowId) ? null : String(rowId)))}
                        className="flex h-10 w-full items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm font-medium text-zinc-900 outline-none transition hover:bg-zinc-100 focus:border-[var(--brand-red-border)] focus:ring-2 focus:ring-[var(--brand-red-soft)] disabled:opacity-60"
                      >
                        <span>{roleValue === "admin" ? "Admin" : "Member"}</span>
                        <span className="text-zinc-500">v</span>
                      </button>
                      {openRoleRowId === String(rowId) && (
                        <ul className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-20 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">
                          {roleOptions.map((role) => (
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
                                {role === "admin" ? "Admin" : "Member"}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-zinc-600">{formatDate(row.created_at ?? row.createdAt)}</td>
                  <td className="px-4 py-4 text-zinc-600">
                    <div className="flex flex-wrap items-center gap-2">
                      <button type="button" className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100" onClick={() => props.onOpenPasswordReset(row)}>
                        Reset Password
                      </button>
                      <button type="button" className="rounded-lg border border-[var(--brand-red-border)] bg-[var(--brand-red)] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[var(--brand-red-strong)] disabled:cursor-not-allowed disabled:opacity-50" onClick={() => props.onRequestDelete(row)} disabled={isCurrentUser || props.deletingUserId === row.id} title={isCurrentUser ? "You cannot delete your own account." : undefined}>
                        {props.deletingUserId === row.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                    {isCurrentUser && <p className="mt-1 text-xs text-zinc-500">You cannot delete your own account.</p>}
                  </td>
                </tr>
                {props.passwordFormUserId === row.id && (
                  <tr>
                    <td colSpan={5} className="border-t border-zinc-100 bg-zinc-50 px-4 py-4">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <input type="password" minLength={6} value={props.newPassword} onChange={(event) => props.onPasswordChange(event.target.value)} placeholder="New password (min 6 characters)" className="h-11 w-full max-w-sm rounded-xl border border-[var(--border-soft)] bg-white px-3.5 py-2 text-sm text-zinc-900 outline-none transition focus:border-[var(--brand-red-border)] focus:ring-2 focus:ring-[var(--brand-red-soft)]" />
                        <button type="button" className="rounded-lg border border-zinc-200 bg-white px-4 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50" onClick={props.onCancelPasswordReset} disabled={props.resettingPasswordUserId === row.id}>Cancel</button>
                        <button type="button" className="rounded-lg border border-[var(--brand-red-border)] bg-[var(--brand-red)] px-4 py-1.5 text-sm font-medium text-white transition hover:bg-[var(--brand-red-strong)] disabled:cursor-not-allowed disabled:opacity-50" onClick={() => props.onRequestReset(row)} disabled={props.resettingPasswordUserId === row.id || props.newPassword.trim().length < 6}>{props.resettingPasswordUserId === row.id ? "Saving..." : "Save Password"}</button>
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

