import { FormEvent } from "react";
import ProjectForm from "./ProjectForm";

export default function ProjectCreateForm({ code, name, description, address, createError, isSubmitting, onCodeChange, onNameChange, onDescriptionChange, onAddressChange, onSubmit }: { code: string; name: string; description: string; address: string; createError: string; isSubmitting: boolean; onCodeChange: (value: string) => void; onNameChange: (value: string) => void; onDescriptionChange: (value: string) => void; onAddressChange: (value: string) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; }) {
  return (
    <ProjectForm
      code={code}
      name={name}
      description={description}
      address={address}
      error={createError}
      isSubmitting={isSubmitting}
      onCodeChange={onCodeChange}
      onNameChange={onNameChange}
      onDescriptionChange={onDescriptionChange}
      onAddressChange={onAddressChange}
      onSubmit={onSubmit}
      formClassName="space-y-4 rounded-3xl border border-[var(--border-soft)] bg-white p-5 shadow-sm transition-colors dark:bg-[var(--surface-2)] dark:shadow-black/20 sm:p-6"
      codeId="warehouse-code"
      nameId="project-name"
      descriptionId="project-description"
      addressId="warehouse-address"
      submitLabel="Create Warehouse"
      submittingLabel="Creating..."
    />
  );
}
