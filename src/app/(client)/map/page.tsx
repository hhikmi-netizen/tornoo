"use client";

import { useState, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CaretLeft, MagnifyingGlass, NavigationArrow } from "@phosphor-icons/react";
import { api } from "@/services/api";
import { useToast } from "@/components/ui/Toast";
import { useI18n } from "@/i18n/context";
import type { Establishment } from "@/types";
import { LeafletMap } from "@/components/map/LeafletMapDynamic";

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

export default function MapPage() {
  const router = useRouter();
  const { t } = useI18n();
  const { toast } = useToast();
  const [selected, setSelected] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(true);
  const [locating, setLocating] = useState(false);

  const locateMe = () => {
    if (!("geolocation" in navigator)) {
      toast("Géolocalisation non disponible", "error");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      () => { setLocating(false); toast("Position trouvée", "success"); },
      () => { setLocating(false); toast("Impossible d'obtenir votre position", "error"); },
      { timeout: 8000 }
    );
  };

  const { data: establishments = [] } = useQuery({
    queryKey: ["establishments"],
    queryFn: () => api.establishments.list(),
  });

  const selectedEstab = establishments.find((e) => e.id === selected);

  return (
    <div className="fixed inset-0 bg-white overflow-hidden">
      {/* CARTE — remplace MapBackdrop + pins */}
      <div className="absolute inset-0">
        <Suspense fallback={<div className="w-full h-full bg-[#e8f0e9] animate-pulse" />}>
          <LeafletMap
            establishments={establishments}
            selected={selected}
            onSelect={(id) => { setSelected(id); if (id) setSheetOpen(true); }}
          />
        </Suspense>
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
          onClick={locateMe}
          disabled={locating}
          className="w-11 h-11 rounded-2xl bg-white/95 backdrop-blur-sm shadow-1 flex items-center justify-center border border-line shrink-0 disabled:opacity-60"
          aria-label="Ma position"
        >
          {locating
            ? <span className="w-4 h-4 rounded-full border-2 border-tornoo-green border-t-transparent animate-spin" />
            : <NavigationArrow weight="fill" size={18} className="text-tornoo-green" />}
        </button>
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
