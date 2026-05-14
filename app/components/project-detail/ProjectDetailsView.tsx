"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { DropResult } from "@hello-pangea/dnd";
import ErrorMessage from "../ErrorMessage";
import LoadingSpinner from "../LoadingSpinner";
import TaskBoardView from "./TaskBoardView";
import TaskCreateModal from "./TaskCreateModal";
import TaskEditModal from "./TaskEditModal";
import TaskFiltersBar from "./TaskFiltersBar";
import TaskListView from "./TaskListView";
import FilterDropdown from "../common/FilterDropdown";
import { useProjectDetails } from "./hooks/useProjectDetails";
import { useProjectTasks } from "./hooks/useProjectTasks";
import { useProjectUsers } from "./hooks/useProjectUsers";
import { useTaskModalFocus } from "./hooks/useTaskModalFocus";
import { useTaskModalState } from "./hooks/useTaskModalState";
import { useTaskMutations } from "./hooks/useTaskMutations";
import { useAuth } from "@/app/context/AuthContext";
import type { Task, TaskPriority, TaskStatus } from "./types";
import { useTaskFilters } from "./useTaskFilters";

type ProjectDetailsViewProps = { projectId: string };
type TaskSort = "newest" | "oldest" | "title" | "priority";

const priorityRank: Record<TaskPriority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

function sortTasks(tasks: Task[], sortBy: TaskSort) {
  const list = [...tasks];
  if (sortBy === "newest") return list.sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime());
  if (sortBy === "oldest") return list.sort((a, b) => new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime());
  if (sortBy === "title") return list.sort((a, b) => a.title.localeCompare(b.title));
  return list.sort((a, b) => {
    const aRank = priorityRank[(a.priority as TaskPriority) ?? "low"] ?? Number.MAX_SAFE_INTEGER;
    const bRank = priorityRank[(b.priority as TaskPriority) ?? "low"] ?? Number.MAX_SAFE_INTEGER;
    return aRank - bRank;
  });
}

export default function ProjectDetailsView({ projectId }: ProjectDetailsViewProps) {
  const [viewMode, setViewMode] = useState<"list" | "board">("list");
  const [sortBy, setSortBy] = useState<TaskSort>("newest");
  const { user } = useAuth();
  const modal = useTaskModalState();
  const { users, isUsersLoading } = useProjectUsers(user?.role === "admin");
  const { project, isProjectLoading, projectError } = useProjectDetails(projectId);
  const { tasks, setTasks, isLoading, error, loadTasks } = useProjectTasks(projectId);
  const filters = useTaskFilters(tasks);
  const mutations = useTaskMutations(projectId, loadTasks, setTasks);

  useTaskModalFocus({ isCreateModalOpen: modal.isCreateModalOpen, isEditModalOpen: modal.isEditModalOpen, createTitleInputRef: modal.createTitleInputRef, editTitleInputRef: modal.editTitleInputRef, createModalRef: modal.createModalRef, editModalRef: modal.editModalRef, onCloseCreate: modal.closeCreateModal, onCloseEdit: modal.closeEditModal });

  const handleBoardDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;
    await mutations.onBoardDragEnd(draggableId, destination.droppableId as TaskStatus, tasks);
  };

  const boardColumns = useMemo(() => ({ todo: filters.filteredTasks.filter((task) => task.status === "todo"), in_progress: filters.filteredTasks.filter((task) => task.status === "in_progress"), done: filters.filteredTasks.filter((task) => task.status === "done") }), [filters.filteredTasks]);
  const sortedListTasks = useMemo(() => sortTasks(filters.filteredTasks, sortBy), [filters.filteredTasks, sortBy]);

  return <section className="space-y-4"><h2 className="text-2xl font-semibold text-zinc-900">Project Details</h2><p className="text-sm text-zinc-700">Project ID: {projectId}</p>{isProjectLoading && <p className="text-zinc-600">Loading project details...</p>}{!isProjectLoading && projectError && <p className="text-red-600">{projectError}</p>}{!isProjectLoading && !projectError && project && <div className="rounded-lg border border-zinc-200 bg-white p-4 text-sm text-zinc-700 shadow-sm"><p className="font-medium text-zinc-900">{project.name?.trim() || "N/A"}</p><p className="mt-1">{project.description?.trim() || "No description"}</p><p className="mt-2 text-xs uppercase tracking-wide text-zinc-500">Owner: {project.owner?.trim() || project.owner_username?.trim() || project.owner_name?.trim() || project.owner_email?.trim() || (project.owner_id != null ? `Owner #${project.owner_id}` : "N/A")}</p></div>}<div className="flex flex-wrap items-center gap-2"><button type="button" onClick={() => modal.setIsCreateModalOpen(true)} className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white">New task</button><button type="button" onClick={() => setViewMode("board")} className={`rounded-md px-3 py-2 text-sm font-medium ${viewMode === "board" ? "bg-zinc-900 text-white" : "border border-zinc-300 text-zinc-700"}`}>Board</button><button type="button" onClick={() => setViewMode("list")} className={`rounded-md px-3 py-2 text-sm font-medium ${viewMode === "list" ? "bg-zinc-900 text-white" : "border border-zinc-300 text-zinc-700"}`}>List</button>{viewMode === "list" && <FilterDropdown id="project-task-sort" label="Sort" value={sortBy} onChange={setSortBy} className="w-52" options={[{ value: "newest", label: "Newest first" }, { value: "oldest", label: "Oldest first" }, { value: "title", label: "Title A-Z" }, { value: "priority", label: "Priority" }]} />}</div>{isLoading && <LoadingSpinner label="Loading tasks..." />}{!isLoading && error && <ErrorMessage message={error} />}{!isLoading && !error && tasks.length === 0 && <p className="text-zinc-600">No tasks found.</p>}{!isLoading && !error && tasks.length > 0 && <TaskFiltersBar users={users} statusFilter={filters.statusFilter} priorityFilter={filters.priorityFilter} assigneeFilter={filters.assigneeFilter} onStatusChange={filters.setStatusFilter} onPriorityChange={filters.setPriorityFilter} onAssigneeChange={filters.setAssigneeFilter} onReset={filters.resetFilters} />}{!isLoading && !error && tasks.length > 0 && filters.filteredTasks.length === 0 && <p className="text-zinc-600">No tasks match the selected filters.</p>}{!isLoading && !error && filters.filteredTasks.length > 0 && viewMode === "list" && <TaskListView tasks={sortedListTasks} activeTaskActionId={mutations.activeTaskActionId} activeTaskActionType={mutations.activeTaskActionType} onEdit={modal.openEditModal} onDelete={mutations.onDelete} />}{mutations.deleteError && <p className="text-sm text-red-600">{mutations.deleteError}</p>}{!isLoading && !error && filters.filteredTasks.length > 0 && viewMode === "board" && <TaskBoardView columns={boardColumns} onDragEnd={handleBoardDragEnd} />}<TaskCreateModal isOpen={modal.isCreateModalOpen} modalRef={modal.createModalRef} titleRef={modal.createTitleInputRef} users={users} isUsersLoading={isUsersLoading} title={modal.newTaskTitle} description={modal.newTaskDescription} priority={modal.newTaskPriority} assigneeId={modal.newTaskAssigneeId} error={mutations.createError} isSubmitting={mutations.isSubmitting} onClose={modal.closeCreateModal} onSubmit={async (e) => { e.preventDefault(); const ok = await mutations.onCreate({ title: modal.newTaskTitle, description: modal.newTaskDescription, priority: modal.newTaskPriority, assigneeId: modal.newTaskAssigneeId }); if (ok) modal.closeCreateModal(); }} onTitleChange={modal.setNewTaskTitle} onDescriptionChange={modal.setNewTaskDescription} onPriorityChange={modal.setNewTaskPriority} onAssigneeChange={modal.setNewTaskAssigneeId} /><TaskEditModal isOpen={modal.isEditModalOpen} modalRef={modal.editModalRef} titleRef={modal.editTitleInputRef} users={users} isUsersLoading={isUsersLoading} title={modal.editTaskTitle} description={modal.editTaskDescription} priority={modal.editTaskPriority} status={modal.editTaskStatus} assigneeId={modal.editTaskAssigneeId} error={mutations.editError} isSaving={mutations.activeTaskActionId === modal.editingTaskId && mutations.activeTaskActionType === "edit"} onClose={modal.closeEditModal} onSubmit={async (e) => { e.preventDefault(); if (!modal.editingTaskId) return; const ok = await mutations.onEdit(modal.editingTaskId, { title: modal.editTaskTitle, description: modal.editTaskDescription, priority: modal.editTaskPriority, status: modal.editTaskStatus, assigneeId: modal.editTaskAssigneeId }); if (ok) modal.closeEditModal(); }} onTitleChange={modal.setEditTaskTitle} onDescriptionChange={modal.setEditTaskDescription} onPriorityChange={modal.setEditTaskPriority} onStatusChange={modal.setEditTaskStatus} onAssigneeChange={modal.setEditTaskAssigneeId} /><Link href="/projects" className="inline-block text-sm font-medium text-zinc-900 hover:underline">Back to Projects</Link></section>;
}



