"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function ContactMessagesPage() {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  useEffect(() => {
    adminApi.get<{ items: ContactMessage[] }>("/contact").then((r) => {
      setItems(r.items);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function markRead(msg: ContactMessage) {
    if (msg.isRead) return;
    await adminApi.patch(`/contact/${msg.id}/read`, {});
    setItems((prev) => prev.map((m) => m.id === msg.id ? { ...m, isRead: true } : m));
  }

  function open(msg: ContactMessage) {
    setSelected(msg);
    markRead(msg);
  }

  const unread = items.filter((m) => !m.isRead).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-[28px] font-normal text-ink">İletişim Mesajları</h1>
          {unread > 0 && (
            <p className="mt-1 text-sm text-ash">{unread} okunmamış mesaj</p>
          )}
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-ash">Yükleniyor...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-ash">Henüz mesaj yok.</p>
      ) : (
        <div className="grid md:grid-cols-[1fr_1.6fr] gap-6 items-start">
          {/* Liste */}
          <div className="flex flex-col gap-2">
            {items.map((msg) => (
              <button
                key={msg.id}
                onClick={() => open(msg)}
                className="w-full text-left rounded-sm border p-4 transition-colors duration-[160ms]"
                style={{
                  background: selected?.id === msg.id ? "var(--zesta-surface-muted)" : "var(--onyx-700)",
                  borderColor: msg.isRead ? "var(--border-subtle)" : "var(--zesta-accent)",
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-ink truncate">{msg.name}</p>
                    <p className="text-[12px] text-ash truncate">{msg.subject}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    {!msg.isRead && (
                      <span className="inline-block w-2 h-2 rounded-full" style={{ background: "var(--zesta-accent)" }} />
                    )}
                    <span className="text-[11px] text-dim">{new Date(msg.createdAt).toLocaleDateString("tr-TR")}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Detay */}
          {selected && (
            <div className="rounded-sm border border-[var(--border-subtle)] p-6" style={{ background: "var(--onyx-700)" }}>
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2 className="font-display text-[22px] font-normal text-ink">{selected.name}</h2>
                  <p className="text-sm text-ash mt-0.5">{selected.email}{selected.phone ? ` · ${selected.phone}` : ""}</p>
                </div>
                <span className="text-[11px] text-dim">{new Date(selected.createdAt).toLocaleString("tr-TR")}</span>
              </div>
              <div className="mb-4 inline-block rounded-full px-3 py-1 text-[11px] font-medium" style={{ background: "rgba(196,134,90,0.15)", color: "var(--zesta-accent)" }}>
                {selected.subject}
              </div>
              <p className="text-sm leading-relaxed text-smoke whitespace-pre-wrap">{selected.message}</p>
              <a
                href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                className="mt-6 inline-flex h-10 items-center gap-2 rounded-full px-5 text-[11px] font-semibold text-white transition-all duration-[180ms] hover:-translate-y-[1px]"
                style={{ background: "var(--zesta-primary)" }}
              >
                YANITLA →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
