import ErrorMessage from "../ErrorMessage";
import Skeleton from "../Skeleton";
import TaskFilters from "./TaskFilters";
import TasksHeader from "./TasksHeader";
import TasksTable from "./TasksTable";
import { useTaskFilters } from "./hooks/useTaskFilters";
import { useTasks } from "./hooks/useTasks";

export default function TasksView() {
  const tasksState = useTasks();
  const filters = useTaskFilters(tasksState.tasks);
  const completedCount = tasksState.tasks.filter((task) => task.status?.toLowerCase() === "done").length;
  const unassignedCount = tasksState.tasks.filter((task) => !(task.assignee ?? task.assigneeName ?? task.assignee_name)).length;

  return (
    <section className="space-y-6">
      <TasksHeader total={tasksState.tasks.length} visible={filters.filteredTasks.length} completed={completedCount} unassigned={unassignedCount} />

      {!tasksState.isLoading && !tasksState.error && tasksState.tasks.length > 0 && (
        <TaskFilters
          statusFilter={filters.statusFilter}
          priorityFilter={filters.priorityFilter}
          onStatusChange={filters.setStatusFilter}
          onPriorityChange={filters.setPriorityFilter}
          onReset={filters.reset}
        />
      )}

      {tasksState.isLoading && (
        <div className="overflow-x-auto rounded-3xl border border-[var(--border-soft)] bg-white p-5 shadow-sm sm:p-6">
          <div className="min-w-full">
            <Skeleton className="h-5 w-24" />
            <div className="mt-4 space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="grid grid-cols-7 gap-3">
                  <Skeleton className="h-4" /><Skeleton className="h-4" /><Skeleton className="h-4" /><Skeleton className="h-4" /><Skeleton className="h-4" /><Skeleton className="h-4" /><Skeleton className="h-4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!tasksState.isLoading && tasksState.error && (
        <div className="rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-2)] p-5 sm:p-6">
          <ErrorMessage message={tasksState.error} />
        </div>
      )}

      {!tasksState.isLoading && !tasksState.error && tasksState.tasks.length === 0 && (
        <div className="rounded-3xl border border-[var(--border-soft)] bg-white p-8 text-center shadow-sm">
          <p className="text-base font-medium text-zinc-800">No tasks yet</p>
          <p className="mt-1 text-sm text-zinc-500">Tasks will appear here when they are created.</p>
        </div>
      )}

      {!tasksState.isLoading && !tasksState.error && tasksState.tasks.length > 0 && filters.filteredTasks.length === 0 && (
        <div className="rounded-3xl border border-[var(--border-soft)] bg-white p-8 text-center shadow-sm">
          <p className="text-base font-medium text-zinc-800">No tasks match these filters</p>
          <p className="mt-1 text-sm text-zinc-500">Try changing status/priority filters or reset them.</p>
        </div>
      )}

      {!tasksState.isLoading && !tasksState.error && filters.filteredTasks.length > 0 && <TasksTable tasks={filters.filteredTasks} />}
    </section>
  );
}
