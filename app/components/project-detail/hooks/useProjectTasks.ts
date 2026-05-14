import { useCallback, useEffect, useState } from "react";
import type { Task } from "../types";
import { getProjectTasks } from "../services/taskService";

export function useProjectTasks(projectId: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUsersLoading, setIsUsersLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    if (!projectId) {
      setError("Project id is missing.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      setTasks(await getProjectTasks(projectId));
    } catch {
      setError("Failed to load tasks.");
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadTasks();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadTasks]);

  return { tasks, setTasks, isLoading, error, loadTasks, isUsersLoading, setIsUsersLoading };
}
