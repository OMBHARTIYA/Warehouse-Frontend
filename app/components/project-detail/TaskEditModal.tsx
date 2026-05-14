import TaskForm from "./TaskForm";
import type { TaskPriority, TaskStatus, User } from "./types";

type Props = {
  isOpen: boolean;
  modalRef: React.RefObject<HTMLDivElement | null>;
  titleRef: React.RefObject<HTMLInputElement | null>;
  users: User[];
  isUsersLoading: boolean;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  assigneeId: string;
  error: string;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPriorityChange: (value: TaskPriority) => void;
  onStatusChange: (value: TaskStatus) => void;
  onAssigneeChange: (value: string) => void;
};

export default function TaskEditModal(props: Props) {
  const {
    isOpen,
    modalRef,
    titleRef,
    users,
    isUsersLoading,
    title,
    description,
    priority,
    status,
    assigneeId,
    error,
    isSaving,
    onClose,
    onSubmit,
    onTitleChange,
    onDescriptionChange,
    onPriorityChange,
    onStatusChange,
    onAssigneeChange,
  } = props;
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4" onClick={onClose}>
      <div ref={modalRef} className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm ring-1 ring-zinc-200/80 sm:p-6" onClick={(event) => event.stopPropagation()}>
        <h3 className="text-lg font-semibold text-zinc-900">Edit task</h3>
        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <TaskForm mode="edit" title={title} description={description} priority={priority} status={status} assigneeId={assigneeId} users={users} isUsersLoading={isUsersLoading} onTitleChange={onTitleChange} onDescriptionChange={onDescriptionChange} onPriorityChange={onPriorityChange} onStatusChange={onStatusChange} onAssigneeChange={onAssigneeChange} titleRef={titleRef} />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex flex-wrap gap-2.5 pt-1">
            <button type="submit" disabled={isSaving} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:ring-offset-2 disabled:opacity-60">{isSaving ? "Saving..." : "Save"}</button>
            <button type="button" onClick={onClose} disabled={isSaving} className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:ring-offset-2">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
