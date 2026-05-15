import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  Rectangle,
  ResponsiveContainer,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MetricRow } from "./types";

const STATUS_COLORS: Record<string, string> = {
  done: "#16a34a",
  "in progress": "#f59e0b",
  in_progress: "#f59e0b",
  todo: "#e11d48",
};

const FALLBACK_STATUS_COLORS = ["#16a34a", "#f59e0b", "#e11d48", "#7c3aed"];
const RADIAN = Math.PI / 180;

type PriorityBar = {
  label: string;
  count: number;
  color: string;
};

type ChartCardProps = {
  title: string;
  empty: boolean;
  emptyText: string;
  children: React.ReactNode;
};

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

function ChartCard({ title, empty, emptyText, children }: ChartCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition-all sm:p-5">
      <h3 className="text-base font-semibold tracking-tight text-zinc-900 sm:text-lg">{title}</h3>

      {empty ? (
        <p className="mt-3 text-sm text-zinc-500">{emptyText}</p>
      ) : (
        <div className="mt-3 flex h-72 min-h-72 w-full items-center justify-center pb-2 sm:h-80 sm:min-h-80 sm:pb-0">
          <div className="h-full w-full">{children}</div>
        </div>
      )}
    </div>
  );
}

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

function CustomTooltip({
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
    <div className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-lg">
      <p className="font-medium text-zinc-900">{formatStatusLabel(label)}</p>
      <p className="text-zinc-600">Count: {value}</p>
    </div>
  );
}

function ActivePieShape(props: {
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
  const x = centerX + (outerRadius + 32) * cos + (cos >= 0 ? 8 : -8);
  const y = centerY + (outerRadius + 32) * sin + (Math.abs(sin) < 0.15 ? 8 : 0);
  const textAnchor = cos >= 0 ? "start" : "end";
  const label = formatStatusLabel(payload?.label ?? "");
  const percentage = Math.round(percent * 100);

  return (
    <text x={x} y={y} textAnchor={textAnchor} dominantBaseline="central" fill={fill} className="text-xs font-semibold sm:text-sm">
      {label} {percentage}%
    </text>
  );
}

function ActiveBarShape(props: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
}) {
  const { x, y, width, height, fill } = props;

  const safeX = x ?? 0;
  const safeY = y ?? 0;
  const safeWidth = width ?? 0;
  const safeHeight = height ?? 0;
  const safeFill = fill ?? "#2563eb";

  return (
    <Rectangle
      x={safeX - 4}
      y={safeY - 8}
      width={safeWidth + 8}
      height={safeHeight + 8}
      radius={[10, 10, 0, 0]}
      fill={safeFill}
      style={{
        outline: "none",
        filter: "drop-shadow(0 10px 16px rgba(0,0,0,0.22))",
        transition: "all 180ms ease",
      }}
    />
  );
}

function StatusPieChart({
  data,
  activeIndex,
  onActiveChange,
}: {
  data: MetricRow[];
  activeIndex?: number;
  onActiveChange: (index: number | undefined) => void;
}) {
  const chartData = data.map((item, index) => ({
    ...item,
    label: formatStatusLabel(item.label),
    color: getStatusColor(item.label, index),
  }));

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
          <PieChart
            margin={{ top: 18, right: 70, bottom: 12, left: 70 }}
            tabIndex={-1}
            style={{ outline: "none" }}
            onMouseLeave={() => onActiveChange(undefined)}
          >
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={88}
              paddingAngle={2}
              // Recharts runtime supports this prop; local v3 typings omit it.
              // @ts-expect-error activeIndex is intentionally passed for active slice behavior.
              activeIndex={activeIndex}
              activeShape={ActivePieShape}
              onMouseEnter={(_, index) => onActiveChange(index)}
              onClick={(_, index, event) => {
                event?.stopPropagation?.();
                onActiveChange(index);
              }}
              label={renderStatusLabel}
              labelLine={{ strokeWidth: 1.5, strokeOpacity: 0.45 }}
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

            <Tooltip cursor={false} content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-zinc-700">
        {chartData.map((entry) => (
          <div key={entry.label} className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="font-medium">{entry.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PriorityBarChart({
  data,
  activeIndex,
  onActiveChange,
}: {
  data: PriorityBar[];
  activeIndex?: number;
  onActiveChange: (index: number | undefined) => void;
}) {
  return (
    <ResponsiveContainer width="100%" height={240} minWidth={1} minHeight={1}>
      <BarChart
        data={data}
        tabIndex={-1}
        style={{ outline: "none" }}
        onMouseLeave={() => onActiveChange(undefined)}
        onMouseMove={(state) => {
          if (typeof state?.activeTooltipIndex === "number") {
            onActiveChange(state.activeTooltipIndex);
          }
        }}
        onClick={(state, event) => {
          event?.stopPropagation?.();

          if (typeof state?.activeTooltipIndex === "number") {
            onActiveChange(state.activeTooltipIndex);
          }
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis allowDecimals={false} />

        <Tooltip cursor={false} content={<CustomTooltip />} />

        <Bar
          dataKey="count"
          radius={[8, 8, 0, 0]}
          activeBar={ActiveBarShape}
          isAnimationActive
        >
          {data.map((entry, index) => (
            <Cell
              key={entry.label}
              fill={entry.color}
              fillOpacity={
                activeIndex === undefined || activeIndex === index ? 1 : 0.45
              }
              stroke="none"
              style={{ outline: "none" }}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default function ChartsSection({
  tasksByStatus,
  priorityBars,
}: {
  tasksByStatus: MetricRow[];
  priorityBars: PriorityBar[];
}) {
  const [activePieIndex, setActivePieIndex] = useState<number | undefined>();
  const [activeBarIndex, setActiveBarIndex] = useState<number | undefined>();

  return (
    <section className="space-y-4">
      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard
          title="Tasks by Status"
          empty={tasksByStatus.length === 0}
          emptyText="No status data."
        >
          <StatusPieChart
            data={tasksByStatus}
            activeIndex={activePieIndex}
            onActiveChange={setActivePieIndex}
          />
        </ChartCard>

        <ChartCard
          title="Tasks by Priority"
          empty={priorityBars.length === 0}
          emptyText="No priority data."
        >
          <PriorityBarChart
            data={priorityBars}
            activeIndex={activeBarIndex}
            onActiveChange={setActiveBarIndex}
          />
        </ChartCard>
      </div>
    </section>
  );
}
