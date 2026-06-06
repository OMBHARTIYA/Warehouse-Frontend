import Skeleton from "../Skeleton";
import ChartsSection from "./ChartsSection";
import DashboardHeader from "./DashboardHeader";
import { ProjectStatsSection, RecentTasksSection, UserActivitySection } from "./DataSections";
import StatsOverview from "./StatsOverview";
import { percent, useDashboardStats } from "./hooks/useDashboardStats";

export default function DashboardView() {
  const state = useDashboardStats();
  const hasUserActivity = state.userActivity.length > 0;

  if (state.loading) {
    return <div className="space-y-8"><section><h2 className="text-2xl font-semibold text-zinc-900">Warehouse Overview</h2><p className="mt-2 text-zinc-600">Loading warehouse statistics...</p></section><section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <div key={index} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6"><Skeleton className="h-4 w-28" /><Skeleton className="mt-3 h-8 w-16" /></div>)}</section></div>;
  }

  if (state.error) return <><h2 className="text-2xl font-semibold text-zinc-900">Warehouse Overview</h2><p className="mt-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p></>;
  if (!state.hasAnyData) return <><h2 className="text-2xl font-semibold text-zinc-900">Warehouse Overview</h2><p className="mt-2 text-zinc-600">No warehouse statistics available yet.</p></>;

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
      <StatsOverview totalWarehouses={state.data?.totalWarehouses ?? 0} totalProducts={state.data?.totalProducts ?? 0} totalUnits={state.data?.totalUnits ?? 0} lowStockItems={state.data?.lowStockItems ?? 0} completionRate={percent(state.data?.completionRate ?? 0)} />
      <section className="grid min-w-0 gap-5 xl:grid-cols-12">
        <div className="min-w-0 space-y-5 xl:col-span-9">
          <ChartsSection tasksByStatus={state.tasksByStatus} priorityBars={state.priorityBars} />
          <section className={`grid min-w-0 gap-5 ${hasUserActivity ? "xl:grid-cols-2" : "xl:grid-cols-1"}`}>
            <ProjectStatsSection rows={state.projectStats} percent={percent} />
            {hasUserActivity && <UserActivitySection rows={state.userActivity} percent={percent} />}
          </section>
        </div>
        <div className="min-w-0 xl:col-span-3">
          <RecentTasksSection tasks={state.filteredRecentTasks} emptyMessage={state.normalizedQuery ? "No movements match your search." : "No recent movements."} />
        </div>
      </section>
    </div>
  );
}
