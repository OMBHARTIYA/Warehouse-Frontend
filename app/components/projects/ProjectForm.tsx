import { FormEvent, ReactNode } from "react";

type ProjectFormProps = {
  code: string;
  name: string;
  description: string;
  address: string;
  error: string;
  isSubmitting: boolean;
  onCodeChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  formClassName: string;
  codeId: string;
  nameId: string;
  descriptionId: string;
  addressId: string;
  submitLabel: string;
  submittingLabel: string;
  footer?: ReactNode;
};

export default function ProjectForm({
  code,
  name,
  description,
  address,
  error,
  isSubmitting,
  onCodeChange,
  onNameChange,
  onDescriptionChange,
  onAddressChange,
  onSubmit,
  formClassName,
  codeId,
  nameId,
  descriptionId,
  addressId,
  submitLabel,
  submittingLabel,
  footer,
}: ProjectFormProps) {
  return (
    <form onSubmit={onSubmit} className={formClassName}>
      <div className="space-y-1.5">
        <label htmlFor={codeId} className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Code</label>
        <input
          id={codeId}
          type="text"
          required
          value={code}
          onChange={(event) => onCodeChange(event.target.value)}
          className="h-11 w-full rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] px-3.5 py-2 text-sm text-zinc-900 outline-none transition focus:border-[var(--brand-red-border)] focus:ring-2 focus:ring-[var(--brand-red-soft)] dark:bg-zinc-900/70 dark:text-zinc-100 dark:placeholder:text-zinc-500"
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor={nameId} className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Name</label>
        <input
          id={nameId}
          type="text"
          required
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          className="h-11 w-full rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] px-3.5 py-2 text-sm text-zinc-900 outline-none transition focus:border-[var(--brand-red-border)] focus:ring-2 focus:ring-[var(--brand-red-soft)] dark:bg-zinc-900/70 dark:text-zinc-100 dark:placeholder:text-zinc-500"
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor={descriptionId} className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Description</label>
        <textarea
          id={descriptionId}
          required
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
          className="min-h-28 w-full rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-[var(--brand-red-border)] focus:ring-2 focus:ring-[var(--brand-red-soft)] dark:bg-zinc-900/70 dark:text-zinc-100 dark:placeholder:text-zinc-500"
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor={addressId} className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Address</label>
        <input
          id={addressId}
          type="text"
          required
          value={address}
          onChange={(event) => onAddressChange(event.target.value)}
          className="h-11 w-full rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] px-3.5 py-2 text-sm text-zinc-900 outline-none transition focus:border-[var(--brand-red-border)] focus:ring-2 focus:ring-[var(--brand-red-soft)] dark:bg-zinc-900/70 dark:text-zinc-100 dark:placeholder:text-zinc-500"
        />
      </div>
      {error && <p className="text-sm text-red-600 dark:text-rose-300">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-full border border-[var(--brand-red-border)] bg-[var(--brand-red)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--brand-red-strong)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-red-soft)] disabled:opacity-60"
      >
        {isSubmitting ? submittingLabel : submitLabel}
      </button>
      {footer}
    </form>
  );
}
