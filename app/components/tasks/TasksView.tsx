import EmptyState from "../common/states/EmptyState";
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
  const completedCount = tasksState.tasks.filter((task) => task.status?.toLowerCase() === "completed" || task.status?.toLowerCase() === "done").length;
  const draftCount = tasksState.tasks.filter((task) => task.status?.toLowerCase() === "draft").length;

  return (
    <section className="space-y-6">
      <TasksHeader total={tasksState.tasks.length} visible={filters.filteredTasks.length} completed={completedCount} draft={draftCount} />

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
        <div className="overflow-x-auto rounded-3xl border border-[var(--border-soft)] bg-white p-5 shadow-sm transition-colors dark:bg-[var(--surface-2)] dark:shadow-black/20 sm:p-6">
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
        <div className="rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-2)] p-5 shadow-sm dark:shadow-black/20 sm:p-6">
          <ErrorMessage message={tasksState.error} />
        </div>
      )}

      {!tasksState.isLoading && !tasksState.error && tasksState.tasks.length === 0 && (<EmptyState title="No movements yet" description="Movements will appear here when stock activity is recorded." />)}

      {!tasksState.isLoading && !tasksState.error && tasksState.tasks.length > 0 && filters.filteredTasks.length === 0 && (<EmptyState title="No movements match these filters" description="Try changing movement filters or reset them." />)}

      {!tasksState.isLoading && !tasksState.error && filters.filteredTasks.length > 0 && <TasksTable tasks={filters.filteredTasks} />}
    </section>
  );
}




