"use client";

import { useEffect, useState } from "react";
import { api, formatPrice } from "@/lib/api";
import type { Category, Product } from "@/lib/types";

const emptyForm = {
  id: "",
  name: "",
  slug: "",
  description: "",
  price: "",
  salePrice: "",
  sku: "",
  stock: "0",
  categoryId: "",
  productionTime: "",
  isActive: true,
  imageUrl: "",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  function loadProducts() {
    api.get<Product[]>("/products/admin/list").then(setProducts).catch(() => setProducts([]));
  }

  useEffect(() => {
    loadProducts();
    api.get<Category[]>("/categories").then(setCategories).catch(() => setCategories([]));
  }, []);

  function edit(p: Product) {
    setForm({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description ?? "",
      price: p.price,
      salePrice: p.salePrice ?? "",
      sku: p.sku,
      stock: String(p.stock),
      categoryId: p.category?.id ?? "",
      productionTime: p.productionTime ?? "",
      isActive: p.isActive,
      imageUrl: p.images[0]?.url ?? "",
    });
  }

  async function uploadImage(file: File) {
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/media/admin/upload", { method: "POST", body, credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Yükleme başarısız");
      setForm((f) => ({ ...f, imageUrl: data.url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yükleme başarısız");
    } finally {
      setUploading(false);
    }
  }

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const payload = {
        name: form.name,
        slug: form.slug,
        description: form.description || undefined,
        price: Number(form.price),
        salePrice: form.salePrice ? Number(form.salePrice) : undefined,
        sku: form.sku,
        stock: Number(form.stock),
        categoryId: form.categoryId || undefined,
        productionTime: form.productionTime || undefined,
        isActive: form.isActive,
        images: form.imageUrl ? [{ url: form.imageUrl }] : undefined,
      };
      if (form.id) {
        await api.patch(`/products/admin/${form.id}`, payload);
      } else {
        await api.post("/products/admin", payload);
      }
      setForm(emptyForm);
      loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kaydedilemedi");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Ürünü silmek istediğinize emin misiniz?")) return;
    await api.delete(`/products/admin/${id}`);
    loadProducts();
  }

  return (
    <div className="grid md:grid-cols-2 gap-12">
      <div>
        <h1 className="label-uppercase mb-6">{form.id ? "Ürünü Düzenle" : "Yeni Ürün"}</h1>
        <div className="space-y-3">
          <Input label="Ad" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
          <Input label="Slug" value={form.slug} onChange={(v) => setForm((f) => ({ ...f, slug: v }))} />
          <Input
            label="Açıklama"
            value={form.description}
            onChange={(v) => setForm((f) => ({ ...f, description: v }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Fiyat" value={form.price} onChange={(v) => setForm((f) => ({ ...f, price: v }))} />
            <Input
              label="İndirimli Fiyat"
              value={form.salePrice}
              onChange={(v) => setForm((f) => ({ ...f, salePrice: v }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="SKU" value={form.sku} onChange={(v) => setForm((f) => ({ ...f, sku: v }))} />
            <Input label="Stok" value={form.stock} onChange={(v) => setForm((f) => ({ ...f, stock: v }))} />
          </div>
          <label className="block">
            <span className="label-uppercase block mb-1.5">Kategori</span>
            <select
              value={form.categoryId}
              onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
              className="w-full h-12 rounded-xs border border-[var(--border-subtle)] bg-onyx-700 px-3.5 text-sm text-ink focus:outline-none focus:border-[var(--border-accent)]"
            >
              <option value="">Yok</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <Input
            label="Üretim Süresi"
            value={form.productionTime}
            onChange={(v) => setForm((f) => ({ ...f, productionTime: v }))}
          />
          <label className="block">
            <span className="label-uppercase block mb-1.5">Görsel</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])}
              className="text-sm text-smoke file:mr-3 file:rounded-xs file:border file:border-[var(--border-subtle)] file:bg-onyx-700 file:px-3 file:py-1.5 file:text-ink file:text-xs"
            />
            {uploading && <span className="ml-2 text-xs text-ash">Yükleniyor...</span>}
            {form.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.imageUrl} alt="" className="mt-3 h-20 w-20 object-cover rounded-xs" />
            )}
          </label>
          <label className="flex items-center gap-2 text-sm text-smoke">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
            />
            Aktif
          </label>

          {error && <p className="text-sm text-[var(--status-error)]">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              onClick={submit}
              disabled={busy}
              className="h-11 rounded-xs bg-ivory px-6 text-[12px] font-medium text-onyx-800 transition-colors duration-[180ms] hover:bg-smoke disabled:opacity-40"
              style={{ letterSpacing: "0.1em" }}
            >
              {form.id ? "GÜNCELLE" : "EKLE"}
            </button>
            {form.id && (
              <button onClick={() => setForm(emptyForm)} className="text-sm text-dim hover:text-ink transition-colors duration-[180ms]">
                İptal
              </button>
            )}
          </div>
        </div>
      </div>

      <div>
        <h1 className="label-uppercase mb-6">Ürünler</h1>
        {!products ? (
          <p className="text-sm text-ash">Yükleniyor...</p>
        ) : (
          <div className="divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
            {products.map((p) => (
              <div key={p.id} className="py-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-ink">
                    {p.name} {!p.isActive && <span className="text-dim">(pasif)</span>}
                  </div>
                  <div className="mt-1 text-xs text-ash">
                    {formatPrice(p.salePrice ?? p.price)} · stok: {p.stock}
                  </div>
                </div>
                <div className="flex gap-4 text-sm">
                  <button onClick={() => edit(p)} className="text-champagne-300 hover:text-champagne-200 transition-colors duration-[180ms]">
                    Düzenle
                  </button>
                  <button onClick={() => remove(p.id)} className="text-dim hover:text-[var(--status-error)] transition-colors duration-[180ms]">
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="label-uppercase block mb-1.5">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-12 rounded-xs border border-[var(--border-subtle)] bg-onyx-700 px-3.5 text-sm text-ink placeholder:text-dim focus:outline-none focus:border-[var(--border-accent)]"
      />
    </label>
  );
}
