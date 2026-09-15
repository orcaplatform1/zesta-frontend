const METHODS = ["Visa", "Mastercard", "Troy"];

/** Ödeme yöntemi rozetleri — footer'da copyright'ın hemen üstünde. */
export function PaymentBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {METHODS.map((method) => (
        <span
          key={method}
          className="inline-flex h-7 items-center rounded-xs border border-[var(--border-light)] px-2.5 text-[11px] font-medium text-mist-200"
        >
          {method}
        </span>
      ))}
      <span className="inline-flex h-7 items-center gap-1 rounded-xs border border-[var(--border-light)] px-2.5 text-[11px] text-mist-200">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="3" y="11" width="18" height="10" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        iyzico ile güvenli ödeme
      </span>
    </div>
  );
}
