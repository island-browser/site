"use client";

import { useSyncExternalStore } from "react";

import { THEME_STORAGE_KEY } from "@/lib/theme-script";

export type ThemePreference = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

const listeners = new Set<() => void>();
const media = () => window.matchMedia("(prefers-color-scheme: dark)");

function readPreference(): ThemePreference {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    return v === "light" || v === "dark" ? v : "system";
  } catch {
    return "system";
  }
}

function resolve(pref: ThemePreference): ResolvedTheme {
  if (pref !== "system") return pref;
  return media().matches ? "dark" : "light";
}

function apply(pref: ThemePreference) {
  const root = document.documentElement;
  const next = resolve(pref);
  if (root.classList.contains(next)) return;
  // Suppress transitions for one frame so every surface flips at once.
  root.classList.add("theme-switching");
  root.classList.remove("light", "dark");
  root.classList.add(next);
  requestAnimationFrame(() =>
    requestAnimationFrame(() => root.classList.remove("theme-switching")),
  );
}

export function setTheme(pref: ThemePreference) {
  try {
    if (pref === "system") localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, pref);
  } catch {
    // Storage can be blocked; the choice still applies for this page view.
  }
  apply(pref);
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const mq = media();
  const onSystem = () => {
    if (readPreference() === "system") apply("system");
    listener();
  };
  const onStorage = (e: StorageEvent) => {
    if (e.key !== THEME_STORAGE_KEY) return;
    apply(readPreference());
    listener();
  };
  mq.addEventListener("change", onSystem);
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    mq.removeEventListener("change", onSystem);
    window.removeEventListener("storage", onStorage);
  };
}

const snapshot = () => `${readPreference()}:${resolve(readPreference())}`;
const serverSnapshot = () => "system:light";

export function useTheme() {
  const [preference, resolved] = useSyncExternalStore(subscribe, snapshot, serverSnapshot).split(
    ":",
  ) as [ThemePreference, ResolvedTheme];
  return { preference, resolved, setTheme };
}
