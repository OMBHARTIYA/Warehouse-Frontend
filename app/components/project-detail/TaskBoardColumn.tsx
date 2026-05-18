import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import type { Task } from "./types";

type TaskBoardColumnProps = {
  droppableId: "todo" | "in_progress" | "done";
  title: string;
  tasks: Task[];
};

export default function TaskBoardColumn({ droppableId, title, tasks }: TaskBoardColumnProps) {
  return (
    <Droppable droppableId={droppableId}>
      {(provided, snapshot) => (
        <section
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`rounded-2xl border p-3 shadow-sm transition-colors ${
            snapshot.isDraggingOver
              ? "border-zinc-500 bg-zinc-100 dark:border-rose-800/80 dark:bg-rose-950/20"
              : "border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-[var(--surface-2)]"
          }`}
        >
          <h3 className="mb-3 text-sm font-semibold text-zinc-800 dark:text-zinc-100">{title}</h3>
          <div className="space-y-2">
            {tasks.map((task, index) => (
              <TaskCard key={String(task.id)} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        </section>
      )}
    </Droppable>
  );
}
