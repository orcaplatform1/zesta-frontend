/** Ödeme yöntemi rozetleri — footer'da copyright'ın hemen üstünde. */
export function PaymentBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <span className="inline-flex h-8 items-center rounded-xs bg-white px-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/visa-logo.png" alt="Visa" className="h-3.5 w-auto" />
      </span>
      <span className="inline-flex h-8 items-center rounded-xs bg-white px-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/mastercard-logo.png" alt="Mastercard" className="h-5 w-auto" />
      </span>
      <span className="inline-flex h-8 items-center rounded-xs bg-white px-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/troy-logo.png" alt="Troy" className="h-3.5 w-auto" />
      </span>
    </div>
  );
}
