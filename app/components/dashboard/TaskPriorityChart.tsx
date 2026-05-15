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
  payload?: Array<{ name?: string; value?: number; payload?: { label?: string } }>;
}) {
  if (!active || !payload?.length) return null;

  const item = payload[0];
  const label = item?.name ?? item?.payload?.label ?? "";
  const value = item?.value ?? 0;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-lg shadow-zinc-900/10">
      <p className="font-semibold text-zinc-900">{formatPriorityLabel(label)}</p>
      <p className="text-zinc-600">{value} tasks</p>
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

export default function TaskPriorityChart({ priorityBars }: { priorityBars: PriorityBar[] }) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>();
  const chartData = priorityBars.map((entry) => ({
    ...entry,
    label: formatPriorityLabel(entry.label),
    color: getPriorityColor(entry.label, entry.color),
  }));

  return (
    <ChartCard title="Tasks by Priority" empty={priorityBars.length === 0} emptyText="No priority data.">
      <div className="h-full w-full rounded-2xl bg-gradient-to-b from-zinc-50/70 to-white px-1 pt-2">
        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
          <BarChart
            data={chartData}
            margin={{ top: 26, right: 18, bottom: 12, left: -8 }}
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
            <CartesianGrid vertical={false} stroke="#e4e4e7" strokeDasharray="4 6" />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tickMargin={12}
              interval={0}
              tick={{ fill: "#52525b", fontSize: 13, fontWeight: 600 }}
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              width={34}
              tick={{ fill: "#71717a", fontSize: 12, fontWeight: 500 }}
            />

            <Tooltip
              cursor={{ fill: "rgba(244, 244, 245, 0.65)", radius: 16 }}
              content={<PriorityTooltip />}
            />

            <Bar
              dataKey="count"
              radius={[16, 16, 8, 8]}
              activeBar={ActiveBarShape}
              maxBarSize={58}
              isAnimationActive
            >
              <LabelList
                dataKey="count"
                position="top"
                offset={8}
                className="fill-zinc-700 text-xs font-semibold"
              />
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
