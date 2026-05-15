import { useState } from "react";
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
const RADIAN = Math.PI / 180;

type StatusLabelProps = {
  cx?: number | string;
  cy?: number | string;
  midAngle?: number;
  outerRadius?: number;
  percent?: number;
  fill?: string;
  payload?: { label?: string };
  value?: number;
};

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
    <div className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-lg shadow-zinc-900/10">
      <p className="font-semibold text-zinc-900">{formatStatusLabel(label)}</p>
      <p className="text-zinc-600">{value} tasks</p>
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

      <text x={safeCx} y={safeCy - 6} textAnchor="middle" dominantBaseline="middle" className="fill-zinc-900 text-sm font-semibold">
        {safeValue}
      </text>
      <text x={safeCx} y={safeCy + 14} textAnchor="middle" dominantBaseline="middle" className="fill-zinc-500 text-[11px] font-medium">
        {safeLabel}
      </text>
    </g>
  );
}

function renderStatusLabel({
  cx = 0,
  cy = 0,
  midAngle = 0,
  outerRadius = 0,
  percent = 0,
  fill = "#16a34a",
  payload,
  value = 0,
}: StatusLabelProps) {
  if (!value || percent <= 0) return null;

  const centerX = Number(cx);
  const centerY = Number(cy);
  const angle = -midAngle * RADIAN;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const isLeft = cos < -0.18;
  const isRight = cos > 0.18;
  const labelRadius = outerRadius + 26;
  const rawX = centerX + labelRadius * cos + (isRight ? 8 : isLeft ? -8 : 0);
  const x = isLeft ? Math.max(rawX, 150) : rawX;
  const y = centerY + labelRadius * sin + (sin < -0.8 ? -2 : Math.abs(sin) < 0.15 ? 6 : 0);
  const textAnchor = isLeft ? "end" : isRight ? "start" : "middle";
  const label = formatStatusLabel(payload?.label ?? "");
  const percentage = Math.round(percent * 100);

  return (
    <text x={x} y={y} textAnchor={textAnchor} dominantBaseline="central" fill={fill} className="text-xs font-semibold sm:text-sm">
      {label} {percentage}%
    </text>
  );
}

export default function TaskStatusChart({ tasksByStatus }: { tasksByStatus: MetricRow[] }) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>();
  const chartData = tasksByStatus.map((item, index) => ({
    ...item,
    label: formatStatusLabel(item.label),
    color: getStatusColor(item.label, index),
  }));

  return (
    <ChartCard title="Tasks by Status" empty={tasksByStatus.length === 0} emptyText="No status data.">
      <div className="flex h-full min-h-0 flex-col">
        <div className="min-h-0 flex-1 rounded-2xl bg-gradient-to-b from-zinc-50/70 to-white pt-2">
          <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
            <PieChart
              margin={{ top: 22, right: 82, bottom: 12, left: 92 }}
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
                innerRadius={56}
                outerRadius={84}
                paddingAngle={2}
                // Recharts runtime supports this prop; local v3 typings omit it.
                // @ts-expect-error activeIndex is intentionally passed for active slice behavior.
                activeIndex={activeIndex}
                activeShape={ActiveStatusSlice}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onClick={(_, index, event) => {
                  event?.stopPropagation?.();
                  setActiveIndex(index);
                }}
                label={renderStatusLabel}
                labelLine={{ strokeWidth: 1.5, strokeOpacity: 0.38 }}
                isAnimationActive
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`status-${entry.label}`}
                    fill={entry.color}
                    fillOpacity={activeIndex === undefined || activeIndex === index ? 1 : 0.55}
                    stroke="#fff"
                    strokeWidth={3}
                    style={{ outline: "none" }}
                  />
                ))}
              </Pie>

              <Tooltip cursor={false} content={<StatusTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-zinc-700">
          {chartData.map((entry) => (
            <div key={entry.label} className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="font-semibold">{entry.label}</span>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
}
