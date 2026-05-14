import { useEffect, useState } from "react";
import type { Task } from "../types";
import { getTasks } from "../services/taskService";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    const loadTasks = async () => {
      setIsLoading(true);
      setError("");
      try {
        const nextTasks = await getTasks();
        if (!ignore) setTasks(nextTasks);
      } catch {
        if (!ignore) {
          setError("Failed to load tasks.");
          setTasks([]);
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };
    void loadTasks();
    return () => { ignore = true; };
  }, []);

  return { tasks, isLoading, error };
}
