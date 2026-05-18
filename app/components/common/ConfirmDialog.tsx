"use client";

type ConfirmDialogProps = {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isBusy?: boolean;
};

export default function ConfirmDialog({
  isOpen,
  title = "Confirm action",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isBusy = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/35 p-4 backdrop-blur-[2px] dark:bg-black/55" onClick={onCancel} role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl dark:border-zinc-700 dark:bg-[var(--surface-2)] dark:shadow-black/40 sm:p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{message}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-200 dark:hover:bg-zinc-800" disabled={isBusy}>
            {cancelLabel}
          </button>
          <button type="button" onClick={onConfirm} className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70" disabled={isBusy}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
