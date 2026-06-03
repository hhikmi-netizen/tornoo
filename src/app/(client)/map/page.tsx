"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CaretLeft, MagnifyingGlass, NavigationArrow } from "@phosphor-icons/react";
import { api } from "@/services/api";
import { useI18n } from "@/i18n/context";
import type { Establishment, WaitLevel } from "@/types";

/* ── Map pin ── */
function MapPin({ level, selected = false }: { level: WaitLevel; selected?: boolean }) {
  const colors = { low: "#07984a", mod: "#ff9300", high: "#ef2b24" };
  const c = colors[level];
  return (
    <svg width={selected ? 52 : 40} height={selected ? 58 : 46} viewBox="0 0 74 82" className="drop-shadow-md transition-all">
      <filter id={`pin-shadow-${level}`} x="-30%" y="-20%" width="160%" height="160%">
        <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor={c} floodOpacity="0.35"/>
      </filter>
      <path
        d="M37 4a25 25 0 00-25 25c0 17 25 40 25 40s25-23 25-40A25 25 0 0037 4z"
        fill={c}
        filter={selected ? `url(#pin-shadow-${level})` : undefined}
      />
      <circle cx="37" cy="28" r="14" fill="#fff" fillOpacity="0.95"/>
      {level === "low" ? (
        <path d="M30 28l5 5 9-10" stroke={c} strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      ) : level === "mod" ? (
        <text x="37" y="33" textAnchor="middle" fontSize="12" fontWeight="900" fill={c}>~</text>
      ) : (
        <text x="37" y="33" textAnchor="middle" fontSize="13" fontWeight="900" fill={c}>!</text>
      )}
    </svg>
  );
}

/* ── Map backdrop ── */
function MapBackdrop() {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 390 600">
      <rect width="390" height="600" fill="#e8f0e9"/>
      {/* parks */}
      <rect x="-10" y="80"  width="160" height="130" rx="28" fill="#d8eadb"/>
      <rect x="260" y="320" width="180" height="160" rx="30" fill="#d8eadb"/>
      <rect x="120" y="440" width="130" height="100" rx="24" fill="#d8eadb"/>
      {/* water */}
      <path d="M0 520 Q100 500 200 526 T390 518 V600 H0Z" fill="#c5dce8" opacity="0.85"/>
      {/* blocks */}
      <rect x="40"  y="130" width="50" height="40"  rx="6" fill="#dfe8e0" opacity="0.6"/>
      <rect x="100" y="120" width="70" height="50"  rx="6" fill="#dfe8e0" opacity="0.5"/>
      <rect x="240" y="160" width="60" height="45"  rx="6" fill="#dfe8e0" opacity="0.6"/>
      <rect x="310" y="200" width="55" height="60"  rx="6" fill="#dfe8e0" opacity="0.5"/>
      <rect x="60"  y="310" width="80" height="55"  rx="6" fill="#dfe8e0" opacity="0.55"/>
      {/* major roads */}
      <g stroke="#fff" strokeWidth="14" fill="none" strokeLinecap="round">
        <path d="M-10 260 H410"/>
        <path d="M195 -10 V620"/>
      </g>
      <g stroke="#fff" strokeWidth="10" fill="none" strokeLinecap="round">
        <path d="M50 -10 L130 300 L90 620"/>
        <path d="M390 160 L195 260 L300 620"/>
      </g>
      {/* minor roads */}
      <g stroke="#edf2ee" strokeWidth="5" fill="none" strokeLinecap="round">
        <path d="M-10 140 H410"/>
        <path d="M290 -10 V400"/>
        <path d="M-10 380 Q120 360 200 386 T410 378"/>
        <path d="M-10 460 H410"/>
      </g>
    </svg>
  );
}

/* ── Sheet row ── */
function SheetRow({ e, onTap }: { e: Establishment; onTap: () => void }) {
  const bgColor   = e.waitLevel === "low" ? "#e4f6ec" : e.waitLevel === "mod" ? "#fff1de" : "#fde7e6";
  const textColor = e.waitLevel === "low" ? "#07984a" : e.waitLevel === "mod" ? "#ff9300" : "#ef2b24";

  return (
    <button onClick={onTap} className="w-full flex items-center gap-3 text-left active:opacity-70 transition-opacity">
      <div className="w-11 h-11 rounded-2xl shrink-0 flex items-center justify-center" style={{ background: bgColor }}>
        <span className="text-base font-black" style={{ color: textColor }}>{e.name.charAt(0)}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-ink truncate">{e.name}</p>
        <p className="text-xs text-ink-3">{e.category}{e.distance != null ? ` · ${e.distance} km` : ""}</p>
      </div>
      <span
        className="inline-flex items-center gap-1 h-7 px-2.5 rounded-full text-xs font-black shrink-0"
        style={{ background: bgColor, color: textColor }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: textColor }} />
        {e.waitMinutes < 60 ? `${e.waitMinutes} min` : `${Math.floor(e.waitMinutes / 60)}h`}
      </span>
    </button>
  );
}

const PIN_POSITIONS: Record<string, { x: number; y: number }> = {
  "1": { x: 125, y: 160 },
  "2": { x: 230, y: 100 },
  "3": { x: 60,  y: 280 },
  "4": { x: 270, y: 210 },
  "5": { x: 155, y: 330 },
};

export default function MapPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [selected, setSelected] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(true);

  const { data: establishments = [] } = useQuery({
    queryKey: ["establishments"],
    queryFn: () => api.establishments.list(),
  });

  const selectedEstab = establishments.find((e) => e.id === selected);

  return (
    <div className="fixed inset-0 bg-white overflow-hidden">
      {/* Map */}
      <div className="absolute inset-0" onClick={() => setSelected(null)}>
        <MapBackdrop />
      </div>

      {/* Top controls */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-safe-top pb-3 z-20 gap-3">
        <button
          onClick={() => router.back()}
          className="w-11 h-11 rounded-2xl bg-white/95 backdrop-blur-sm shadow-1 flex items-center justify-center border border-line shrink-0"
          aria-label="Retour"
        >
          <CaretLeft weight="bold" size={20} className="text-ink" />
        </button>
        <Link
          href="/search"
          className="flex items-center gap-2 flex-1 h-11 px-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-1 border border-line"
        >
          <MagnifyingGlass weight="bold" size={16} className="text-ink-3" />
          <span className="text-sm font-medium text-ink-3">{t.searchPlaceholder.split(",")[0]}…</span>
        </Link>
        <button
          className="w-11 h-11 rounded-2xl bg-white/95 backdrop-blur-sm shadow-1 flex items-center justify-center border border-line shrink-0"
          aria-label="Ma position"
        >
          <NavigationArrow weight="fill" size={18} className="text-tornoo-green" />
        </button>
      </div>

      {/* Pins */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {establishments.map((e) => {
          const pos = PIN_POSITIONS[e.id];
          if (!pos) return null;
          const isSelected = selected === e.id;
          return (
            <motion.div
              key={e.id}
              className="absolute pointer-events-auto"
              style={{ left: pos.x - (isSelected ? 26 : 20), top: pos.y - (isSelected ? 58 : 46) }}
              animate={{ y: isSelected ? -8 : 0, scale: isSelected ? 1.08 : 1 }}
              transition={{ type: "spring", stiffness: 460, damping: 22 }}
              onClick={(ev) => { ev.stopPropagation(); setSelected(isSelected ? null : e.id); setSheetOpen(true); }}
            >
              <MapPin level={e.waitLevel} selected={isSelected} />
              {/* Wait label on selection */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7, y: 4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.18 }}
                    className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap"
                  >
                    <span
                      className="inline-flex items-center gap-1 h-6 px-2.5 rounded-full text-xs font-black shadow-1"
                      style={{
                        background: e.waitLevel === "low" ? "#e4f6ec" : e.waitLevel === "mod" ? "#fff1de" : "#fde7e6",
                        color: e.waitLevel === "low" ? "#07984a" : e.waitLevel === "mod" ? "#ff9300" : "#ef2b24",
                      }}
                    >
                      {e.waitMinutes} min
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom sheet */}
      <AnimatePresence>
        {sheetOpen && (
          <motion.div
            className="absolute left-0 right-0 bottom-0 z-[60] bg-white rounded-t-[28px]"
            style={{ boxShadow: "0 -8px 40px -8px rgba(20,24,33,.18)" }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 360, damping: 30 }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-9 h-1 rounded-full bg-line" />
            </div>

            <div className="px-4 pb-8 safe-bottom">
              <AnimatePresence mode="wait">
                {selectedEstab ? (
                  <motion.div
                    key="detail"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h2 className="text-xl font-black text-ink">{selectedEstab.name}</h2>
                        <p className="text-sm text-ink-3 mt-0.5">{selectedEstab.category} · {selectedEstab.city}</p>
                      </div>
                      <span
                        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-sm font-black shrink-0 mt-0.5"
                        style={{
                          background: selectedEstab.waitLevel === "low" ? "#e4f6ec" : selectedEstab.waitLevel === "mod" ? "#fff1de" : "#fde7e6",
                          color: selectedEstab.waitLevel === "low" ? "#07984a" : selectedEstab.waitLevel === "mod" ? "#ff9300" : "#ef2b24",
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: selectedEstab.waitLevel === "low" ? "#07984a" : selectedEstab.waitLevel === "mod" ? "#ff9300" : "#ef2b24" }} />
                        {selectedEstab.waitMinutes} min
                      </span>
                    </div>
                    <Link
                      href={`/establishment/${selectedEstab.slug}`}
                      className="flex items-center justify-center h-14 rounded-[15px] font-extrabold text-white w-full active:scale-[0.98] transition-transform"
                      style={{
                        background: selectedEstab.waitLevel === "low"
                          ? "linear-gradient(135deg,#07984a,#13b45b)"
                          : selectedEstab.waitLevel === "mod"
                          ? "linear-gradient(135deg,#ff9300,#ffb000)"
                          : "linear-gradient(135deg,#ef2b24,#ff4d45)",
                        boxShadow: selectedEstab.waitLevel === "low"
                          ? "0 4px 16px rgba(7,152,74,.3)"
                          : "0 4px 16px rgba(255,147,0,.3)",
                      }}
                    >
                      {t.seeDetails}
                    </Link>
                    <button
                      onClick={() => setSelected(null)}
                      className="mt-2 w-full h-10 text-sm font-bold text-ink-3 active:text-ink transition-colors"
                    >
                      {t.seeAll}
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="mb-4">
                      <p className="section-eyebrow mb-0.5">{t.aroundMe}</p>
                      <h2 className="text-xl font-black text-ink leading-none">{t.nearYou}</h2>
                    </div>
                    <div className="space-y-3.5 max-h-52 overflow-y-auto scrollbar-none">
                      {establishments.map((e) => (
                        <SheetRow key={e.id} e={e} onTap={() => setSelected(e.id)} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
