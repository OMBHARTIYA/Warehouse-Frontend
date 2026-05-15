import { Draggable } from "@hello-pangea/dnd";
import PriorityBadge from "./PriorityBadge";
import type { Task } from "./types";

type TaskCardProps = {
  task: Task;
  index: number;
};

function assigneeLabel(task: Task) {
  return task.assignee ?? task.assigneeName ?? task.assignee_name ?? "Unassigned";
}

export default function TaskCard({ task, index }: TaskCardProps) {
  return (
    <Draggable key={String(task.id)} draggableId={String(task.id)} index={index}>
      {(dragProvided, snapshot) => (
        <article
          ref={dragProvided.innerRef}
          {...dragProvided.draggableProps}
          {...dragProvided.dragHandleProps}
          className={`rounded-xl border border-zinc-200 bg-white p-3 text-sm shadow-sm transition hover:shadow dark:border-zinc-700 dark:bg-zinc-900/70 dark:shadow-black/20 dark:hover:border-zinc-600 ${
            snapshot.isDragging ? "rotate-1 shadow-lg dark:border-rose-800/80" : ""
          }`}
        >
          <p className="font-medium text-zinc-900 dark:text-zinc-100">{task.title}</p>
          <div className="mt-1">
            <PriorityBadge priority={task.priority} />
          </div>
          <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-300">Assignee: {assigneeLabel(task)}</p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Created: {task.created_at ? new Date(task.created_at).toLocaleDateString() : "N/A"}</p>
        </article>
      )}
    </Draggable>
  );
}
