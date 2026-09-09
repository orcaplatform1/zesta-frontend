"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Product, ProductListResponse, Review } from "@/lib/types";

const emptyForm = {
  productId: "",
  authorName: "",
  rating: 5,
  comment: "",
  isApproved: true,
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 30;

  function load() {
    api.get<Review[]>("/reviews/admin").then(setReviews).catch(() => setReviews([]));
  }

  useEffect(() => {
    load();
    api
      .get<ProductListResponse>("/products/admin/list?pageSize=1000")
      .then((d) => setProducts(d.items))
      .catch(() => setProducts([]));
  }, []);

  function startEdit(r: Review) {
    setEditingId(r.id);
    setForm({
      productId: r.productId,
      authorName: r.authorName,
      rating: r.rating,
      comment: r.comment ?? "",
      isApproved: r.isApproved,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      if (editingId) {
        await api.patch(`/reviews/admin/${editingId}`, {
          authorName: form.authorName,
          rating: form.rating,
          comment: form.comment || undefined,
          isApproved: form.isApproved,
        });
      } else {
        await api.post("/reviews/admin", {
          productId: form.productId,
          authorName: form.authorName,
          rating: form.rating,
          comment: form.comment || undefined,
          isApproved: form.isApproved,
        });
      }
      cancelEdit();
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kaydedilemedi");
    } finally {
      setBusy(false);
    }
  }

  async function toggleApprove(r: Review) {
    await api.patch(`/reviews/admin/${r.id}/${r.isApproved ? "reject" : "approve"}`);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Yorumu silmek istediğinize emin misiniz?")) return;
    await api.delete(`/reviews/admin/${id}`);
    load();
  }

  const inputClass =
    "w-full h-11 rounded-xs border border-[var(--border-subtle)] bg-onyx-700 px-3.5 text-sm text-ink placeholder:text-dim focus:outline-none focus:border-[var(--border-accent)]";

  const pageCount = reviews ? Math.max(1, Math.ceil(reviews.length / PAGE_SIZE)) : 1;
  const pageItems = reviews ? reviews.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) : [];

  return (
    <div className="grid md:grid-cols-2 gap-12">
      <div>
        <h1 className="label-uppercase mb-6">{editingId ? "Yorumu Düzenle" : "Yorum Ekle"}</h1>
        <div className="space-y-3">
          {!editingId && (
            <label className="block">
              <span className="label-uppercase block mb-1.5">Ürün</span>
              <select
                value={form.productId}
                onChange={(e) => setForm((f) => ({ ...f, productId: e.target.value }))}
                className={inputClass}
              >
                <option value="">Seçin</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label className="block">
            <span className="label-uppercase block mb-1.5">Yazar Adı</span>
            <input
              value={form.authorName}
              onChange={(e) => setForm((f) => ({ ...f, authorName: e.target.value }))}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="label-uppercase block mb-1.5">Puan</span>
            <select
              value={form.rating}
              onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))}
              className={inputClass}
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} yıldız
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="label-uppercase block mb-1.5">Yorum</span>
            <textarea
              value={form.comment}
              onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
              rows={4}
              className="w-full rounded-xs border border-[var(--border-subtle)] bg-onyx-700 px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-[var(--border-accent)]"
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-smoke">
            <input
              type="checkbox"
              checked={form.isApproved}
              onChange={(e) => setForm((f) => ({ ...f, isApproved: e.target.checked }))}
            />
            Onaylı (yayında)
          </label>

          {error && <p className="text-sm text-[var(--status-error)]">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              onClick={submit}
              disabled={busy || (!editingId && !form.productId)}
              className="h-11 rounded-xs bg-charcoal-700 px-6 text-[12px] font-medium text-ivory-50 transition-colors duration-[180ms] hover:bg-mist-800 disabled:opacity-40"
              style={{ letterSpacing: "0.1em" }}
            >
              {editingId ? "GÜNCELLE" : "EKLE"}
            </button>
            {editingId && (
              <button onClick={cancelEdit} className="text-sm text-dim hover:text-ink transition-colors duration-[180ms]">
                İptal
              </button>
            )}
          </div>
        </div>
      </div>

      <div>
        <h1 className="label-uppercase mb-6">
          Yorumlar {reviews && <span className="text-dim">({reviews.length})</span>}
        </h1>
        {!reviews ? (
          <p className="text-sm text-ash">Yükleniyor...</p>
        ) : (
          <>
            <div className="divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
              {pageItems.map((r) => (
                <div key={r.id} className="py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium text-ink">
                        {r.authorName} · {r.rating}★{" "}
                        {!r.isApproved && <span className="text-dim">(onay bekliyor)</span>}
                      </div>
                      <div className="mt-1 text-xs text-ash">{r.product?.name ?? r.productId}</div>
                      {r.comment && <p className="mt-1.5 text-xs text-smoke line-clamp-2">{r.comment}</p>}
                    </div>
                    <div className="flex flex-col gap-2 text-sm shrink-0 items-end">
                      <button
                        onClick={() => toggleApprove(r)}
                        className="text-champagne-300 hover:text-champagne-200 transition-colors duration-[180ms]"
                      >
                        {r.isApproved ? "Onayı Kaldır" : "Onayla"}
                      </button>
                      <button onClick={() => startEdit(r)} className="text-smoke hover:text-ink transition-colors duration-[180ms]">
                        Düzenle
                      </button>
                      <button
                        onClick={() => remove(r.id)}
                        className="text-dim hover:text-[var(--status-error)] transition-colors duration-[180ms]"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {pageCount > 1 && (
              <div className="mt-5 flex items-center justify-between text-sm">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="text-smoke hover:text-ink transition-colors duration-[180ms] disabled:opacity-30 disabled:pointer-events-none"
                >
                  ← Önceki
                </button>
                <span className="text-ash">
                  Sayfa {page} / {pageCount}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  disabled={page >= pageCount}
                  className="text-smoke hover:text-ink transition-colors duration-[180ms] disabled:opacity-30 disabled:pointer-events-none"
                >
                  Sonraki →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
