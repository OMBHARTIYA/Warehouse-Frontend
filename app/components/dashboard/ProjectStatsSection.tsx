import CompletionDonut from "./CompletionDonut";
import type { ProjectStat } from "./types";

export default function ProjectStatsSection({ rows, percent }: { rows: ProjectStat[]; percent: (value: number) => string }) {
  return (
    <section className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
      <h3 className="text-base font-semibold tracking-tight text-zinc-900 sm:text-lg">Project Statistics</h3>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-zinc-500">No project statistics.</p>
      ) : (
        <div className="mt-3 w-full max-w-full overflow-x-auto">
          <table className="min-w-[640px] text-left text-sm sm:min-w-full">
            <thead>
              <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500">
                <th className="px-2 py-2 font-medium">Project</th>
                <th className="whitespace-nowrap px-2 py-2 text-right font-medium">Total</th>
                <th className="whitespace-nowrap px-2 py-2 text-right font-medium">Completed</th>
                <th className="whitespace-nowrap px-2 py-2 text-right font-medium">Completion</th>
                <th className="whitespace-nowrap px-2 py-2 text-right font-medium">Critical</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((project, index) => (
                <tr key={String(project.projectId ?? project.id ?? index)} className="border-b border-zinc-100/90 last:border-0">
                  <td className="px-2 py-2.5 text-zinc-900">
                    {project.projectName ?? project.name ?? (project.projectId ?? project.id ? `Project #${String(project.projectId ?? project.id)}` : "Untitled")}
                  </td>
                  <td className="whitespace-nowrap px-2 py-2.5 text-right tabular-nums text-zinc-700">{project.totalTasks ?? 0}</td>
                  <td className="whitespace-nowrap px-2 py-2.5 text-right tabular-nums text-zinc-700">{project.completedTasks ?? 0}</td>
                  <td className="whitespace-nowrap px-2 py-2.5 text-zinc-700">
                    <span className="inline-flex w-full items-center justify-end gap-2">
                      <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 tabular-nums text-zinc-800">{percent(project.completionRate ?? 0)}</span>
                      <CompletionDonut value={project.completionRate ?? 0} />
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-2 py-2.5 text-right tabular-nums text-zinc-700">{project.criticalTaskCount ?? project.criticalTasks ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
