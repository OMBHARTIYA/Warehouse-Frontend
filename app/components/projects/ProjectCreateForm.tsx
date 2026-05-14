import { FormEvent } from "react";
import ProjectForm from "./ProjectForm";

export default function ProjectCreateForm({ name, description, createError, isSubmitting, onNameChange, onDescriptionChange, onSubmit }: { name: string; description: string; createError: string; isSubmitting: boolean; onNameChange: (value: string) => void; onDescriptionChange: (value: string) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; }) {
  return (
    <ProjectForm
      name={name}
      description={description}
      error={createError}
      isSubmitting={isSubmitting}
      onNameChange={onNameChange}
      onDescriptionChange={onDescriptionChange}
      onSubmit={onSubmit}
      formClassName="space-y-4 rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-2)] p-5 sm:p-6"
      nameId="project-name"
      descriptionId="project-description"
      submitLabel="Create Project"
      submittingLabel="Creating..."
    />
  );
}

