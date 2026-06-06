import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ConfirmDialog from "../common/ConfirmDialog";
import EmptyState from "../common/states/EmptyState";
import ErrorMessage from "../ErrorMessage";
import Skeleton from "../Skeleton";
import UndoBanner from "../common/feedback/UndoBanner";
import ProjectCard from "./ProjectCard";
import ProjectCreateForm from "./ProjectCreateForm";
import ProjectFilters from "./ProjectFilters";
import ProjectsHeader from "./ProjectsHeader";
import useProjectFilters from "./hooks/useProjectFilters";
import useProjects from "./hooks/useProjects";
import type { Project } from "./types";

export default function ProjectsView() {
  const { user } = useAuth();
  const projectsState = useProjects(user);
  const filters = useProjectFilters(projectsState.projects);
  const [pendingDeleteProject, setPendingDeleteProject] = useState<Project | null>(null);

  return (
    <section className="space-y-6">
      <ProjectsHeader isCreateFormVisible={projectsState.isCreateFormVisible} onToggleCreate={projectsState.toggleCreate} />

      {projectsState.isCreateFormVisible && (
        <ProjectCreateForm
          code={projectsState.code}
          name={projectsState.name}
          description={projectsState.description}
          address={projectsState.address}
          createError={projectsState.createError}
          isSubmitting={projectsState.isSubmitting}
          onCodeChange={projectsState.setCode}
          onNameChange={projectsState.setName}
          onDescriptionChange={projectsState.setDescription}
          onAddressChange={projectsState.setAddress}
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

      {!projectsState.isLoading && !projectsState.error && projectsState.projects.length === 0 && (<EmptyState title="No warehouses yet" description="Create your first warehouse to start tracking storage locations." />)}

      {!projectsState.isLoading && !projectsState.error && projectsState.projects.length > 0 && filters.visibleProjects.length === 0 && (<EmptyState title="No warehouses match your search" description="Try a different name query or adjust sorting." />)}

      {!projectsState.isLoading && !projectsState.error && filters.visibleProjects.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {filters.visibleProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              canManage={projectsState.canManageProject(project)}
              isEditing={projectsState.editingProjectId === project.id}
              editCode={projectsState.editCode}
              editName={projectsState.editName}
              editDescription={projectsState.editDescription}
              editAddress={projectsState.editAddress}
              actionError={projectsState.activeActionProjectId === project.id ? projectsState.actionError : ""}
              isSaving={projectsState.activeActionProjectId === project.id && projectsState.activeActionType === "edit"}
              isDeleting={projectsState.activeActionProjectId === project.id && projectsState.activeActionType === "delete"}
              onStartEdit={projectsState.startEditProject}
              onDelete={setPendingDeleteProject}
              onEditCodeChange={projectsState.setEditCode}
              onEditNameChange={projectsState.setEditName}
              onEditDescriptionChange={projectsState.setEditDescription}
              onEditAddressChange={projectsState.setEditAddress}
              onEditSubmit={projectsState.handleEditProject}
              onCancelEdit={projectsState.cancelEditProject}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={pendingDeleteProject !== null}
        title="Delete warehouse"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmLabel="Delete warehouse"
        onCancel={() => setPendingDeleteProject(null)}
        onConfirm={async () => {
          if (!pendingDeleteProject) return;
          await projectsState.handleDeleteProject(pendingDeleteProject);
          setPendingDeleteProject(null);
        }}
        isBusy={projectsState.activeActionType === "delete"}
      />

      {projectsState.lastDeletedProject && <UndoBanner message="Warehouse deleted." onUndo={() => { void projectsState.undoDeleteProject(); }} />}
    </section>
  );
}




