"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";

// Favori ürün id'leri sayfa genelinde tek kaynaktan (/favorites/ids) okunur;
// tüm kalpler aynı durumu paylaşır.
type State = { loaded: boolean; loggedIn: boolean; ids: Set<string> };

let state: State = { loaded: false, loggedIn: false, ids: new Set() };
let loading: Promise<void> | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function load() {
  if (!loading) {
    loading = api
      .get<string[]>("/favorites/ids")
      .then((ids) => {
        state = { loaded: true, loggedIn: true, ids: new Set(ids) };
      })
      .catch(() => {
        state = { loaded: true, loggedIn: false, ids: new Set() };
      })
      .finally(emit);
  }
  return loading;
}

function goLogin() {
  const back = window.location.pathname + window.location.search;
  window.location.assign(`/hesap?donus=${encodeURIComponent(back)}`);
}

export async function toggleFavorite(productId: string) {
  await load();
  if (!state.loggedIn) {
    goLogin();
    return;
  }
  const wasFav = state.ids.has(productId);
  const next = new Set(state.ids);
  if (wasFav) next.delete(productId);
  else next.add(productId);
  state = { ...state, ids: next };
  emit();
  try {
    if (wasFav) await api.delete(`/favorites/${productId}`);
    else await api.post(`/favorites/${productId}`);
  } catch (err) {
    const revert = new Set(state.ids);
    if (wasFav) revert.add(productId);
    else revert.delete(productId);
    state = { ...state, ids: revert };
    emit();
    if (err instanceof ApiError && err.status === 401) goLogin();
  }
}

// Tüm favori durumunu izler (Favorilerim listesi için).
export function useFavoriteIds(): { loaded: boolean; ids: Set<string> } {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    load();
    return () => {
      listeners.delete(l);
    };
  }, []);
  return { loaded: state.loaded && state.loggedIn, ids: state.ids };
}

export function useIsFavorite(productId: string): boolean {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    load();
    return () => {
      listeners.delete(l);
    };
  }, []);
  return state.ids.has(productId);
}
