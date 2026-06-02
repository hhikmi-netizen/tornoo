"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Search, Navigation } from "lucide-react";
import { WaitBadge } from "@/components/tornoo/WaitBadge";
import { api } from "@/services/api";
import type { Establishment, WaitLevel } from "@/types";

/* ── Map pins ── */

function MapPin({ level, selected = false }: { level: WaitLevel; selected?: boolean }) {
  const colors = { low: "#07984a", mod: "#ff9300", high: "#ef2b24" };
  const c = colors[level];
  return (
    <svg width={selected ? 56 : 44} height={selected ? 60 : 48} viewBox="0 0 74 78" className="drop-shadow-md transition-all">
      <path d="M37 4a25 25 0 00-25 25c0 17 25 40 25 40s25-23 25-40A25 25 0 0037 4z" fill={c}/>
      <circle cx="37" cy="28" r="15" fill="#fff"/>
      {level === "low" ? (
        <path d="M30 28l5 5 9-10" stroke={c} strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      ) : (
        <circle cx="37" cy="28" r="5" fill={c}/>
      )}
    </svg>
  );
}

/* ── Stylised map backdrop ── */

function MapBackdrop() {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 390 600">
      <rect width="390" height="600" fill="#e8efe9"/>
      {/* parks */}
      <rect x="-10" y="80" width="160" height="130" rx="28" fill="#dcebdd"/>
      <rect x="260" y="320" width="180" height="160" rx="30" fill="#dcebdd"/>
      <rect x="120" y="440" width="130" height="100" rx="24" fill="#dcebdd"/>
      {/* water */}
      <path d="M0 520 Q100 500 200 526 T390 518 V600 H0Z" fill="#cfe3ec"/>
      {/* major roads */}
      <g stroke="#fff" strokeWidth="12" fill="none" strokeLinecap="round">
        <path d="M-10 260 H410"/>
        <path d="M195 -10 V620"/>
        <path d="M50 -10 L130 300 L90 620"/>
        <path d="M390 160 L195 260 L300 620"/>
      </g>
      {/* minor roads */}
      <g stroke="#f0f4f1" strokeWidth="5" fill="none" strokeLinecap="round">
        <path d="M-10 140 H410"/>
        <path d="M290 -10 V400"/>
        <path d="M-10 380 Q120 360 200 386 T410 378"/>
      </g>
    </svg>
  );
}

/* ── Establishment row in bottom sheet ── */

function SheetRow({ e, onTap }: { e: Establishment; onTap: () => void }) {
  const bgColor = e.waitLevel === "low" ? "#e4f6ec" : e.waitLevel === "mod" ? "#fff1de" : "#fde7e6";
  const textColor = e.waitLevel === "low" ? "#07984a" : e.waitLevel === "mod" ? "#ff9300" : "#ef2b24";
  return (
    <button
      onClick={onTap}
      className="w-full flex items-center gap-3 text-left"
    >
      <div
        className="w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center"
        style={{ background: bgColor }}
      >
        <span className="text-lg font-black" style={{ color: textColor }}>
          {e.name.charAt(0)}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-ink truncate">{e.name}</p>
        <p className="text-xs text-ink-3">{e.category} · {e.city}{e.distance != null ? ` · ${e.distance} km` : ""}</p>
      </div>
      <WaitBadge minutes={e.waitMinutes} level={e.waitLevel} size="sm" />
    </button>
  );
}

/* ── Pinned positions (relative to a 390-wide viewport) ── */

const PIN_POSITIONS: Record<string, { x: number; y: number }> = {
  "1": { x: 125, y: 160 },
  "2": { x: 230, y: 100 },
  "3": { x: 60,  y: 280 },
  "4": { x: 270, y: 210 },
  "5": { x: 155, y: 330 },
};

export default function MapPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(true);

  const { data: establishments = [] } = useQuery({
    queryKey: ["establishments"],
    queryFn: () => api.establishments.list(),
  });

  const selectedEstab = establishments.find((e) => e.id === selected);

  return (
    <div className="fixed inset-0 bg-white overflow-hidden">
      {/* Map area */}
      <div className="absolute inset-0" onClick={() => setSelected(null)}>
        <MapBackdrop />
      </div>

      {/* Back button */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-safe-top pb-3 z-20">
        <button
          onClick={() => router.back()}
          className="w-12 h-12 rounded-2xl bg-white/95 backdrop-blur-sm shadow-1 flex items-center justify-center border border-line"
          aria-label="Retour"
        >
          <ChevronLeft size={22} className="text-ink" />
        </button>
        <Link
          href="/search"
          className="flex items-center gap-2 h-12 px-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-1 border border-line"
        >
          <Search size={17} className="text-ink-3" />
          <span className="text-sm font-medium text-ink-3 pr-2">Rechercher…</span>
        </Link>
        <button
          className="w-12 h-12 rounded-2xl bg-white/95 backdrop-blur-sm shadow-1 flex items-center justify-center border border-line"
          aria-label="Ma position"
        >
          <Navigation size={19} className="text-tornoo-green" />
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
              style={{ left: pos.x - (isSelected ? 28 : 22), top: pos.y - (isSelected ? 60 : 48) }}
              animate={{ y: isSelected ? -6 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              onClick={(ev) => { ev.stopPropagation(); setSelected(isSelected ? null : e.id); setSheetOpen(true); }}
            >
              <MapPin level={e.waitLevel} selected={isSelected} />
              {/* wait badge float */}
              <motion.div
                className="absolute -top-4 left-full ml-1 whitespace-nowrap"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: isSelected ? 1 : 0, scale: isSelected ? 1 : 0.8 }}
                transition={{ duration: 0.18 }}
              >
                <WaitBadge minutes={e.waitMinutes} level={e.waitLevel} size="sm" />
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom sheet */}
      <AnimatePresence>
        {sheetOpen && (
          <motion.div
            className="absolute left-0 right-0 bottom-0 z-[60] bg-white rounded-t-[28px] shadow-[0_-16px_40px_-18px_rgba(20,24,33,.28)]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1.5 rounded-full bg-line" />
            </div>

            <div className="px-4 pb-8">
              {selectedEstab ? (
                /* Selected establishment detail */
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-black text-ink">{selectedEstab.name}</h2>
                    <button onClick={() => setSelected(null)} className="text-xs font-bold text-ink-3">
                      Tout voir
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <WaitBadge minutes={selectedEstab.waitMinutes} level={selectedEstab.waitLevel} showLabel />
                    <span className="text-sm text-ink-3">{selectedEstab.category} · {selectedEstab.city}</span>
                  </div>
                  <Link
                    href={`/establishment/${selectedEstab.slug}`}
                    className="flex items-center justify-center h-14 rounded-[15px] font-extrabold text-white w-full"
                    style={{
                      background: selectedEstab.waitLevel === "low" ? "linear-gradient(135deg,#07984a,#13b45b)" :
                                  selectedEstab.waitLevel === "mod" ? "#ff9300" : "#ef2b24"
                    }}
                  >
                    Voir les détails
                  </Link>
                </motion.div>
              ) : (
                /* List of nearby */
                <>
                  <h2 className="text-xl font-black text-ink mb-4">Près de vous</h2>
                  <div className="space-y-4 max-h-64 overflow-y-auto scrollbar-none">
                    {establishments.map((e) => (
                      <SheetRow key={e.id} e={e} onTap={() => { setSelected(e.id); }} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
