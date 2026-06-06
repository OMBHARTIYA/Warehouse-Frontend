import { FormEvent } from "react";
import ProjectForm from "./ProjectForm";

export default function ProjectEditForm({ projectId, editCode, editName, editDescription, editAddress, actionError, isSaving, onEditCodeChange, onEditNameChange, onEditDescriptionChange, onEditAddressChange, onSubmit, onCancel }: { projectId: string | number; editCode: string; editName: string; editDescription: string; editAddress: string; actionError: string; isSaving: boolean; onEditCodeChange: (value: string) => void; onEditNameChange: (value: string) => void; onEditDescriptionChange: (value: string) => void; onEditAddressChange: (value: string) => void; onSubmit: (event: FormEvent<HTMLFormElement>, projectId: string | number) => void; onCancel: () => void; }) {
  return (
    <ProjectForm
      code={editCode}
      name={editName}
      description={editDescription}
      address={editAddress}
      error={actionError}
      isSubmitting={isSaving}
      onCodeChange={onEditCodeChange}
      onNameChange={onEditNameChange}
      onDescriptionChange={onEditDescriptionChange}
      onAddressChange={onEditAddressChange}
      onSubmit={(event) => onSubmit(event, projectId)}
      formClassName="space-y-4"
      codeId={`edit-code-${projectId}`}
      nameId={`edit-name-${projectId}`}
      descriptionId={`edit-description-${projectId}`}
      addressId={`edit-address-${projectId}`}
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

