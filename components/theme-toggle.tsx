"use client";

import { Monitor, Moon, Sun } from "lucide-react";

import { type ThemePreference, useTheme } from "@/lib/theme";

/** Header button: flips between light and dark. */
export function ThemeToggle() {
  const { resolved, setTheme } = useTheme();
  const next = resolved === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      className="icon-btn"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
    >
      <Sun className="size-4 hidden dark:block" aria-hidden />
      <Moon className="size-4 dark:hidden" aria-hidden />
    </button>
  );
}

const OPTIONS: { value: ThemePreference; label: string; Icon: typeof Sun }[] = [
  { value: "system", label: "System", Icon: Monitor },
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
];

/** Footer control: system / light / dark as a segmented radio group. */
export function ThemeSwitcher() {
  const { preference, setTheme } = useTheme();
  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="segmented"
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const active = preference === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            title={label}
            onClick={() => setTheme(value)}
            className="gap-1.5"
          >
            <Icon className="size-3.5" aria-hidden />
            <span className="max-sm:sr-only">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
