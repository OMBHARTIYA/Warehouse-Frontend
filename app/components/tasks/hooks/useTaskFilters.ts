import { useMemo, useState } from "react";
import type { PriorityFilter, StatusFilter, Task } from "../types";

export function useTaskFilters(tasks: Task[]) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");

  const filteredTasks = useMemo(() => tasks.filter((task) => {
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || task.movement_type === priorityFilter || task.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  }), [tasks, statusFilter, priorityFilter]);

  return { statusFilter, priorityFilter, filteredTasks, setStatusFilter, setPriorityFilter, reset: () => { setStatusFilter("all"); setPriorityFilter("all"); } };
}
