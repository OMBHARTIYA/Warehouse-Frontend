import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import TaskBoardColumn from "./TaskBoardColumn";
import type { Task } from "./types";

type TaskBoardViewProps = {
  columns: {
    todo: Task[];
    in_progress: Task[];
    done: Task[];
  };
  onDragEnd: (result: DropResult) => void;
};

export default function TaskBoardView({ columns, onDragEnd }: TaskBoardViewProps) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid gap-4 md:grid-cols-3">
        <TaskBoardColumn droppableId="todo" title="Todo" tasks={columns.todo} />
        <TaskBoardColumn droppableId="in_progress" title="In Progress" tasks={columns.in_progress} />
        <TaskBoardColumn droppableId="done" title="Done" tasks={columns.done} />
      </div>
    </DragDropContext>
  );
}
