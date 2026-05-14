import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { User } from "../types";

export function useProjectUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isUsersLoading, setIsUsersLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    const loadUsers = async () => {
      setIsUsersLoading(true);
      try {
        const response = await api.get("/api/users");
        const data = Array.isArray(response.data) ? response.data : response.data?.users;
        if (!ignore) setUsers(Array.isArray(data) ? data : []);
      } catch {
        if (!ignore) setUsers([]);
      } finally {
        if (!ignore) setIsUsersLoading(false);
      }
    };
    void loadUsers();
    return () => { ignore = true; };
  }, []);

  return { users, isUsersLoading };
}
