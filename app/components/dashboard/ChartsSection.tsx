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

const PIE_COLORS = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
];

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

function ChartCard({ title, empty, emptyText, children }: ChartCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition-all sm:p-5">
      <h3 className="text-base font-semibold tracking-tight text-zinc-900 sm:text-lg">{title}</h3>

      {empty ? (
        <p className="mt-3 text-sm text-zinc-500">{emptyText}</p>
      ) : (
        <div className="mt-3 flex h-60 min-h-60 w-full items-center justify-center pb-2 sm:h-64 sm:min-h-64 sm:pb-0">
          <div className="h-full w-full">{children}</div>
        </div>
      )}
    </div>
  );
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
      <p className="font-medium text-zinc-900">
        {label}
      </p>
      <p className="text-zinc-600">count : {value}</p>
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
  const safeFill = fill ?? "#2563eb";
  const safeLabel = payload?.label ?? "";
  const safeValue = value ?? 0;

  return (
    <g tabIndex={-1} style={{ outline: "none" }}>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={safeInnerRadius}
        outerRadius={safeOuterRadius + 10}
        startAngle={safeStartAngle}
        endAngle={safeEndAngle}
        fill={safeFill}
        style={{
          outline: "none",
          filter: "drop-shadow(0 10px 16px rgba(0,0,0,0.22))",
          transition: "all 180ms ease",
        }}
      />

      <text
        x={safeCx}
        y={safeCy}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-zinc-900 text-sm font-semibold"
      >
        {safeLabel}: {safeValue}
      </text>
    </g>
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
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
      <PieChart
        tabIndex={-1}
        style={{ outline: "none" }}
        onMouseLeave={() => onActiveChange(undefined)}
      >
        <Pie
          data={data}
          dataKey="count"
          nameKey="label"
          outerRadius={90}
          // Recharts runtime supports this prop; local v3 typings omit it.
          // @ts-expect-error activeIndex is intentionally passed for active slice behavior.
          activeIndex={activeIndex}
          activeShape={ActivePieShape}
          onMouseEnter={(_, index) => onActiveChange(index)}
          onClick={(_, index, event) => {
            event?.stopPropagation?.();
            onActiveChange(index);
          }}
          label
          isAnimationActive
        >
          {data.map((_, index) => (
            <Cell
              key={`status-${index}`}
              fill={PIE_COLORS[index % PIE_COLORS.length]}
              fillOpacity={
                activeIndex === undefined || activeIndex === index ? 1 : 0.45
              }
              stroke="none"
              style={{ outline: "none" }}
            />
          ))}
        </Pie>

        <Tooltip cursor={false} content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
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
    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
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
