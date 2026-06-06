import type { Task } from "./types";
import {
  formatEntityLabel,
  formatPriorityLabel,
  formatStatusLabel,
  getPriorityBadgeClass,
  getStatusBadgeClass,
} from "./taskUtils";

function resolveProjectName(task: Task): string {
  return (
    formatEntityLabel(task.warehouse_name, "") ||
    formatEntityLabel(task.source_warehouse_name, "") ||
    formatEntityLabel(task.destination_warehouse_name, "") ||
    formatEntityLabel(task.projectName, "") ||
    formatEntityLabel(task.project_name, "") ||
    formatEntityLabel(task.project, "") ||
    (task.projectId ?? task.project_id ? `Warehouse #${String(task.projectId ?? task.project_id)}` : "Unknown warehouse")
  );
}

function resolveQuantityLabel(task: Task): string {
  if (typeof task.quantity === "number") {
    return `${task.quantity} units`;
  }

  return (
    formatEntityLabel(task.assigneeName, "") ||
    formatEntityLabel(task.assignee_name, "") ||
    formatEntityLabel(task.assignee, "") ||
    "N/A"
  );
}

function resolveMovementLabel(task: Task): string {
  if (task.source_warehouse_name && task.destination_warehouse_name) {
    return `${task.source_warehouse_name} → ${task.destination_warehouse_name}`;
  }

  return resolveProjectName(task);
}

export default function TasksTable({ tasks }: { tasks: Task[] }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition-colors dark:border-zinc-700 dark:bg-[var(--surface-2)] dark:shadow-black/20">
      <div className="overflow-x-auto">
        <table className="min-w-[980px] text-left text-sm text-zinc-700 dark:text-zinc-300">
          <thead className="bg-gradient-to-r from-zinc-50 to-white text-[11px] uppercase tracking-[0.14em] text-zinc-500 dark:from-zinc-900/80 dark:to-zinc-950/60 dark:text-zinc-400">
            <tr>
              <th className="w-12 px-4 py-4 font-bold">#</th>
              <th className="px-4 py-4 font-bold">Reference</th>
              <th className="px-4 py-4 font-bold">Product</th>
              <th className="px-4 py-4 font-bold">Status</th>
              <th className="px-4 py-4 font-bold">Type</th>
              <th className="px-4 py-4 font-bold">Warehouse</th>
              <th className="px-4 py-4 font-bold">Quantity</th>
              <th className="px-4 py-4 text-right font-bold">Logged</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {tasks.map((task, index) => {
              const projectValue = resolveMovementLabel(task);
              const quantityValue = resolveQuantityLabel(task);
              const movementType = task.movement_type ?? task.priority ?? "inbound";

              return (
                <tr key={task.id} className="group transition-colors hover:bg-rose-50/30 dark:hover:bg-rose-950/10">
                  <td className="px-4 py-4 align-middle font-semibold text-zinc-400 group-hover:text-[var(--brand-red-strong)] dark:text-zinc-500 dark:group-hover:text-rose-300">{index + 1}</td>
                  <td className="px-4 py-4 align-middle">
                    <div className="max-w-[220px]">
                      <p className="truncate font-semibold text-zinc-900 transition-colors group-hover:text-[var(--brand-red-strong)] dark:text-zinc-100 dark:group-hover:text-rose-200">{task.reference_code ?? task.title ?? task.product_name ?? "Movement"}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <p className="line-clamp-2 max-w-xs text-sm leading-5 text-zinc-500 dark:text-zinc-400">
                      {task.product_name?.trim()
                        ? `${task.product_name}${task.sku ? ` (${task.sku})` : ""}`
                        : task.description?.trim()
                          ? task.description
                          : task.notes?.trim()
                            ? task.notes
                            : "No product details"}
                    </p>
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <span className={`inline-flex whitespace-nowrap items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${getStatusBadgeClass(task.status)}`}>
                      {formatStatusLabel(task.status)}
                    </span>
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <span className={`inline-flex whitespace-nowrap items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${getPriorityBadgeClass(movementType)}`}>
                      {formatPriorityLabel(movementType)}
                    </span>
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <span className="inline-flex max-w-[180px] truncate rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-semibold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-200">
                      {projectValue}
                    </span>
                  </td>
                  <td className="px-4 py-4 align-middle text-zinc-700 dark:text-zinc-300">
                    <span className="font-medium">{quantityValue}</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-right align-middle text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    {task.created_at ? new Date(task.created_at).toLocaleDateString() : "N/A"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
