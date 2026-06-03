"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CaretLeft, FloppyDisk, Plus, Trash, Copy } from "@phosphor-icons/react";
import { useToast } from "@/components/ui/Toast";

type Slot = { open: string; close: string };
type DayConfig = { enabled: boolean; slots: Slot[] };

const DAY_LABELS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const DAY_SHORT  = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const DEFAULT_DAYS: DayConfig[] = DAY_LABELS.map((_, i) => ({
  enabled: i < 6,
  slots: [{ open: "09:00", close: "20:00" }],
}));

const TIMES: string[] = [];
for (let h = 0; h < 24; h++) {
  for (const m of ["00", "30"]) {
    TIMES.push(`${String(h).padStart(2, "0")}:${m}`);
  }
}

function TimeSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 px-2 rounded-[10px] border border-line bg-surface-2 text-sm font-bold text-ink outline-none focus:border-tornoo-green transition-all appearance-none text-center"
    >
      {TIMES.map((t) => (
        <option key={t} value={t}>{t}</option>
      ))}
    </select>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${value ? "bg-tornoo-green" : "bg-[#d0d5dd]"}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${value ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}

export default function ProSchedulePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [days, setDays] = useState<DayConfig[]>(DEFAULT_DAYS);
  const [saving, setSaving] = useState(false);

  const setDay = (i: number, patch: Partial<DayConfig>) =>
    setDays((prev) => prev.map((d, idx) => (idx === i ? { ...d, ...patch } : d)));

  const setSlot = (dayIdx: number, slotIdx: number, patch: Partial<Slot>) =>
    setDay(dayIdx, {
      slots: days[dayIdx].slots.map((s, si) => (si === slotIdx ? { ...s, ...patch } : s)),
    });

  const addSlot = (dayIdx: number) =>
    setDay(dayIdx, { slots: [...days[dayIdx].slots, { open: "14:00", close: "18:00" }] });

  const removeSlot = (dayIdx: number, slotIdx: number) =>
    setDay(dayIdx, { slots: days[dayIdx].slots.filter((_, si) => si !== slotIdx) });

  const copyToAll = (srcIdx: number) => {
    const src = days[srcIdx];
    setDays((prev) =>
      prev.map((d, i) =>
        i === srcIdx || !d.enabled ? d : { ...d, slots: src.slots.map((s) => ({ ...s })) }
      )
    );
    toast("Horaires copiés sur tous les jours ouverts", "success");
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    toast("Agenda mis à jour", "success");
  };

  const openDaysCount = days.filter((d) => d.enabled).length;

  return (
    <div className="bg-surface-2 min-h-svh pb-28">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-line px-4 pt-safe-top pb-3 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-surface-2 border border-line flex items-center justify-center"
        >
          <CaretLeft weight="bold" size={18} className="text-ink" />
        </button>
        <div className="flex-1">
          <h1 className="font-black text-lg text-ink">Agenda & Horaires</h1>
          <p className="text-xs text-ink-3">{openDaysCount} jour{openDaysCount !== 1 ? "s" : ""} ouvert{openDaysCount !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 h-9 px-4 rounded-[12px] bg-tornoo-green text-white font-bold text-sm disabled:opacity-60 active:scale-[0.97] transition-transform"
        >
          {saving
            ? <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            : <FloppyDisk size={15} weight="bold" />}
          {saving ? "…" : "Sauvegarder"}
        </button>
      </div>

      {/* Week summary pills */}
      <div className="px-4 pt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {DAY_SHORT.map((label, i) => (
          <button
            key={label}
            onClick={() => setDay(i, { enabled: !days[i].enabled })}
            className={`shrink-0 h-9 px-3 rounded-full text-xs font-black border transition-all ${
              days[i].enabled
                ? "bg-tornoo-green text-white border-tornoo-green"
                : "bg-white text-ink-3 border-line"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Days */}
      <div className="px-4 pt-3 space-y-3 max-w-lg mx-auto">
        {days.map((day, dayIdx) => (
          <motion.div
            key={DAY_LABELS[dayIdx]}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: dayIdx * 0.03 }}
            className="bg-white rounded-[20px] border border-line shadow-1 overflow-hidden"
          >
            {/* Day header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-line">
              <Toggle value={day.enabled} onChange={(v) => setDay(dayIdx, { enabled: v })} />
              <span className={`font-black text-sm flex-1 ${day.enabled ? "text-ink" : "text-ink-3"}`}>
                {DAY_LABELS[dayIdx]}
              </span>
              {!day.enabled && (
                <span className="text-xs font-bold text-ink-4 bg-surface-2 px-3 py-1 rounded-full">Fermé</span>
              )}
              {day.enabled && day.slots.length === 1 && (
                <button
                  onClick={() => copyToAll(dayIdx)}
                  className="flex items-center gap-1 text-[11px] font-bold text-ink-3 bg-surface-2 px-2.5 py-1 rounded-full border border-line active:scale-95 transition-transform"
                  title="Copier sur tous les jours ouverts"
                >
                  <Copy size={12} />
                  Copier
                </button>
              )}
            </div>

            {/* Slots */}
            <AnimatePresence>
              {day.enabled && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 py-3 space-y-2">
                    {day.slots.map((slot, slotIdx) => (
                      <div key={slotIdx} className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-ink-3 w-8">
                          {slotIdx === 0 ? "De" : "De"}
                        </span>
                        <TimeSelect value={slot.open} onChange={(v) => setSlot(dayIdx, slotIdx, { open: v })} />
                        <span className="text-[11px] font-bold text-ink-3">à</span>
                        <TimeSelect value={slot.close} onChange={(v) => setSlot(dayIdx, slotIdx, { close: v })} />

                        {day.slots.length > 1 && (
                          <button
                            onClick={() => removeSlot(dayIdx, slotIdx)}
                            className="w-8 h-8 rounded-full bg-[#fde7e6] flex items-center justify-center ml-1"
                          >
                            <Trash size={13} weight="bold" className="text-[#ef2b24]" />
                          </button>
                        )}
                      </div>
                    ))}

                    {day.slots.length < 3 && (
                      <button
                        onClick={() => addSlot(dayIdx)}
                        className="flex items-center gap-1.5 text-xs font-bold text-tornoo-green mt-1"
                      >
                        <Plus size={13} weight="bold" />
                        Ajouter une tranche horaire
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Info note */}
      <div className="mx-4 mt-4 max-w-lg mx-auto bg-[#f0faf4] rounded-[16px] p-4 border border-[#b8e8cc]">
        <p className="text-xs font-bold text-[#07984a]">Astuce</p>
        <p className="text-xs text-[#667085] mt-0.5 leading-relaxed">
          Activez ou désactivez un jour en tapant dessus dans la barre en haut. Vous pouvez aussi ajouter jusqu'à 3 tranches horaires par jour (ex: matin + après-midi).
        </p>
      </div>
    </div>
  );
}
