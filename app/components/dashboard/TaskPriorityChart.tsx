import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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
    <div className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-lg">
      <p className="font-medium text-zinc-900">{label}</p>
      <p className="text-zinc-600">Count: {value}</p>
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

export default function TaskPriorityChart({ priorityBars }: { priorityBars: PriorityBar[] }) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>();

  return (
    <ChartCard title="Tasks by Priority" empty={priorityBars.length === 0} emptyText="No priority data.">
      <ResponsiveContainer width="100%" height={240} minWidth={1} minHeight={1}>
        <BarChart
          data={priorityBars}
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
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis allowDecimals={false} />

          <Tooltip cursor={false} content={<PriorityTooltip />} />

          <Bar dataKey="count" radius={[8, 8, 0, 0]} activeBar={ActiveBarShape} isAnimationActive>
            {priorityBars.map((entry, index) => (
              <Cell
                key={entry.label}
                fill={entry.color}
                fillOpacity={activeIndex === undefined || activeIndex === index ? 1 : 0.45}
                stroke="none"
                style={{ outline: "none" }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
