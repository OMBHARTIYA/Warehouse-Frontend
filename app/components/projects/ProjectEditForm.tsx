import { FormEvent } from "react";
import ProjectForm from "./ProjectForm";

export default function ProjectEditForm({ projectId, editName, editDescription, actionError, isSaving, onEditNameChange, onEditDescriptionChange, onSubmit, onCancel }: { projectId: string | number; editName: string; editDescription: string; actionError: string; isSaving: boolean; onEditNameChange: (value: string) => void; onEditDescriptionChange: (value: string) => void; onSubmit: (event: FormEvent<HTMLFormElement>, projectId: string | number) => void; onCancel: () => void; }) {
  return (
    <ProjectForm
      name={editName}
      description={editDescription}
      error={actionError}
      isSubmitting={isSaving}
      onNameChange={onEditNameChange}
      onDescriptionChange={onEditDescriptionChange}
      onSubmit={(event) => onSubmit(event, projectId)}
      formClassName="space-y-4"
      nameId={`edit-name-${projectId}`}
      descriptionId={`edit-description-${projectId}`}
      submitLabel="Save"
      submittingLabel="Saving..."
      footer={
        <div className="flex flex-wrap gap-2.5 pt-1">
          <button type="button" onClick={onCancel} disabled={isSaving} className="rounded-lg border border-[var(--border-soft)] bg-[var(--surface)] px-3.5 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-[var(--brand-red-soft)] dark:text-zinc-200 dark:hover:bg-zinc-800">Cancel</button>
        </div>
      }
    />
  );
}

