import { useState } from "react";
import toast from "react-hot-toast";
import { createTask, deleteTask, updateTask } from "../services/taskService";
import type { Task, TaskPriority, TaskStatus } from "../types";

export function useTaskMutations(projectId: string, reload: () => Promise<void>, setTasks: React.Dispatch<React.SetStateAction<Task[]>>) {
  const [createError, setCreateError] = useState("");
  const [editError, setEditError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTaskActionId, setActiveTaskActionId] = useState<string | number | null>(null);
  const [activeTaskActionType, setActiveTaskActionType] = useState<"edit" | "delete" | null>(null);

  const onCreate = async (payload: { title: string; description: string; priority: TaskPriority; assigneeId: string }) => {
    if (!projectId) return setCreateError("Project id is missing.");
    setCreateError("");
    setIsSubmitting(true);
    try {
      await createTask({ ...payload, status: "todo", projectId, assigneeId: payload.assigneeId || null });
      toast.success("Task created");
      await reload();
      return true;
    } catch {
      setCreateError("Failed to create task.");
      return false;
    } finally { setIsSubmitting(false); }
  };

  const onEdit = async (taskId: string | number, payload: { title: string; description: string; priority: TaskPriority; status: TaskStatus; assigneeId: string }) => {
    setEditError("");
    setActiveTaskActionId(taskId); setActiveTaskActionType("edit");
    try {
      await updateTask(taskId, { ...payload, assigneeId: payload.assigneeId || null });
      toast.success("Task updated");
      await reload();
      return true;
    } catch { setEditError("Failed to update task."); return false; }
    finally { setActiveTaskActionId(null); setActiveTaskActionType(null); }
  };

  const onDelete = async (taskId: string | number) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    setDeleteError(""); setActiveTaskActionId(taskId); setActiveTaskActionType("delete");
    try { await deleteTask(taskId); toast.success("Task deleted"); await reload(); }
    catch { setDeleteError("Failed to delete task."); }
    finally { setActiveTaskActionId(null); setActiveTaskActionType(null); }
  };

  const onBoardDragEnd = async (taskId: string, nextStatus: TaskStatus, tasks: Task[]) => {
    const previousTasks = tasks;
    const movedTask = tasks.find((task) => String(task.id) === taskId);
    if (!movedTask) return;
    setTasks((prev) => prev.map((task) => (String(task.id) === taskId ? { ...task, status: nextStatus } : task)));
    try {
      await updateTask(movedTask.id, { title: movedTask.title, description: movedTask.description ?? "", priority: movedTask.priority, status: nextStatus, assigneeId: movedTask.assigneeId ?? null });
    } catch { setTasks(previousTasks); await reload(); }
  };

  return { createError, editError, deleteError, isSubmitting, activeTaskActionId, activeTaskActionType, onCreate, onEdit, onDelete, onBoardDragEnd };
}
