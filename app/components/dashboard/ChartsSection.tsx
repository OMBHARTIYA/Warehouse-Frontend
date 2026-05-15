import TaskPriorityChart from "./TaskPriorityChart";
import TaskStatusChart from "./TaskStatusChart";
import type { MetricRow } from "./types";

type PriorityBar = {
  label: string;
  count: number;
  color: string;
};

export default function ChartsSection({
  tasksByStatus,
  priorityBars,
}: {
  tasksByStatus: MetricRow[];
  priorityBars: PriorityBar[];
}) {
  return (
    <section className="space-y-4">
      <div className="grid gap-5 lg:grid-cols-2">
        <TaskStatusChart tasksByStatus={tasksByStatus} />
        <TaskPriorityChart priorityBars={priorityBars} />
      </div>
    </section>
  );
}
