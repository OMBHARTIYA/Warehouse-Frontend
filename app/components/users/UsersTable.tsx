import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
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
    <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[960px] table-fixed text-left text-sm text-zinc-700">
          <colgroup>
            <col className="w-[20%]" />
            <col className="w-[24%]" />
            <col className="w-[15%]" />
            <col className="w-[17%]" />
            <col className="w-[24%]" />
          </colgroup>
          <thead className="bg-gradient-to-r from-zinc-50 to-white text-[11px] uppercase tracking-[0.14em] text-zinc-500">
            <tr>
              <th className="px-4 py-4 font-bold">User</th>
              <th className="px-4 py-4 font-bold">Email</th>
              <th className="px-4 py-4 font-bold">Role</th>
              <th className="px-4 py-4 font-bold">Created</th>
              <th className="px-4 py-4 text-right font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {props.users.map((row, index) => {
              const rowId = row.id ?? index;
              const isCurrentUser = props.currentUserId != null && row.id != null ? String(props.currentUserId) === String(row.id) : false;
              const roleValue = getRoleValue(row.role);

              return (
                <Fragment key={String(rowId)}>
                  <tr className="group transition-colors hover:bg-rose-50/30">
                    <td className="px-4 py-4 text-zinc-900">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-xs font-bold text-[var(--brand-red-strong)] ring-1 ring-rose-100 transition group-hover:bg-rose-100">{initialsOf(row)}</span>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-zinc-900 transition-colors group-hover:text-[var(--brand-red-strong)]">{row.username ?? "-"}</p>
                          {isCurrentUser && <p className="mt-0.5 truncate text-xs font-medium text-zinc-500">Current account</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-zinc-600">
                      <span className="block truncate">{row.email ?? "-"}</span>
                    </td>
                    <td className="px-4 py-4 text-zinc-600">
                      <div ref={openRoleRowId === String(rowId) ? roleMenuRef : null} className="relative w-36">
                        <button
                          type="button"
                          disabled={props.updatingUserId === row.id}
                          onClick={() => setOpenRoleRowId((prev) => (prev === String(rowId) ? null : String(rowId)))}
                          className="flex h-11 w-full items-center justify-between rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] px-3.5 text-sm font-semibold text-zinc-900 outline-none transition hover:bg-white focus:border-[var(--brand-red-border)] focus:ring-2 focus:ring-[var(--brand-red-soft)] disabled:opacity-60"
                        >
                          <span>{roleValue === "admin" ? "Admin" : "Member"}</span>
                          <ChevronDown size={16} className="text-zinc-500" aria-hidden="true" />
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
                    <td className="whitespace-nowrap px-4 py-4 font-medium text-zinc-500">{formatDate(row.created_at ?? row.createdAt)}</td>
                    <td className="px-4 py-4 text-right text-zinc-600">
                      <div className="inline-flex flex-nowrap items-center justify-end gap-2">
                        <button type="button" className="whitespace-nowrap rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-[var(--brand-red-soft)]" onClick={() => props.onOpenPasswordReset(row)}>
                          Reset Password
                        </button>
                        <button type="button" className="whitespace-nowrap rounded-xl border border-[var(--brand-red-border)] bg-[var(--brand-red)] px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--brand-red-strong)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-red-soft)] disabled:cursor-not-allowed disabled:bg-rose-300 disabled:opacity-80" onClick={() => props.onRequestDelete(row)} disabled={isCurrentUser || props.deletingUserId === row.id} title={isCurrentUser ? "You cannot delete your own account." : undefined}>
                          {props.deletingUserId === row.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                      {isCurrentUser && <p className="ml-auto mt-1 max-w-48 text-xs text-zinc-500">You cannot delete your own account.</p>}
                    </td>
                  </tr>
                  {props.passwordFormUserId === row.id && (
                    <tr>
                      <td colSpan={5} className="border-t border-zinc-100 bg-rose-50/30 px-4 py-4">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <input type="password" minLength={6} value={props.newPassword} onChange={(event) => props.onPasswordChange(event.target.value)} placeholder="New password (min 6 characters)" className="h-11 w-full max-w-sm rounded-2xl border border-[var(--border-soft)] bg-white px-3.5 py-2 text-sm text-zinc-900 outline-none transition focus:border-[var(--brand-red-border)] focus:ring-2 focus:ring-[var(--brand-red-soft)]" />
                          <button type="button" className="rounded-xl border border-zinc-200 bg-white px-4 py-1.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50" onClick={props.onCancelPasswordReset} disabled={props.resettingPasswordUserId === row.id}>Cancel</button>
                          <button type="button" className="rounded-xl border border-[var(--brand-red-border)] bg-[var(--brand-red)] px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-[var(--brand-red-strong)] disabled:cursor-not-allowed disabled:opacity-50" onClick={() => props.onRequestReset(row)} disabled={props.resettingPasswordUserId === row.id || props.newPassword.trim().length < 6}>{props.resettingPasswordUserId === row.id ? "Saving..." : "Save Password"}</button>
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
    </div>
  );
}
