import CompletionDonut from "./CompletionDonut";
import type { UserActivity } from "./types";

type UserActivityWithOptional = UserActivity & { username?: string; email?: string };

export default function UserActivitySection({ rows, percent }: { rows: UserActivity[]; percent: (value: number) => string }) {
  if (rows.length === 0) return null;

  return (
    <section className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition-colors dark:border-zinc-700 dark:bg-[var(--surface-2)] dark:shadow-black/20 sm:p-5">
      <h3 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-lg">Operator Activity</h3>
      <div className="mt-3 w-full max-w-full overflow-x-auto">
        <table className="min-w-[560px] text-left text-sm sm:min-w-full">
          <thead>
            <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
              <th className="px-2 py-2 font-medium">User</th>
              <th className="whitespace-nowrap px-2 py-2 text-right font-medium">Logged</th>
              <th className="whitespace-nowrap px-2 py-2 text-right font-medium">Completed</th>
              <th className="whitespace-nowrap px-2 py-2 text-right font-medium">Completion</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((user, index) => {
              const optional = user as UserActivityWithOptional;
              return (
                <tr key={String(user.userId ?? user.id ?? index)} className="border-b border-zinc-100/90 last:border-0 dark:border-zinc-800">
                  <td className="px-2 py-2.5 text-zinc-900 dark:text-zinc-100">{user.userName ?? user.user_name ?? user.name ?? optional.username ?? optional.email ?? "Unknown"}</td>
                  <td className="whitespace-nowrap px-2 py-2.5 text-right tabular-nums text-zinc-700 dark:text-zinc-300">{user.assignedTasks ?? user.assigned_tasks ?? 0}</td>
                  <td className="whitespace-nowrap px-2 py-2.5 text-right tabular-nums text-zinc-700 dark:text-zinc-300">{user.completedTasks ?? user.completed_tasks ?? 0}</td>
                  <td className="whitespace-nowrap px-2 py-2.5 text-zinc-700 dark:text-zinc-300">
                    <span className="inline-flex w-full items-center justify-end gap-2">
                      <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 tabular-nums text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">{percent(user.completionRate ?? user.completion_rate ?? 0)}</span>
                      <CompletionDonut value={user.completionRate ?? user.completion_rate ?? 0} />
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
