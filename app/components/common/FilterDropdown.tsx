"use client";

import { useEffect, useRef, useState } from "react";

type FilterOption<T extends string> = {
  value: T;
  label: string;
};

type FilterDropdownProps<T extends string> = {
  id: string;
  label: string;
  value: T;
  options: Array<FilterOption<T>>;
  onChange: (value: T) => void;
  className?: string;
};

export default function FilterDropdown<T extends string>({
  id,
  label,
  value,
  options,
  onChange,
  className,
}: FilterDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const selectedLabel = options.find((option) => option.value === value)?.label ?? value;

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onEscape);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onEscape);
    };
  }, []);

  return (
    <div className={className ?? "space-y-1.5 sm:w-56"}>
      <label htmlFor={id} className="text-sm font-medium text-zinc-700">
        {label}
      </label>
      <div ref={rootRef} className="relative">
        <button
          id={id}
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex h-11 w-full items-center justify-between rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] px-3.5 py-2 text-sm text-zinc-900 outline-none transition hover:bg-white focus:border-[var(--brand-red-border)] focus:ring-2 focus:ring-[var(--brand-red-soft)]"
        >
          <span className="truncate">{selectedLabel}</span>
          <span className="text-zinc-500" aria-hidden="true">v</span>
        </button>
        {isOpen && (
          <ul className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-20 max-h-64 overflow-y-auto rounded-xl border border-[var(--border-soft)] bg-white shadow-sm">
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3.5 py-2 text-left text-sm transition ${
                    value === option.value
                      ? "bg-[var(--brand-red-soft)] text-[var(--brand-red-strong)]"
                      : "text-zinc-700 hover:bg-zinc-50"
                  }`}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
