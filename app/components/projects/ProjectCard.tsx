import { FormEvent } from "react";
import Link from "next/link";
import ProjectEditForm from "./ProjectEditForm";
import type { Project, ProjectTaskSummary } from "./types";

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

function getCompletionPercent(summary?: ProjectTaskSummary, fallback?: { total?: number; completed?: number }) {
  const total = summary?.total ?? fallback?.total ?? 0;
  const completed = summary?.completed ?? fallback?.completed ?? 0;

  if (!total) return 0;
  return Math.round((completed / total) * 100);
}

function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 px-3 py-2">
      <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-zinc-900">{value}</p>
    </div>
  );
}

export default function ProjectCard({ project, taskSummary, canManage, isEditing, editName, editDescription, actionError, isSaving, isDeleting, onStartEdit, onDelete, onEditNameChange, onEditDescriptionChange, onEditSubmit, onCancelEdit }: { project: Project; taskSummary?: ProjectTaskSummary; canManage: boolean; isEditing: boolean; editName: string; editDescription: string; actionError: string; isSaving: boolean; isDeleting: boolean; onStartEdit: (project: Project) => void; onDelete: (project: Project) => void; onEditNameChange: (value: string) => void; onEditDescriptionChange: (value: string) => void; onEditSubmit: (event: FormEvent<HTMLFormElement>, projectId: string | number) => void; onCancelEdit: () => void; }) {
  const ownerLabel = project.owner?.trim() || project.owner_username?.trim() || project.owner_name?.trim() || project.owner_email?.trim() || `Owner #${project.owner_id}`;
  const ownerInitial = ownerLabel.trim().charAt(0).toUpperCase() || "?";
  const stats = getOptionalStats(project);
  const totalTasks = taskSummary?.total ?? stats.total;
  const completedTasks = taskSummary?.completed ?? stats.completed;
  const completionPercent = getCompletionPercent(taskSummary, stats);
  const hasTaskInfo = typeof totalTasks === "number" || Boolean(taskSummary);

  return (
    <article className="group rounded-3xl border border-[var(--border-soft)] bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-rose-200 hover:shadow-md sm:p-6">
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
            <div className="min-w-0">
              <h3 className="min-w-0 text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">
                <Link href={`/projects/${project.id}`} className="inline-flex min-w-0 items-center gap-1.5 truncate transition-colors hover:text-[var(--brand-red-strong)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-red-soft)]">
                  {project.name}
                </Link>
              </h3>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-600">{project.description?.trim() ? project.description : "No description"}</p>
            </div>

            <div className="group/avatar relative">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100 text-sm font-bold text-[var(--brand-red-strong)] shadow-sm ring-1 ring-rose-100">
                {ownerInitial}
              </span>
              <div className="pointer-events-none absolute right-0 top-12 z-10 w-max max-w-56 rounded-lg border border-zinc-200 bg-white/95 px-2.5 py-1.5 text-xs font-medium text-zinc-700 opacity-0 shadow-lg backdrop-blur transition group-hover/avatar:opacity-100 group-focus-within/avatar:opacity-100">
                {ownerLabel}
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-700">Owner: {ownerLabel}</span>
            <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-600">Created: {new Date(project.created_at).toLocaleDateString()}</span>
          </div>

          {hasTaskInfo && (
            <div className="mt-5 rounded-2xl border border-zinc-100 bg-gradient-to-br from-zinc-50 to-white p-3.5">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <StatPill label="Tasks" value={totalTasks ?? 0} />
                <StatPill label="Done" value={completedTasks ?? 0} />
                <StatPill label="Running" value={taskSummary?.inProgress ?? 0} />
                <StatPill label="Critical" value={taskSummary?.critical ?? 0} />
              </div>

              <div className="mt-3">
                <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-zinc-600">
                  <span>Progress</span>
                  <span>{completionPercent}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-zinc-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-rose-500 to-orange-400 transition-all"
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
              </div>
            </div>
          )}

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
