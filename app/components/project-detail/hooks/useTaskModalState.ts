import { useRef, useState } from "react";
import type { Task, TaskPriority, TaskStatus } from "../types";

export function useTaskModalState() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | number | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>("medium");
  const [newTaskAssigneeId, setNewTaskAssigneeId] = useState("");
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [editTaskDescription, setEditTaskDescription] = useState("");
  const [editTaskPriority, setEditTaskPriority] = useState<TaskPriority>("medium");
  const [editTaskStatus, setEditTaskStatus] = useState<TaskStatus>("todo");
  const [editTaskAssigneeId, setEditTaskAssigneeId] = useState("");
  const createTitleInputRef = useRef<HTMLInputElement | null>(null);
  const editTitleInputRef = useRef<HTMLInputElement | null>(null);
  const createModalRef = useRef<HTMLDivElement | null>(null);
  const editModalRef = useRef<HTMLDivElement | null>(null);

  const closeCreateModal = () => { setIsCreateModalOpen(false); setNewTaskTitle(""); setNewTaskDescription(""); setNewTaskPriority("medium"); setNewTaskAssigneeId(""); };
  const closeEditModal = () => { setIsEditModalOpen(false); setEditingTaskId(null); setEditTaskTitle(""); setEditTaskDescription(""); setEditTaskPriority("medium"); setEditTaskStatus("todo"); setEditTaskAssigneeId(""); };

  const openEditModal = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTaskTitle(task.title);
    setEditTaskDescription(task.description ?? "");
    setEditTaskPriority((task.priority as TaskPriority) ?? "medium");
    setEditTaskStatus((task.status as TaskStatus) ?? "todo");
    setEditTaskAssigneeId(task.assigneeId ? String(task.assigneeId) : "");
    setIsEditModalOpen(true);
  };

  return { isCreateModalOpen, isEditModalOpen, editingTaskId, newTaskTitle, newTaskDescription, newTaskPriority, newTaskAssigneeId, editTaskTitle, editTaskDescription, editTaskPriority, editTaskStatus, editTaskAssigneeId, createTitleInputRef, editTitleInputRef, createModalRef, editModalRef, setIsCreateModalOpen, setNewTaskTitle, setNewTaskDescription, setNewTaskPriority, setNewTaskAssigneeId, setEditTaskTitle, setEditTaskDescription, setEditTaskPriority, setEditTaskStatus, setEditTaskAssigneeId, closeCreateModal, closeEditModal, openEditModal };
}
