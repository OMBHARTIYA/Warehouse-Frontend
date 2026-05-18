import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartCard from "./ChartCard";

type PriorityBar = {
  label: string;
  count: number;
  color: string;
};

type PriorityValueLabelProps = {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  value?: number | string;
  fill?: string;
};

const PRIORITY_COLORS: Record<string, string> = {
  critical: "#dc2626",
  high: "#f97316",
  medium: "#eab308",
  low: "#16a34a",
};

function formatPriorityLabel(label: string) {
  return label
    .replace(/_/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function getPriorityColor(label: string, fallback: string) {
  const normalized = label.replace(/_/g, " ").trim().toLowerCase();
  return PRIORITY_COLORS[normalized] ?? fallback;
}

function PriorityTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; payload?: { label?: string; color?: string } }>;
}) {
  if (!active || !payload?.length) return null;

  const item = payload[0];
  const label = item?.name ?? item?.payload?.label ?? "";
  const value = item?.value ?? 0;
  const color = item?.payload?.color ?? "#52525b";

  return (
    <div className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-lg shadow-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-black/30">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
        <p className="font-semibold text-zinc-900 dark:text-zinc-100">{formatPriorityLabel(label)}</p>
      </div>
      <p className="mt-1 text-zinc-600 dark:text-zinc-400">{value} tasks</p>
    </div>
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
      x={safeX - 3}
      y={safeY - 6}
      width={safeWidth + 6}
      height={safeHeight + 6}
      radius={[16, 16, 8, 8]}
      fill={safeFill}
      style={{
        outline: "none",
        filter: "drop-shadow(0 12px 16px rgba(15,23,42,0.16))",
        transition: "all 180ms ease",
      }}
    />
  );
}

function PriorityValueLabel({ x = 0, y = 0, width = 0, value, fill = "#3f3f46" }: PriorityValueLabelProps) {
  if (value === undefined || value === null) return null;

  const labelX = Number(x) + Number(width) / 2;
  const labelY = Number(y) - 10;

  return (
    <text
      x={labelX}
      y={labelY}
      textAnchor="middle"
      dominantBaseline="middle"
      fill={fill}
      style={{ fill }}
      className="text-xs font-bold sm:text-sm"
    >
      {value}
    </text>
  );
}

export default function TaskPriorityChart({ priorityBars }: { priorityBars: PriorityBar[] }) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>();
  const chartData = priorityBars.map((entry) => ({
    ...entry,
    label: formatPriorityLabel(entry.label),
    color: getPriorityColor(entry.label, entry.color),
  }));

  return (
    <ChartCard title="Tasks by Priority" empty={priorityBars.length === 0} emptyText="No priority data.">
      <div className="h-full min-h-[1px] w-full min-w-[1px] overflow-hidden rounded-2xl bg-gradient-to-b from-zinc-50/70 to-white px-1 pt-2 dark:from-zinc-900/80 dark:to-zinc-950/30">
        <ResponsiveContainer width="100%" height={260} minWidth={1} minHeight={1} debounce={50}>
          <BarChart
            data={chartData}
            margin={{ top: 28, right: 18, bottom: 12, left: -8 }}
            barCategoryGap="26%"
            tabIndex={-1}
            style={{ outline: "none" }}
            onMouseLeave={() => setActiveIndex(undefined)}
            onMouseMove={(state) => {
              if (typeof state?.activeTooltipIndex === "number") {
                setActiveIndex(state.activeTooltipIndex);
              }
            }}
            onClick={(state, event) => {
              event?.stopPropagation?.();

              if (typeof state?.activeTooltipIndex === "number") {
                setActiveIndex(state.activeTooltipIndex);
              }
            }}
          >
            <CartesianGrid vertical={false} stroke="var(--border-soft)" strokeDasharray="4 6" />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tickMargin={12}
              interval={0}
              tick={{ fill: "currentColor", fontSize: 13, fontWeight: 600 }}
              className="text-zinc-600 dark:text-zinc-300"
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              width={34}
              tick={{ fill: "currentColor", fontSize: 12, fontWeight: 500 }}
              className="text-zinc-500 dark:text-zinc-400"
            />

            <Tooltip
              cursor={{ fill: "rgba(113, 113, 122, 0.12)", radius: 16 }}
              content={<PriorityTooltip />}
            />

            <Bar
              dataKey="count"
              radius={[16, 16, 8, 8]}
              activeBar={ActiveBarShape}
              maxBarSize={58}
              isAnimationActive
            >
              <LabelList dataKey="count" position="top" offset={10} content={<PriorityValueLabel />} />
              {chartData.map((entry, index) => (
                <Cell
                  key={entry.label}
                  fill={entry.color}
                  fillOpacity={activeIndex === undefined || activeIndex === index ? 1 : 0.5}
                  stroke="none"
                  style={{ outline: "none" }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
