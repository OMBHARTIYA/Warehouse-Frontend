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

function StatPill({ label, value, tone = "default" }: { label: string; value: string | number; tone?: "default" | "success" | "warning" | "danger" }) {
  const toneClasses = {
    default: "border-zinc-200 bg-white text-zinc-900",
    success: "border-emerald-100 bg-emerald-50 text-emerald-700",
    warning: "border-amber-100 bg-amber-50 text-amber-700",
    danger: "border-rose-100 bg-rose-50 text-rose-700",
  }[tone];

  return (
    <div className={`rounded-2xl border px-3 py-2 shadow-sm ${toneClasses}`}>
      <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-0.5 text-sm font-bold">{value}</p>
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
  const projectHref = `/projects/${project.id}`;

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-[var(--border-soft)] bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-rose-200 hover:shadow-lg sm:p-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-500 via-orange-400 to-amber-300 opacity-80" />
      <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 translate-x-12 -translate-y-12 rounded-full bg-rose-100/60 blur-3xl transition-opacity group-hover:opacity-90" />

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
          <Link
            href={projectHref}
            aria-label={`Open ${project.name} project details`}
            className="absolute inset-0 z-0 rounded-3xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-red-soft)] focus:ring-offset-2"
          />

          <div className="relative z-10 pointer-events-none flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-2 inline-flex items-center rounded-full border border-rose-100 bg-rose-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-rose-700">
                Project workspace
              </div>
              <h3 className="min-w-0 text-xl font-semibold tracking-tight text-zinc-900 transition-colors group-hover:text-[var(--brand-red-strong)] sm:text-2xl">
                {project.name}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-600">{project.description?.trim() ? project.description : "No description"}</p>
            </div>

            <div className="group/avatar pointer-events-auto relative">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100 text-sm font-bold text-[var(--brand-red-strong)] shadow-sm ring-1 ring-rose-100">
                {ownerInitial}
              </span>
              <div className="pointer-events-none absolute right-0 top-12 z-20 w-max max-w-56 rounded-lg border border-zinc-200 bg-white/95 px-2.5 py-1.5 text-xs font-medium text-zinc-700 opacity-0 shadow-lg backdrop-blur transition group-hover/avatar:opacity-100 group-focus-within/avatar:opacity-100">
                {ownerLabel}
              </div>
            </div>
          </div>

          <div className="relative z-10 pointer-events-none mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              Owner: {ownerLabel}
            </span>
            <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-600 shadow-sm">Created: {new Date(project.created_at).toLocaleDateString()}</span>
          </div>

          {hasTaskInfo && (
            <div className="relative z-10 pointer-events-none mt-5 rounded-2xl border border-zinc-100 bg-gradient-to-br from-zinc-50 to-white p-3.5 shadow-inner shadow-zinc-100/70">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <StatPill label="Tasks" value={totalTasks ?? 0} />
                <StatPill label="Done" value={completedTasks ?? 0} tone="success" />
                <StatPill label="Running" value={taskSummary?.inProgress ?? 0} tone="warning" />
                <StatPill label="Critical" value={taskSummary?.critical ?? 0} tone="danger" />
              </div>

              <div className="mt-3">
                <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-zinc-600">
                  <span>Progress</span>
                  <span className="text-zinc-900">{completionPercent}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-zinc-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-rose-500 to-orange-400 transition-all"
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="relative z-10 mt-4 flex flex-wrap items-center justify-between gap-3">
            <span className="pointer-events-none text-sm font-semibold text-zinc-500 transition-colors group-hover:text-[var(--brand-red-strong)]">
              Open details →
            </span>

            {canManage && (
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" onClick={() => onStartEdit(project)} className="rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-[var(--brand-red-soft)]">Edit</button>
                <button type="button" onClick={() => onDelete(project)} disabled={isDeleting} className="rounded-xl border border-[var(--brand-red-border)] bg-[var(--brand-red)] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--brand-red-strong)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-red-soft)] disabled:opacity-60">{isDeleting ? "Deleting..." : "Delete"}</button>
              </div>
            )}
          </div>

          {actionError && <p className="relative z-10 mt-2 text-sm text-red-600">{actionError}</p>}
        </>
      )}
    </article>
  );
}
