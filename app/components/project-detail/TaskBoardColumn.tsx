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
          className={`rounded-lg border p-3 ${
            snapshot.isDraggingOver ? "border-zinc-500 bg-zinc-100" : "border-zinc-200 bg-zinc-50"
          }`}
        >
          <h3 className="mb-3 text-sm font-semibold text-zinc-800">{title}</h3>
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
