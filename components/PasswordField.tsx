"use client";

import { useState } from "react";

const inputClass =
  "w-full h-12 rounded-xs border border-[var(--border-subtle)] bg-onyx-700 px-3.5 text-sm text-ink placeholder:text-dim focus:outline-none focus:border-[var(--border-accent)]";

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 12s3.5-7 10-7c1.6 0 3 .32 4.24.84M22 12s-3.5 7-10 7c-1.6 0-3-.32-4.24-.84" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
      <path d="M3 3l18 18" />
    </svg>
  );
}

export function PasswordField({
  value,
  onChange,
  placeholder,
  required,
  minLength,
  maxLength,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} pr-11`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Şifreyi gizle" : "Şifreyi göster"}
        className="absolute right-0 top-0 h-12 w-11 flex items-center justify-center text-dim hover:text-ink transition-colors duration-[180ms]"
      >
        <EyeIcon open={visible} />
      </button>
    </div>
  );
}
