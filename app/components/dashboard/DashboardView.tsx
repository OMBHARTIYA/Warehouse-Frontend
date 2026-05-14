import Skeleton from "../Skeleton";
import ChartsSection from "./ChartsSection";
import DashboardHeader from "./DashboardHeader";
import { ProjectStatsSection, RecentTasksSection, UserActivitySection } from "./DataSections";
import StatsOverview from "./StatsOverview";
import { percent, useDashboardStats } from "./hooks/useDashboardStats";

export default function DashboardView() {
  const state = useDashboardStats();

  if (state.loading) {
    return <div className="space-y-8"><section><h2 className="text-2xl font-semibold text-zinc-900">Dashboard</h2><p className="mt-2 text-zinc-600">Loading statistics...</p></section><section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <div key={index} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6"><Skeleton className="h-4 w-28" /><Skeleton className="mt-3 h-8 w-16" /></div>)}</section></div>;
  }

  if (state.error) return <><h2 className="text-2xl font-semibold text-zinc-900">Dashboard</h2><p className="mt-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p></>;
  if (!state.hasAnyData) return <><h2 className="text-2xl font-semibold text-zinc-900">Dashboard</h2><p className="mt-2 text-zinc-600">No statistics available yet.</p></>;

  return (
    <div className="space-y-6 lg:space-y-7">
      <DashboardHeader
        searchQuery={state.searchQuery}
        searchSuggestions={state.searchSuggestions}
        shouldShowSuggestions={state.isSearchFocused && state.normalizedQuery.length >= 1}
        onSearchQueryChange={state.setSearchQuery}
        onSearchFocus={() => state.setIsSearchFocused(true)}
        onSearchBlur={() => setTimeout(() => state.setIsSearchFocused(false), 120)}
      />
      <StatsOverview totalProjects={state.data?.totalProjects ?? 0} totalTasks={state.data?.totalTasks ?? 0} completedTasks={state.data?.completedTasks ?? 0} completionRate={percent(state.data?.completionRate ?? 0)} />
      <section className="grid min-w-0 gap-5 xl:grid-cols-12">
        <div className="space-y-5 xl:col-span-8">
          <ChartsSection tasksByStatus={state.tasksByStatus} priorityBars={state.priorityBars} />
          <section className="grid min-w-0 gap-5 xl:grid-cols-2">
            <ProjectStatsSection rows={state.projectStats} percent={percent} />
            <UserActivitySection rows={state.userActivity} percent={percent} />
          </section>
        </div>
        <div className="xl:col-span-4">
          <RecentTasksSection tasks={state.filteredRecentTasks} emptyMessage={state.normalizedQuery ? "No tasks match your search." : "No recent tasks."} />
        </div>
      </section>
    </div>
  );
}
