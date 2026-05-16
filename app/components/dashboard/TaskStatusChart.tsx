import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Sector, Tooltip } from "recharts";
import ChartCard from "./ChartCard";
import type { MetricRow } from "./types";

const STATUS_COLORS: Record<string, string> = {
  done: "#16a34a",
  "in progress": "#f59e0b",
  in_progress: "#f59e0b",
  todo: "#e11d48",
};

const FALLBACK_STATUS_COLORS = ["#16a34a", "#f59e0b", "#e11d48", "#7c3aed"];

function formatStatusLabel(label: string) {
  const normalized = label.replace(/_/g, " ").trim().toLowerCase();
  if (normalized === "todo") return "Todo";
  if (normalized === "in progress") return "In Progress";
  if (normalized === "done") return "Done";
  return label
    .replace(/_/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function getStatusColor(label: string, index: number) {
  const normalized = label.replace(/_/g, " ").trim().toLowerCase();
  return STATUS_COLORS[normalized] ?? FALLBACK_STATUS_COLORS[index % FALLBACK_STATUS_COLORS.length];
}

function StatusTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; payload?: { label?: string } }>;
}) {
  if (!active || !payload?.length) return null;

  const item = payload[0];
  const label = item?.name ?? item?.payload?.label ?? "";
  const value = item?.value ?? 0;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-lg shadow-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-black/30">
      <p className="font-semibold text-zinc-900 dark:text-zinc-100">{formatStatusLabel(label)}</p>
      <p className="text-zinc-600 dark:text-zinc-400">{value} tasks</p>
    </div>
  );
}

function ActiveStatusSlice(props: {
  cx?: number;
  cy?: number;
  innerRadius?: number;
  outerRadius?: number;
  startAngle?: number;
  endAngle?: number;
  fill?: string;
  payload?: { label?: string };
  value?: number;
}) {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    value,
  } = props;

  const safeCx = cx ?? 0;
  const safeCy = cy ?? 0;
  const safeInnerRadius = innerRadius ?? 0;
  const safeOuterRadius = outerRadius ?? 0;
  const safeStartAngle = startAngle ?? 0;
  const safeEndAngle = endAngle ?? 0;
  const safeFill = fill ?? "#16a34a";
  const safeLabel = formatStatusLabel(payload?.label ?? "");
  const safeValue = value ?? 0;

  return (
    <g tabIndex={-1} style={{ outline: "none" }}>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={safeInnerRadius}
        outerRadius={safeOuterRadius + 8}
        startAngle={safeStartAngle}
        endAngle={safeEndAngle}
        fill={safeFill}
        style={{
          outline: "none",
          filter: "drop-shadow(0 12px 18px rgba(15,23,42,0.18))",
          transition: "all 180ms ease",
        }}
      />

      <text x={safeCx} y={safeCy - 6} textAnchor="middle" dominantBaseline="middle" className="fill-zinc-900 text-sm font-semibold dark:fill-zinc-100">
        {safeValue}
      </text>
      <text x={safeCx} y={safeCy + 14} textAnchor="middle" dominantBaseline="middle" className="fill-zinc-500 text-[11px] font-medium dark:fill-zinc-400">
        {safeLabel}
      </text>
    </g>
  );
}

export default function TaskStatusChart({ tasksByStatus }: { tasksByStatus: MetricRow[] }) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>();
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");
    const update = () => setIsCompact(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  const chartData = tasksByStatus.map((item, index) => ({
    ...item,
    label: formatStatusLabel(item.label),
    color: getStatusColor(item.label, index),
  }));
  const totalTasks = chartData.reduce((sum, item) => sum + item.count, 0);
  const activeItem = activeIndex === undefined ? null : chartData[activeIndex] ?? null;
  const centerTitle = activeItem?.label ?? "Total";
  const centerValue = activeItem?.count ?? totalTasks;
  const centerPercent =
    totalTasks > 0 ? Math.round(((activeItem?.count ?? totalTasks) / totalTasks) * 100) : 0;

  return (
    <ChartCard title="Tasks by Status" empty={tasksByStatus.length === 0} emptyText="No status data.">
      <div className="flex h-full min-h-[1px] min-w-[1px] flex-col overflow-hidden">
        <div className="min-h-[1px] min-w-[1px] flex-1 rounded-2xl border border-zinc-200/70 bg-[radial-gradient(circle_at_top,_#ffffff_0%,_#f3f4f6_58%,_#e5e7eb_100%)] pt-2 dark:border-zinc-700/70 dark:bg-[radial-gradient(circle_at_top,_#18181b_0%,_#111827_55%,_#09090b_100%)]">
          <ResponsiveContainer width="100%" height={260} minWidth={1} minHeight={1} debounce={50}>
            <PieChart
              margin={isCompact ? { top: 16, right: 18, bottom: 12, left: 18 } : { top: 24, right: 28, bottom: 18, left: 28 }}
              tabIndex={-1}
              style={{ outline: "none" }}
              onMouseLeave={() => setActiveIndex(undefined)}
            >
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={88}
                paddingAngle={3}
                // Recharts runtime supports this prop; local v3 typings omit it.
                // @ts-expect-error activeIndex is intentionally passed for active slice behavior.
                activeIndex={activeIndex}
                activeShape={ActiveStatusSlice}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onClick={(_, index, event) => {
                  event?.stopPropagation?.();
                  setActiveIndex(index);
                }}
                label={false}
                labelLine={false}
                isAnimationActive
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`status-${entry.label}`}
                    fill={entry.color}
                    fillOpacity={activeIndex === undefined || activeIndex === index ? 1 : 0.55}
                    stroke="var(--surface-2)"
                    strokeWidth={3}
                    style={{ outline: "none" }}
                  />
                ))}
              </Pie>

              <text x="50%" y="48%" textAnchor="middle" dominantBaseline="central" className="fill-zinc-900 text-3xl font-bold tracking-tight dark:fill-zinc-50">
                {centerValue}
              </text>
              <text x="50%" y="59%" textAnchor="middle" dominantBaseline="central" className="fill-zinc-500 text-xs font-semibold uppercase tracking-[0.18em] dark:fill-zinc-400">
                {centerTitle} {centerPercent}%
              </text>

              <Tooltip cursor={false} content={<StatusTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {chartData.map((entry) => (
            <div
              key={entry.label}
              className="rounded-xl border border-zinc-200 bg-zinc-50/75 px-3 py-2 text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-200"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-sm font-semibold">{entry.label}</span>
                </div>
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  {totalTasks > 0 ? Math.round((entry.count / totalTasks) * 100) : 0}%
                </span>
              </div>
              <p className="mt-1 text-lg font-bold tracking-tight">{entry.count}</p>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
}
