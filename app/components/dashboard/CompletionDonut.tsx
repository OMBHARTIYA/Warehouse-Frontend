function completionColor(value: number): string {
  if (value >= 70) return "#16a34a";
  if (value >= 40) return "#f97316";
  return "#dc2626";
}

export default function CompletionDonut({ value }: { value: number }) {
  const safeValue = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
  const radius = 7;
  const stroke = 3;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (safeValue / 100) * circumference;
  const color = completionColor(safeValue);

  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" className="shrink-0">
      <circle cx="10" cy="10" r={radius} fill="none" stroke="#e4e4e7" strokeWidth={stroke} />
      <circle
        cx="10"
        cy="10"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        transform="rotate(-90 10 10)"
      />
    </svg>
  );
}
