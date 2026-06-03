"use client";

import type { OpeningHour, OpeningHourDay } from "@/types/professional";

const DAYS: { key: OpeningHourDay; label: string }[] = [
  { key: "Lun", label: "Lundi" },
  { key: "Mar", label: "Mardi" },
  { key: "Mer", label: "Mercredi" },
  { key: "Jeu", label: "Jeudi" },
  { key: "Ven", label: "Vendredi" },
  { key: "Sam", label: "Samedi" },
  { key: "Dim", label: "Dimanche" },
];

function buildTimeOptions() {
  const opts: string[] = [];
  for (let h = 6; h <= 23; h++) {
    opts.push(`${String(h).padStart(2, "0")}:00`);
    if (h < 23) opts.push(`${String(h).padStart(2, "0")}:30`);
  }
  return opts;
}

const TIME_OPTIONS = buildTimeOptions();

interface OpeningHoursEditorProps {
  value: OpeningHour[];
  onChange: (v: OpeningHour[]) => void;
}

export function OpeningHoursEditor({ value, onChange }: OpeningHoursEditorProps) {
  const getHour = (day: OpeningHourDay): OpeningHour =>
    value.find((h) => h.day === day) ?? { day, enabled: false, open: "09:00", close: "21:00" };

  const update = (day: OpeningHourDay, patch: Partial<OpeningHour>) => {
    const existing = getHour(day);
    const updated = { ...existing, ...patch };
    const filtered = value.filter((h) => h.day !== day);
    onChange([...filtered, updated].sort((a, b) => {
      const ai = DAYS.findIndex((d) => d.key === a.day);
      const bi = DAYS.findIndex((d) => d.key === b.day);
      return ai - bi;
    }));
  };

  return (
    <div className="space-y-2">
      {DAYS.map(({ key, label }) => {
        const hour = getHour(key);
        return (
          <div key={key} className="bg-white rounded-[14px] border border-line px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                role="switch"
                aria-checked={hour.enabled}
                onClick={() => update(key, { enabled: !hour.enabled })}
                className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ${
                  hour.enabled ? "bg-tornoo-green" : "bg-line"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    hour.enabled ? "translate-x-4" : ""
                  }`}
                />
              </button>
              <span className="text-sm font-semibold text-ink flex-1">{label}</span>
            </div>

            {hour.enabled && (
              <div className="flex items-center gap-2 mt-3">
                <select
                  value={hour.open}
                  onChange={(e) => update(key, { open: e.target.value })}
                  className="flex-1 h-10 rounded-[10px] border border-line bg-surface-2 px-2 text-sm font-semibold text-ink"
                >
                  {TIME_OPTIONS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <span className="text-ink-3 text-sm">-</span>
                <select
                  value={hour.close}
                  onChange={(e) => update(key, { close: e.target.value })}
                  className="flex-1 h-10 rounded-[10px] border border-line bg-surface-2 px-2 text-sm font-semibold text-ink"
                >
                  {TIME_OPTIONS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
