import { Draggable } from "@hello-pangea/dnd";
import PriorityBadge from "./PriorityBadge";
import type { Task } from "./types";

type TaskCardProps = {
  task: Task;
  index: number;
};

export default function TaskCard({ task, index }: TaskCardProps) {
  return (
    <Draggable key={String(task.id)} draggableId={String(task.id)} index={index}>
      {(dragProvided) => (
        <article
          ref={dragProvided.innerRef}
          {...dragProvided.draggableProps}
          {...dragProvided.dragHandleProps}
          className="rounded-md border border-zinc-200 bg-white p-3 text-sm shadow-sm"
        >
          <p className="font-medium text-zinc-900">{task.title}</p>
          <div className="mt-1">
            <PriorityBadge priority={task.priority} />
          </div>
          <p className="mt-2 text-xs text-zinc-600">Assignee: {task.assignee ?? task.assigneeId ?? task.assignee_id ?? "Unassigned"}</p>
          <p className="mt-1 text-xs text-zinc-500">Created: {task.created_at ? new Date(task.created_at).toLocaleString() : "N/A"}</p>
        </article>
      )}
    </Draggable>
  );
}
