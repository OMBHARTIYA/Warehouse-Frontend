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

  return (
    <section className="space-y-6">
      <TasksHeader />
      {!tasksState.isLoading && !tasksState.error && tasksState.tasks.length > 0 && <TaskFilters statusFilter={filters.statusFilter} priorityFilter={filters.priorityFilter} onStatusChange={filters.setStatusFilter} onPriorityChange={filters.setPriorityFilter} onReset={filters.reset} />}
      {tasksState.isLoading && <div className="overflow-x-auto rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-2)] p-5 sm:p-6"><div className="min-w-full"><Skeleton className="h-5 w-24" /><div className="mt-4 space-y-3">{Array.from({ length: 5 }).map((_, index) => <div key={index} className="grid grid-cols-7 gap-3"><Skeleton className="h-4" /><Skeleton className="h-4" /><Skeleton className="h-4" /><Skeleton className="h-4" /><Skeleton className="h-4" /><Skeleton className="h-4" /><Skeleton className="h-4" /></div>)}</div></div></div>}
      {!tasksState.isLoading && tasksState.error && <div className="rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-2)] p-5 sm:p-6"><ErrorMessage message={tasksState.error} /></div>}
      {!tasksState.isLoading && !tasksState.error && tasksState.tasks.length === 0 && <div className="rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-2)] p-5 sm:p-6"><p className="text-sm text-zinc-500">No tasks found.</p></div>}
      {!tasksState.isLoading && !tasksState.error && tasksState.tasks.length > 0 && filters.filteredTasks.length === 0 && <div className="rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-2)] p-5 sm:p-6"><p className="text-sm text-zinc-500">No tasks match the selected filters.</p></div>}
      {!tasksState.isLoading && !tasksState.error && filters.filteredTasks.length > 0 && <TasksTable tasks={filters.filteredTasks} />}
    </section>
  );
}

