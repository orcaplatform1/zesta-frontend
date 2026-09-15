"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  DEFAULT_FOOTER_CONTACT,
  DEFAULT_CORPORATE_PAGE,
  DEFAULT_STORES_PAGE,
  type FooterContactContent,
  type CorporatePageContent,
  type StoresPageContent,
  type Store,
} from "@/lib/site-pages-content";
import { Field, ListSection, ImageUploadField, manageInputClass as inputClass, manageTextareaClass as textareaClass } from "@/components/admin/ManageFormControls";

export default function ManagePagesContent() {
  const [footerContact, setFooterContact] = useState<FooterContactContent>(DEFAULT_FOOTER_CONTACT);
  const [corporate, setCorporate] = useState<CorporatePageContent>(DEFAULT_CORPORATE_PAGE);
  const [stores, setStores] = useState<StoresPageContent>(DEFAULT_STORES_PAGE);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<Record<string, unknown>>("/settings")
      .then((settings) => {
        setFooterContact((settings.footer_contact_content as FooterContactContent | undefined) ?? DEFAULT_FOOTER_CONTACT);
        setCorporate((settings.corporate_page_content as CorporatePageContent | undefined) ?? DEFAULT_CORPORATE_PAGE);
        setStores((settings.stores_page_content as StoresPageContent | undefined) ?? DEFAULT_STORES_PAGE);
      })
      .catch(() => {});
  }, []);

  async function save() {
    setBusy(true);
    setMessage(null);
    try {
      await Promise.all([
        api.put("/settings/admin/footer_contact_content", { value: footerContact }),
        api.put("/settings/admin/corporate_page_content", { value: corporate }),
        api.put("/settings/admin/stores_page_content", { value: stores }),
      ]);
      setMessage("Kaydedildi. Sitede birkaç dakika içinde görünür.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Kaydedilemedi");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-14 pb-24">
      <div>
        <h1 className="label-uppercase text-champagne-300 mb-2">Sayfalar</h1>
        <h2 className="font-display text-[28px] font-normal text-ink mb-3">Kurumsal İçerik</h2>
        <p className="text-sm text-ash leading-relaxed">
          Footer&apos;daki iletişim bilgileri ile Kurumsal Çözümler ve Mağazalarımız sayfalarının içeriği buradan
          düzenlenir.
        </p>
      </div>

      <section className="space-y-3">
        <h3 className="label-uppercase mb-1">Footer İletişim Bilgileri</h3>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Telefon">
            <input
              className={inputClass}
              value={footerContact.phone}
              onChange={(e) => setFooterContact({ ...footerContact, phone: e.target.value })}
            />
          </Field>
          <Field label="E-posta">
            <input
              className={inputClass}
              value={footerContact.email}
              onChange={(e) => setFooterContact({ ...footerContact, email: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Adres / Çalışma Saatleri Notu">
          <textarea
            className={textareaClass}
            rows={2}
            value={footerContact.addressNote}
            onChange={(e) => setFooterContact({ ...footerContact, addressNote: e.target.value })}
          />
        </Field>
      </section>

      <section className="space-y-3">
        <h3 className="label-uppercase mb-1">Kurumsal Çözümler Sayfası</h3>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Eyebrow">
            <input
              className={inputClass}
              value={corporate.eyebrow}
              onChange={(e) => setCorporate({ ...corporate, eyebrow: e.target.value })}
            />
          </Field>
          <Field label="Buton Metni">
            <input
              className={inputClass}
              value={corporate.ctaLabel}
              onChange={(e) => setCorporate({ ...corporate, ctaLabel: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Başlık">
          <input
            className={inputClass}
            value={corporate.heading}
            onChange={(e) => setCorporate({ ...corporate, heading: e.target.value })}
          />
        </Field>
        <Field label="Giriş Metni">
          <textarea
            className={textareaClass}
            rows={3}
            value={corporate.intro}
            onChange={(e) => setCorporate({ ...corporate, intro: e.target.value })}
          />
        </Field>
        <ImageUploadField
          label="Kapak Görseli"
          value={corporate.heroImage}
          onChange={(url) => setCorporate({ ...corporate, heroImage: url })}
        />

        <ListSection
          title="Çözüm Kartları"
          description="Sayfadaki 4'lü kart grid'i."
          items={corporate.cards}
          onChange={(cards) => setCorporate({ ...corporate, cards })}
          empty={{ title: "", body: "" }}
          renderItem={(card, onChange) => (
            <>
              <Field label="Başlık">
                <input className={inputClass} value={card.title} onChange={(e) => onChange({ ...card, title: e.target.value })} />
              </Field>
              <Field label="Metin">
                <textarea
                  className={textareaClass}
                  rows={2}
                  value={card.body}
                  onChange={(e) => onChange({ ...card, body: e.target.value })}
                />
              </Field>
            </>
          )}
        />
      </section>

      <section className="space-y-3">
        <h3 className="label-uppercase mb-1">Mağazalarımız Sayfası</h3>
        <Field label="Giriş Metni">
          <textarea
            className={textareaClass}
            rows={2}
            value={stores.intro}
            onChange={(e) => setStores({ ...stores, intro: e.target.value })}
          />
        </Field>

        <ListSection
          title="Mağazalar"
          description="Her mağaza için ad, adres, telefon, çalışma saati ve görsel."
          items={stores.stores}
          onChange={(items) => setStores({ ...stores, stores: items })}
          empty={{ id: `magaza-${Date.now()}`, name: "", address: "", phone: "", hours: "", image: "" } satisfies Store}
          renderItem={(store, onChange) => (
            <>
              <Field label="Mağaza Adı">
                <input className={inputClass} value={store.name} onChange={(e) => onChange({ ...store, name: e.target.value })} />
              </Field>
              <Field label="Adres">
                <textarea
                  className={textareaClass}
                  rows={2}
                  value={store.address}
                  onChange={(e) => onChange({ ...store, address: e.target.value })}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Telefon">
                  <input className={inputClass} value={store.phone} onChange={(e) => onChange({ ...store, phone: e.target.value })} />
                </Field>
                <Field label="Çalışma Saatleri">
                  <input className={inputClass} value={store.hours} onChange={(e) => onChange({ ...store, hours: e.target.value })} />
                </Field>
              </div>
              <ImageUploadField label="Mağaza Görseli" value={store.image} onChange={(url) => onChange({ ...store, image: url })} />
            </>
          )}
        />
      </section>

      <div className="sticky bottom-0 -mx-5 md:-mx-12 bg-onyx-800/95 backdrop-blur-sm border-t border-[var(--border-subtle)] px-5 md:px-12 py-4 flex items-center gap-4">
        <button
          onClick={save}
          disabled={busy}
          className="h-11 rounded-full bg-charcoal-700 px-6 text-[12px] font-medium text-ivory-50 transition-colors duration-[180ms] hover:bg-mist-800 disabled:opacity-40"
          style={{ letterSpacing: "0.1em" }}
        >
          {busy ? "KAYDEDİLİYOR..." : "KAYDET"}
        </button>
        {message && <p className="text-sm text-champagne-300">{message}</p>}
      </div>
    </div>
  );
}
