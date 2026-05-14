import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ConfirmDialog from "../common/ConfirmDialog";
import ErrorMessage from "../ErrorMessage";
import Skeleton from "../Skeleton";
import ProjectCard from "./ProjectCard";
import ProjectCreateForm from "./ProjectCreateForm";
import ProjectFilters from "./ProjectFilters";
import ProjectsHeader from "./ProjectsHeader";
import useProjectFilters from "./hooks/useProjectFilters";
import useProjects from "./hooks/useProjects";

export default function ProjectsView() {
  const { user } = useAuth();
  const projectsState = useProjects(user);
  const filters = useProjectFilters(projectsState.projects);
  const [pendingDeleteProjectId, setPendingDeleteProjectId] = useState<import("./types").Project | null>(null);

  return (
    <section className="space-y-6">
      <ProjectsHeader isCreateFormVisible={projectsState.isCreateFormVisible} onToggleCreate={projectsState.toggleCreate} />
      {projectsState.isCreateFormVisible && (
        <ProjectCreateForm
          name={projectsState.name}
          description={projectsState.description}
          createError={projectsState.createError}
          isSubmitting={projectsState.isSubmitting}
          onNameChange={projectsState.setName}
          onDescriptionChange={projectsState.setDescription}
          onSubmit={projectsState.handleCreateProject}
        />
      )}
      {projectsState.isLoading && (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <article key={index} className="rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-2)] p-5 sm:p-6">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="mt-3 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-3/4" />
              <Skeleton className="mt-4 h-4 w-32" />
            </article>
          ))}
        </div>
      )}
      {!projectsState.isLoading && projectsState.error && (
        <div className="rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-2)] p-5 sm:p-6">
          <ErrorMessage message={projectsState.error} />
        </div>
      )}
      {!projectsState.isLoading && !projectsState.error && projectsState.projects.length > 0 && (
        <ProjectFilters
          searchQuery={filters.searchQuery}
          sortBy={filters.sortBy}
          onSearchChange={filters.setSearchQuery}
          onSortChange={filters.setSortBy}
        />
      )}
      {!projectsState.isLoading && !projectsState.error && projectsState.projects.length === 0 && (
        <div className="rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-2)] p-5 sm:p-6">
          <p className="text-sm text-zinc-500">No projects found.</p>
        </div>
      )}
      {!projectsState.isLoading && !projectsState.error && projectsState.projects.length > 0 && filters.visibleProjects.length === 0 && (
        <div className="rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-2)] p-5 sm:p-6">
          <p className="text-sm text-zinc-500">No projects match your search.</p>
        </div>
      )}
      {!projectsState.isLoading && !projectsState.error && filters.visibleProjects.length > 0 && (
        <div className="grid gap-4">
          {filters.visibleProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              canManage={projectsState.canManageProject(project)}
              isEditing={projectsState.editingProjectId === project.id}
              editName={projectsState.editName}
              editDescription={projectsState.editDescription}
              actionError={projectsState.activeActionProjectId === project.id ? projectsState.actionError : ""}
              isSaving={projectsState.activeActionProjectId === project.id && projectsState.activeActionType === "edit"}
              isDeleting={projectsState.activeActionProjectId === project.id && projectsState.activeActionType === "delete"}
              onStartEdit={projectsState.startEditProject}
              onDelete={(project) => setPendingDeleteProjectId(project)}
              onEditNameChange={projectsState.setEditName}
              onEditDescriptionChange={projectsState.setEditDescription}
              onEditSubmit={projectsState.handleEditProject}
              onCancelEdit={projectsState.cancelEditProject}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={pendingDeleteProjectId !== null}
        title="Delete project"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmLabel="Delete project"
        onCancel={() => setPendingDeleteProjectId(null)}
        onConfirm={async () => {
          if (pendingDeleteProjectId === null) return;
          await projectsState.handleDeleteProject(pendingDeleteProjectId);
          setPendingDeleteProjectId(null);
        }}
        isBusy={projectsState.activeActionType === "delete"}
      />
    {projectsState.lastDeletedProject && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">Project deleted. <button type="button" className="ml-2 rounded bg-emerald-700 px-2 py-1 text-xs font-medium text-white hover:bg-emerald-800" onClick={() => { void projectsState.undoDeleteProject(); }}>Undo</button></div>} </section>
  );
}


