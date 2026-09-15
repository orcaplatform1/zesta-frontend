"use client";

import { useEffect, useRef, useState } from "react";

export interface DropdownOption {
  value: string;
  label: string;
}

/** Native &lt;select&gt;'in açılır listesi tarayıcı tarafından render edildiği
 * için CSS ile tema verilemez — bu, tetikleyici ve liste paneli tamamen kendi
 * markette çizilen, site paletiyle uyumlu bir alternatif. */
export function Dropdown({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: DropdownOption[];
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex h-12 w-full items-center justify-between rounded-xs border border-[var(--border-subtle)] bg-onyx-700 px-3.5 text-sm transition-colors duration-[180ms] focus:outline-none focus:border-[var(--border-accent)]"
      >
        <span className={selected ? "text-ink" : "text-dim"}>{selected?.label ?? placeholder}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="flex-shrink-0 text-dim transition-transform duration-[180ms]"
          style={{ transform: open ? "rotate(180deg)" : "none" }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-30 mt-1.5 max-h-60 overflow-y-auto rounded-xs border border-[var(--border-subtle)] bg-onyx-700 shadow-[var(--shadow-lg)]">
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className="block w-full px-3.5 py-2.5 text-left text-sm text-ink transition-colors duration-[180ms] hover:bg-onyx-800"
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
