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
      {(dragProvided) => (
        <article
          ref={dragProvided.innerRef}
          {...dragProvided.draggableProps}
          {...dragProvided.dragHandleProps}
          className="rounded-xl border border-zinc-200 bg-white p-3 text-sm shadow-sm transition hover:shadow"
        >
          <p className="font-medium text-zinc-900">{task.title}</p>
          <div className="mt-1">
            <PriorityBadge priority={task.priority} />
          </div>
          <p className="mt-2 text-xs text-zinc-600">Assignee: {assigneeLabel(task)}</p>
          <p className="mt-1 text-xs text-zinc-500">Created: {task.created_at ? new Date(task.created_at).toLocaleDateString() : "N/A"}</p>
        </article>
      )}
    </Draggable>
  );
}
