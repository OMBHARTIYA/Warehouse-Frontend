import { FormEvent } from "react";
import Link from "next/link";
import ProjectEditForm from "./ProjectEditForm";
import type { Project } from "./types";

function StatChip({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string | number;
  tone?: "default" | "success";
}) {
  const toneClasses = {
    default:
      "border-zinc-200 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-200",
    success:
      "border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300",
  }[tone];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[11px] font-semibold shadow-sm ${toneClasses}`}
    >
      <span className="text-zinc-500 dark:text-zinc-400">{label}</span>
      <span className="font-bold">{value}</span>
    </span>
  );
}

export default function ProjectCard({
  project,
  canManage,
  isEditing,
  editCode,
  editName,
  editDescription,
  editAddress,
  actionError,
  isSaving,
  isDeleting,
  onStartEdit,
  onDelete,
  onEditCodeChange,
  onEditNameChange,
  onEditDescriptionChange,
  onEditAddressChange,
  onEditSubmit,
  onCancelEdit,
}: {
  project: Project;
  canManage: boolean;
  isEditing: boolean;
  editCode: string;
  editName: string;
  editDescription: string;
  editAddress: string;
  actionError: string;
  isSaving: boolean;
  isDeleting: boolean;
  onStartEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onEditCodeChange: (value: string) => void;
  onEditNameChange: (value: string) => void;
  onEditDescriptionChange: (value: string) => void;
  onEditAddressChange: (value: string) => void;
  onEditSubmit: (
    event: FormEvent<HTMLFormElement>,
    projectId: string | number,
  ) => void;
  onCancelEdit: () => void;
}) {
  const managerLabel =
    project.manager_name?.trim() ||
    project.owner?.trim() ||
    project.owner_username?.trim() ||
    project.owner_name?.trim() ||
    project.owner_email?.trim() ||
    `Manager #${project.manager_id ?? project.owner_id ?? "?"}`;
  const managerInitial = managerLabel.trim().charAt(0).toUpperCase() || "?";
  const productCount = project.product_count ?? 0;
  const totalUnits = project.total_units ?? 0;
  const warehouseHref = `/projects/${project.id}`;

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-[var(--border-soft)] bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-rose-200 hover:shadow-md dark:bg-[var(--surface-2)] dark:shadow-black/20 dark:hover:border-rose-900/70 dark:hover:shadow-black/30 sm:p-5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-rose-500 via-orange-400 to-amber-300 opacity-80" />
      <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 translate-x-10 -translate-y-10 rounded-full bg-rose-100/40 blur-2xl transition-opacity group-hover:opacity-90 dark:bg-rose-950/30" />

      {isEditing ? (
        <ProjectEditForm
          projectId={project.id}
          editCode={editCode}
          editName={editName}
          editDescription={editDescription}
          editAddress={editAddress}
          actionError={actionError}
          isSaving={isSaving}
          onEditCodeChange={onEditCodeChange}
          onEditNameChange={onEditNameChange}
          onEditDescriptionChange={onEditDescriptionChange}
          onEditAddressChange={onEditAddressChange}
          onSubmit={onEditSubmit}
          onCancel={onCancelEdit}
        />
      ) : (
        <>
          <Link
            href={warehouseHref}
            aria-label={`Open ${project.name} warehouse details`}
            className="absolute inset-0 z-0 rounded-3xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-red-soft)] focus:ring-offset-2 dark:focus:ring-offset-zinc-950"
          />

          <div className="relative z-10 pointer-events-none flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="min-w-0 truncate text-lg font-semibold tracking-tight text-zinc-900 transition-colors group-hover:text-[var(--brand-red-strong)] dark:text-zinc-50 sm:text-xl">
                {project.name}
              </h3>
              <p className="mt-1 line-clamp-2 text-sm leading-5 text-zinc-600 dark:text-zinc-300">
                {project.description?.trim()
                  ? project.description
                  : "No warehouse description"}
              </p>
            </div>

            <div className="group/avatar pointer-events-auto relative">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100 text-xs font-bold text-[var(--brand-red-strong)] shadow-sm ring-1 ring-rose-100 dark:from-rose-950 dark:to-zinc-900 dark:text-rose-200 dark:ring-rose-900/70">
                {managerInitial}
              </span>
              <div className="pointer-events-none absolute right-0 top-10 z-20 w-max max-w-56 rounded-lg border border-zinc-200 bg-white/95 px-2.5 py-1.5 text-xs font-medium text-zinc-700 opacity-0 shadow-lg backdrop-blur transition group-hover/avatar:opacity-100 group-focus-within/avatar:opacity-100 dark:border-zinc-700 dark:bg-zinc-900/95 dark:text-zinc-200">
                {managerLabel}
              </div>
            </div>
          </div>

          <div className="relative z-10 pointer-events-none mt-3 flex flex-wrap items-center gap-2 text-[11px] font-medium text-zinc-600 dark:text-zinc-300">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-2 py-0.5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/70">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              Manager: {managerLabel}
            </span>
            {project.code ? (
              <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-2 py-0.5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/70">
                Code: {project.code}
              </span>
            ) : null}
            {project.address ? (
              <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-2 py-0.5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/70">
                Address: {project.address}
              </span>
            ) : null}
            <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-2 py-0.5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/70">
              Created: {new Date(project.created_at).toLocaleDateString()}
            </span>
          </div>

          <div className="relative z-10 pointer-events-none mt-3 flex flex-wrap items-center gap-1.5">
            <StatChip label="Products" value={productCount} />
            <StatChip label="Units" value={totalUnits} tone="success" />
          </div>

          <div className="relative z-10 mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-800">
            <span className="pointer-events-none text-xs font-semibold text-zinc-500 transition-colors group-hover:text-[var(--brand-red-strong)] dark:text-zinc-400">
              View warehouse →
            </span>

            {canManage && (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => onStartEdit(project)}
                  className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-[var(--brand-red-soft)] dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-200 dark:hover:bg-zinc-800"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(project)}
                  disabled={isDeleting}
                  className="rounded-xl border border-[var(--brand-red-border)] bg-[var(--brand-red)] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[var(--brand-red-strong)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-red-soft)] disabled:opacity-60"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            )}
          </div>

          {actionError ? (
            <p className="relative z-10 mt-2 text-sm text-red-600 dark:text-rose-300">
              {actionError}
            </p>
          ) : null}
        </>
      )}
    </article>
  );
}
