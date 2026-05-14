import { useMemo, useState } from "react";
import type { Task, TaskPriority, TaskStatus } from "./types";

export function useTaskFilters(tasks: Task[]) {
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "all">("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus = statusFilter === "all" || task.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
      const taskAssigneeValue = task.assigneeId != null ? String(task.assigneeId) : "";
      const matchesAssignee = assigneeFilter === "all" || taskAssigneeValue === assigneeFilter;
      return matchesStatus && matchesPriority && matchesAssignee;
    });
  }, [tasks, statusFilter, priorityFilter, assigneeFilter]);

  const resetFilters = () => {
    setStatusFilter("all");
    setPriorityFilter("all");
    setAssigneeFilter("all");
  };

  return {
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    assigneeFilter,
    setAssigneeFilter,
    filteredTasks,
    resetFilters,
  };
}
