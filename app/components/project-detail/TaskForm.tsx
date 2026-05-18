import { useEffect, useRef, useState } from "react";
import type { TaskPriority, TaskStatus, User } from "./types";
import { getUserLabel, TASK_PRIORITY_OPTIONS, TASK_STATUS_OPTIONS } from "./utils";

type TaskFormProps = {
  mode: "create" | "edit";
  title: string;
  description: string;
  priority: TaskPriority;
  status?: TaskStatus;
  assigneeId: string;
  users: User[];
  isUsersLoading: boolean;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPriorityChange: (value: TaskPriority) => void;
  onStatusChange?: (value: TaskStatus) => void;
  onAssigneeChange: (value: string) => void;
  titleRef: React.RefObject<HTMLInputElement | null>;
};

function formatOptionLabel(value: string) {
  if (value === "in_progress") return "In Progress";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const labelClass = "text-sm font-medium text-zinc-800 dark:text-zinc-200";
const fieldClass = "h-11 w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-[var(--brand-red-border)] focus:ring-2 focus:ring-[var(--brand-red-soft)] dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:bg-zinc-900";
const textareaClass = "min-h-28 w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-[var(--brand-red-border)] focus:ring-2 focus:ring-[var(--brand-red-soft)] dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:bg-zinc-900";
const dropdownButtonClass = "flex h-11 w-full items-center justify-between rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-sm text-zinc-900 outline-none transition hover:bg-zinc-50 focus:border-[var(--brand-red-border)] focus:ring-2 focus:ring-[var(--brand-red-soft)] disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-100 dark:hover:bg-zinc-900";
const dropdownMenuClass = "absolute left-0 right-0 top-[calc(100%+0.35rem)] z-20 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm ring-1 ring-zinc-200/80 dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-black/30 dark:ring-zinc-700/70";

function optionClass(isSelected: boolean) {
  return `w-full px-3.5 py-2 text-left text-sm transition ${
    isSelected
      ? "bg-red-50 text-red-700 dark:bg-rose-950/70 dark:text-rose-200"
      : "text-zinc-700 hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-zinc-800"
  }`;
}

export default function TaskForm(props: TaskFormProps) {
  const {
    mode,
    titleRef,
    title,
    description,
    priority,
    status,
    assigneeId,
    users,
    isUsersLoading,
    onTitleChange,
    onDescriptionChange,
    onPriorityChange,
    onStatusChange,
    onAssigneeChange,
  } = props;

  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isAssigneeOpen, setIsAssigneeOpen] = useState(false);
  const priorityRef = useRef<HTMLDivElement | null>(null);
  const statusRef = useRef<HTMLDivElement | null>(null);
  const assigneeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (priorityRef.current && !priorityRef.current.contains(event.target as Node)) setIsPriorityOpen(false);
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) setIsStatusOpen(false);
      if (assigneeRef.current && !assigneeRef.current.contains(event.target as Node)) setIsAssigneeOpen(false);
    };

    window.addEventListener("mousedown", onPointerDown);
    return () => window.removeEventListener("mousedown", onPointerDown);
  }, []);

  const assigneeLabel =
    assigneeId === ""
      ? "Unassigned"
      : getUserLabel(users.find((user) => String(user.id) === assigneeId) ?? { id: assigneeId });

  return (
    <>
      <div className="space-y-1.5">
        <label className={labelClass}>Task name</label>
        <input
          ref={titleRef}
          className={fieldClass}
          required
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <label className={labelClass}>Description</label>
        <textarea
          className={textareaClass}
          required
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <label className={labelClass}>Priority</label>
        <div ref={priorityRef} className="relative">
          <button type="button" onClick={() => setIsPriorityOpen((v) => !v)} className={dropdownButtonClass}>
            <span>{formatOptionLabel(priority)}</span><span className="text-zinc-500 dark:text-zinc-400">v</span>
          </button>
          {isPriorityOpen && (
            <ul className={dropdownMenuClass}>
              {TASK_PRIORITY_OPTIONS.filter((p) => p !== "all").map((p) => (
                <li key={p}>
                  <button type="button" onClick={() => { onPriorityChange(p as TaskPriority); setIsPriorityOpen(false); }} className={optionClass(priority === p)}>
                    {formatOptionLabel(p)}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {mode === "edit" && status && onStatusChange && (
        <div className="space-y-1.5">
          <label className={labelClass}>Status</label>
          <div ref={statusRef} className="relative">
            <button type="button" onClick={() => setIsStatusOpen((v) => !v)} className={dropdownButtonClass}>
              <span>{formatOptionLabel(status)}</span><span className="text-zinc-500 dark:text-zinc-400">v</span>
            </button>
            {isStatusOpen && (
              <ul className={dropdownMenuClass}>
                {TASK_STATUS_OPTIONS.filter((s) => s !== "all").map((s) => (
                  <li key={s}>
                    <button type="button" onClick={() => { onStatusChange(s as TaskStatus); setIsStatusOpen(false); }} className={optionClass(status === s)}>
                      {formatOptionLabel(s)}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <label className={labelClass}>Assignee</label>
        <div ref={assigneeRef} className="relative">
          <button type="button" disabled={isUsersLoading} onClick={() => setIsAssigneeOpen((v) => !v)} className={dropdownButtonClass}>
            <span className="truncate">{assigneeLabel}</span><span className="text-zinc-500 dark:text-zinc-400">v</span>
          </button>
          {isAssigneeOpen && !isUsersLoading && (
            <ul className={`${dropdownMenuClass} max-h-64 overflow-y-auto`}>
              <li>
                <button type="button" onClick={() => { onAssigneeChange(""); setIsAssigneeOpen(false); }} className={optionClass(assigneeId === "")}>
                  Unassigned
                </button>
              </li>
              {users.map((user) => (
                <li key={user.id}>
                  <button type="button" onClick={() => { onAssigneeChange(String(user.id)); setIsAssigneeOpen(false); }} className={optionClass(assigneeId === String(user.id))}>
                    {getUserLabel(user)}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
