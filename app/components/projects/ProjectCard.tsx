import { FormEvent } from "react";
import Link from "next/link";
import ProjectEditForm from "./ProjectEditForm";
import type { Project } from "./types";

function getOptionalStats(project: Project): { total?: number; completed?: number } {
  const source = project as Project & {
    taskCount?: number;
    task_count?: number;
    totalTasks?: number;
    total_tasks?: number;
    completedTasks?: number;
    completed_tasks?: number;
  };

  const total = source.taskCount ?? source.task_count ?? source.totalTasks ?? source.total_tasks;
  const completed = source.completedTasks ?? source.completed_tasks;

  return {
    total: typeof total === "number" ? total : undefined,
    completed: typeof completed === "number" ? completed : undefined,
  };
}

export default function ProjectCard({ project, canManage, isEditing, editName, editDescription, actionError, isSaving, isDeleting, onStartEdit, onDelete, onEditNameChange, onEditDescriptionChange, onEditSubmit, onCancelEdit }: { project: Project; canManage: boolean; isEditing: boolean; editName: string; editDescription: string; actionError: string; isSaving: boolean; isDeleting: boolean; onStartEdit: (project: Project) => void; onDelete: (project: Project) => void; onEditNameChange: (value: string) => void; onEditDescriptionChange: (value: string) => void; onEditSubmit: (event: FormEvent<HTMLFormElement>, projectId: string | number) => void; onCancelEdit: () => void; }) {
  const ownerLabel = project.owner?.trim() || project.owner_username?.trim() || project.owner_name?.trim() || project.owner_email?.trim() || `Owner #${project.owner_id}`;
  const ownerInitial = ownerLabel.trim().charAt(0).toUpperCase() || "?";
  const stats = getOptionalStats(project);

  return (
    <article className="rounded-3xl border border-[var(--border-soft)] bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-6">
      {isEditing ? (
        <ProjectEditForm
          projectId={project.id}
          editName={editName}
          editDescription={editDescription}
          actionError={actionError}
          isSaving={isSaving}
          onEditNameChange={onEditNameChange}
          onEditDescriptionChange={onEditDescriptionChange}
          onSubmit={onEditSubmit}
          onCancel={onCancelEdit}
        />
      ) : (
        <>
          <div className="flex items-start justify-between gap-3">
            <h3 className="min-w-0 text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">
              <Link href={`/projects/${project.id}`} className="inline-flex min-w-0 items-center gap-1.5 truncate transition-colors hover:text-[var(--brand-red-strong)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-red-soft)]">
                {project.name}
              </Link>
            </h3>
            <div className="group relative">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--brand-red-soft)] text-xs font-semibold text-[var(--brand-red-strong)]">
                {ownerInitial}
              </span>
              <div className="pointer-events-none absolute right-0 top-11 z-10 w-max max-w-56 rounded-lg border border-zinc-200 bg-white/95 px-2.5 py-1.5 text-xs font-medium text-zinc-700 opacity-0 shadow-lg backdrop-blur transition group-hover:opacity-100 group-focus-within:opacity-100">
                {ownerLabel}
              </div>
            </div>
          </div>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-600">{project.description?.trim() ? project.description : "No description"}</p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-700">Owner: {ownerLabel}</span>
            <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-600">Created: {new Date(project.created_at).toLocaleDateString()}</span>
            {typeof stats.total === "number" && (
              <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-600">Tasks: {stats.total}</span>
            )}
            {typeof stats.total === "number" && typeof stats.completed === "number" && (
              <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-600">Completed: {stats.completed}/{stats.total}</span>
            )}
          </div>

          {canManage && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => onStartEdit(project)} className="rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-[var(--brand-red-soft)]">Edit</button>
              <button type="button" onClick={() => onDelete(project)} disabled={isDeleting} className="rounded-xl border border-[var(--brand-red-border)] bg-[var(--brand-red)] px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-[var(--brand-red-strong)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-red-soft)] disabled:opacity-60">{isDeleting ? "Deleting..." : "Delete"}</button>
            </div>
          )}

          {actionError && <p className="mt-2 text-sm text-red-600">{actionError}</p>}
        </>
      )}
    </article>
  );
}
