import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { User, UserRole } from "@/types/auth";
import type { AdminUser } from "../types";
import { deleteUser, getUsers, resetUserPassword, updateUserRole } from "../services/userService";

export function useUsers(user: User | null, authLoading: boolean) {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<string | number | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | number | null>(null);
  const [passwordFormUserId, setPasswordFormUserId] = useState<string | number | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [resettingPasswordUserId, setResettingPasswordUserId] = useState<string | number | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setUsers(await getUsers());
    } catch {
      setError("Could not load users.");
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && user?.role !== "admin") router.replace("/");
  }, [authLoading, router, user]);

  useEffect(() => {
    if (!authLoading && user?.role === "admin") {
      const timeoutId = window.setTimeout(() => { void fetchUsers(); }, 0);
      return () => window.clearTimeout(timeoutId);
    }
  }, [authLoading, fetchUsers, user?.role]);

  const handleRoleChange = async (targetUser: AdminUser, nextRole: UserRole) => {
    const targetId = targetUser.id;
    if (targetId === undefined || targetId === null) return;
    setUpdatingUserId(targetId);
    try {
      await updateUserRole(targetId, nextRole);
      toast.success("User updated");
      await fetchUsers();
    } catch {
      setError("Could not update user role.");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleDelete = async (targetUser: AdminUser) => {
    const targetId = targetUser.id;
    if (targetId === undefined || targetId === null) return;
    const currentUserId = user?.id;
    if (currentUserId !== undefined && currentUserId !== null && String(currentUserId) === String(targetId)) return;
    if (!window.confirm(`Delete user ${targetUser.username ?? ""}?`)) return;
    setDeletingUserId(targetId);
    try {
      await deleteUser(targetId);
      toast.success("User deleted");
      await fetchUsers();
    } catch {
      setError("Could not delete user.");
    } finally {
      setDeletingUserId(null);
    }
  };

  const handlePasswordReset = async (targetUser: AdminUser) => {
    const targetId = targetUser.id;
    if (targetId === undefined || targetId === null) return;
    if (!newPassword || newPassword.trim().length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setResettingPasswordUserId(targetId);
    setError(null);
    try {
      await resetUserPassword(targetId, newPassword.trim());
      toast.success("Password reset successfully");
      setPasswordFormUserId(null);
      setNewPassword("");
      await fetchUsers();
    } catch {
      setError("Could not reset password.");
    } finally {
      setResettingPasswordUserId(null);
    }
  };

  return { users, isLoading, error, updatingUserId, deletingUserId, passwordFormUserId, newPassword, resettingPasswordUserId, setPasswordFormUserId, setNewPassword, handleRoleChange, handleDelete, handlePasswordReset, cancelPasswordReset: () => { setPasswordFormUserId(null); setNewPassword(""); }, openPasswordReset: (targetUser: AdminUser) => { const targetId = targetUser.id; if (targetId === undefined || targetId === null) return; setPasswordFormUserId(targetId); setNewPassword(""); } };
}
