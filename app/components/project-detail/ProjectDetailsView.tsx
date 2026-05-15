"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { DropResult } from "@hello-pangea/dnd";
import { useAuth } from "@/app/context/AuthContext";
import ConfirmDialog from "../common/ConfirmDialog";
import EmptyState from "../common/states/EmptyState";
import UndoBanner from "../common/feedback/UndoBanner";
import ErrorMessage from "../ErrorMessage";
import FilterDropdown from "../common/FilterDropdown";
import LoadingSpinner from "../LoadingSpinner";
import TaskBoardView from "./TaskBoardView";
import TaskCreateModal from "./TaskCreateModal";
import TaskEditModal from "./TaskEditModal";
import TaskFiltersBar from "./TaskFiltersBar";
import TaskListView from "./TaskListView";
import { useProjectDetails } from "./hooks/useProjectDetails";
import { useProjectTasks } from "./hooks/useProjectTasks";
import { useProjectUsers } from "./hooks/useProjectUsers";
import { useTaskModalFocus } from "./hooks/useTaskModalFocus";
import { useTaskModalState } from "./hooks/useTaskModalState";
import { useTaskMutations } from "./hooks/useTaskMutations";
import type { Task, TaskPriority, TaskStatus } from "./types";
import { useTaskFilters } from "./useTaskFilters";

type ProjectDetailsViewProps = { projectId: string };
type TaskSort = "newest" | "oldest" | "title" | "priority";

const priorityRank: Record<TaskPriority, number> = { critical: 0, high: 1, medium: 2, low: 3 };

function sortTasks(tasks: Task[], sortBy: TaskSort) {
  const list = [...tasks];
  if (sortBy === "newest") return list.sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime());
  if (sortBy === "oldest") return list.sort((a, b) => new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime());
  if (sortBy === "title") return list.sort((a, b) => a.title.localeCompare(b.title));
  return list.sort((a, b) => (priorityRank[(a.priority as TaskPriority) ?? "low"] ?? Number.MAX_SAFE_INTEGER) - (priorityRank[(b.priority as TaskPriority) ?? "low"] ?? Number.MAX_SAFE_INTEGER));
}

export default function ProjectDetailsView({ projectId }: ProjectDetailsViewProps) {
  const [viewMode, setViewMode] = useState<"list" | "board">("list");
  const [sortBy, setSortBy] = useState<TaskSort>("newest");
  const [pendingDeleteTask, setPendingDeleteTask] = useState<Task | null>(null);

  const { user } = useAuth();
  const modal = useTaskModalState();
  const { users, isUsersLoading } = useProjectUsers(user?.role === "admin");
  const { project, isProjectLoading, projectError } = useProjectDetails(projectId);
  const { tasks, setTasks, isLoading, error, loadTasks } = useProjectTasks(projectId);
  const filters = useTaskFilters(tasks);
  const mutations = useTaskMutations(projectId, loadTasks, setTasks);

  useTaskModalFocus({
    isCreateModalOpen: modal.isCreateModalOpen,
    isEditModalOpen: modal.isEditModalOpen,
    createTitleInputRef: modal.createTitleInputRef,
    editTitleInputRef: modal.editTitleInputRef,
    createModalRef: modal.createModalRef,
    editModalRef: modal.editModalRef,
    onCloseCreate: modal.closeCreateModal,
    onCloseEdit: modal.closeEditModal,
  });

  const handleBoardDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;
    await mutations.onBoardDragEnd(draggableId, destination.droppableId as TaskStatus, tasks);
  };

  const boardColumns = useMemo(() => ({
    todo: filters.filteredTasks.filter((task) => task.status === "todo"),
    in_progress: filters.filteredTasks.filter((task) => task.status === "in_progress"),
    done: filters.filteredTasks.filter((task) => task.status === "done"),
  }), [filters.filteredTasks]);

  const sortedListTasks = useMemo(() => sortTasks(filters.filteredTasks, sortBy), [filters.filteredTasks, sortBy]);

  const ownerLabel = project?.owner?.trim() || project?.owner_username?.trim() || project?.owner_name?.trim() || project?.owner_email?.trim() || "Unknown owner";

  return (
    <section className="space-y-5">
      <div className="space-y-2 rounded-3xl border border-[var(--border-soft)] bg-white p-5 shadow-sm transition-colors dark:bg-[var(--surface-2)] dark:shadow-black/20 sm:p-6">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">Project Details</h2>
        <div className="inline-flex items-center rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-300">
          Project ID: <span className="ml-1 font-semibold text-zinc-700 dark:text-zinc-100">{projectId}</span>
        </div>
      </div>

      {isProjectLoading && <p className="text-zinc-600 dark:text-zinc-300">Loading project details...</p>}
      {!isProjectLoading && projectError && <p className="text-red-600 dark:text-rose-300">{projectError}</p>}
      {!isProjectLoading && !projectError && project && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700 shadow-sm transition-colors dark:border-zinc-700 dark:bg-[var(--surface-2)] dark:text-zinc-300 dark:shadow-black/20 sm:p-5">
          <p className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-2xl">{project.name?.trim() || "Untitled project"}</p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{project.description?.trim() || "No description"}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-200">Owner: {ownerLabel}</span>
            {project.created_at && <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-300">Created: {new Date(project.created_at).toLocaleDateString()}</span>}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm transition-colors dark:border-zinc-700 dark:bg-[var(--surface-2)] dark:shadow-black/20 sm:p-4">
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => modal.setIsCreateModalOpen(true)} className="rounded-lg bg-zinc-900 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white">New task</button>
          <div className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-700 dark:bg-zinc-900/70">
            <button type="button" onClick={() => setViewMode("board")} className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${viewMode === "board" ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950" : "text-zinc-700 hover:bg-white dark:text-zinc-300 dark:hover:bg-zinc-800"}`}>Board</button>
            <button type="button" onClick={() => setViewMode("list")} className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${viewMode === "list" ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950" : "text-zinc-700 hover:bg-white dark:text-zinc-300 dark:hover:bg-zinc-800"}`}>List</button>
          </div>
          {viewMode === "list" && (
            <FilterDropdown
              id="project-task-sort"
              label="Sort"
              value={sortBy}
              onChange={setSortBy}
              className="w-52 sm:ml-auto"
              options={[
                { value: "newest", label: "Newest first" },
                { value: "oldest", label: "Oldest first" },
                { value: "title", label: "Title A-Z" },
                { value: "priority", label: "Priority" },
              ]}
            />
          )}
        </div>
      </div>

      {isLoading && <LoadingSpinner label="Loading tasks..." />}
      {!isLoading && error && <ErrorMessage message={error} />}
      {!isLoading && !error && tasks.length === 0 && <EmptyState title="No tasks found." compact />}

      {!isLoading && !error && tasks.length > 0 && (
        <TaskFiltersBar
          users={users}
          statusFilter={filters.statusFilter}
          priorityFilter={filters.priorityFilter}
          assigneeFilter={filters.assigneeFilter}
          onStatusChange={filters.setStatusFilter}
          onPriorityChange={filters.setPriorityFilter}
          onAssigneeChange={filters.setAssigneeFilter}
          onReset={filters.resetFilters}
        />
      )}

      {!isLoading && !error && tasks.length > 0 && filters.filteredTasks.length === 0 && (<EmptyState title="No tasks match the selected filters." compact />)}

      {!isLoading && !error && filters.filteredTasks.length > 0 && viewMode === "list" && (
        <TaskListView tasks={sortedListTasks} activeTaskActionId={mutations.activeTaskActionId} activeTaskActionType={mutations.activeTaskActionType} onEdit={modal.openEditModal} onDelete={setPendingDeleteTask} />
      )}
      {mutations.deleteError && <p className="text-sm text-red-600 dark:text-rose-300">{mutations.deleteError}</p>}
      {!isLoading && !error && filters.filteredTasks.length > 0 && viewMode === "board" && <TaskBoardView columns={boardColumns} onDragEnd={handleBoardDragEnd} />}

      <TaskCreateModal
        isOpen={modal.isCreateModalOpen}
        modalRef={modal.createModalRef}
        titleRef={modal.createTitleInputRef}
        users={users}
        isUsersLoading={isUsersLoading}
        title={modal.newTaskTitle}
        description={modal.newTaskDescription}
        priority={modal.newTaskPriority}
        assigneeId={modal.newTaskAssigneeId}
        error={mutations.createError}
        isSubmitting={mutations.isSubmitting}
        onClose={modal.closeCreateModal}
        onSubmit={async (e) => {
          e.preventDefault();
          const ok = await mutations.onCreate({ title: modal.newTaskTitle, description: modal.newTaskDescription, priority: modal.newTaskPriority, assigneeId: modal.newTaskAssigneeId });
          if (ok) modal.closeCreateModal();
        }}
        onTitleChange={modal.setNewTaskTitle}
        onDescriptionChange={modal.setNewTaskDescription}
        onPriorityChange={modal.setNewTaskPriority}
        onAssigneeChange={modal.setNewTaskAssigneeId}
      />

      <TaskEditModal
        isOpen={modal.isEditModalOpen}
        modalRef={modal.editModalRef}
        titleRef={modal.editTitleInputRef}
        users={users}
        isUsersLoading={isUsersLoading}
        title={modal.editTaskTitle}
        description={modal.editTaskDescription}
        priority={modal.editTaskPriority}
        status={modal.editTaskStatus}
        assigneeId={modal.editTaskAssigneeId}
        error={mutations.editError}
        isSaving={mutations.activeTaskActionId === modal.editingTaskId && mutations.activeTaskActionType === "edit"}
        onClose={modal.closeEditModal}
        onSubmit={async (e) => {
          e.preventDefault();
          if (!modal.editingTaskId) return;
          const ok = await mutations.onEdit(modal.editingTaskId, { title: modal.editTaskTitle, description: modal.editTaskDescription, priority: modal.editTaskPriority, status: modal.editTaskStatus, assigneeId: modal.editTaskAssigneeId });
          if (ok) modal.closeEditModal();
        }}
        onTitleChange={modal.setEditTaskTitle}
        onDescriptionChange={modal.setEditTaskDescription}
        onPriorityChange={modal.setEditTaskPriority}
        onStatusChange={modal.setEditTaskStatus}
        onAssigneeChange={modal.setEditTaskAssigneeId}
      />

      <ConfirmDialog
        isOpen={pendingDeleteTask !== null}
        title="Delete task"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmLabel="Delete task"
        onCancel={() => setPendingDeleteTask(null)}
        onConfirm={async () => {
          if (!pendingDeleteTask) return;
          await mutations.onDelete(pendingDeleteTask);
          setPendingDeleteTask(null);
        }}
        isBusy={mutations.activeTaskActionType === "delete"}
      />

      {mutations.lastDeletedTask && <UndoBanner message="Task deleted." onUndo={() => { void mutations.undoDeleteTask(); }} />}

      <Link href="/projects" className="inline-block text-sm font-medium text-zinc-900 hover:underline dark:text-zinc-300 dark:hover:text-zinc-100">Back to Projects</Link>
    </section>
  );
}




