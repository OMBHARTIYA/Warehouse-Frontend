import TaskForm from "./TaskForm";
import type { TaskPriority, User } from "./types";

type Props = {
  isOpen: boolean;
  modalRef: React.RefObject<HTMLDivElement | null>;
  titleRef: React.RefObject<HTMLInputElement | null>;
  users: User[];
  isUsersLoading: boolean;
  title: string;
  description: string;
  priority: TaskPriority;
  assigneeId: string;
  error: string;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPriorityChange: (value: TaskPriority) => void;
  onAssigneeChange: (value: string) => void;
};

export default function TaskCreateModal(props: Props) {
  const {
    isOpen,
    modalRef,
    titleRef,
    users,
    isUsersLoading,
    title,
    description,
    priority,
    assigneeId,
    error,
    isSubmitting,
    onClose,
    onSubmit,
    onTitleChange,
    onDescriptionChange,
    onPriorityChange,
    onAssigneeChange,
  } = props;
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4" onClick={onClose}>
      <div ref={modalRef} className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm ring-1 ring-zinc-200/80 sm:p-6" onClick={(event) => event.stopPropagation()}>
        <h3 className="text-lg font-semibold text-zinc-900">New task</h3>
        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <TaskForm mode="create" title={title} description={description} priority={priority} assigneeId={assigneeId} users={users} isUsersLoading={isUsersLoading} onTitleChange={onTitleChange} onDescriptionChange={onDescriptionChange} onPriorityChange={onPriorityChange} onAssigneeChange={onAssigneeChange} titleRef={titleRef} />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex flex-wrap gap-2.5 pt-1">
            <button type="submit" disabled={isSubmitting} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:ring-offset-2 disabled:opacity-60">{isSubmitting ? "Creating..." : "Create task"}</button>
            <button type="button" onClick={onClose} disabled={isSubmitting} className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:ring-offset-2">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
