"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { MagnifyingGlass, X, Faders } from "@phosphor-icons/react";
import { EstablishmentCard } from "@/components/tornoo/EstablishmentCard";
import { WaitDot } from "@/components/tornoo/WaitBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { api } from "@/services/api";
import { useI18n } from "@/i18n/context";
import { gsap } from "@/lib/gsap";

const CATEGORIES = [
  { code: "Tout",           label: { fr: "Tout",           ar: "الكل",              en: "All"      } },
  { code: "Coiffure",       label: { fr: "Coiffure",       ar: "تصفيف الشعر",       en: "Hair"     } },
  { code: "Santé",          label: { fr: "Santé",          ar: "صحة",               en: "Health"   } },
  { code: "Administration", label: { fr: "Admin",          ar: "إدارة",             en: "Admin"    } },
  { code: "Bien-être",      label: { fr: "Bien-être",      ar: "عافية",             en: "Wellness" } },
  { code: "Pharmacie",      label: { fr: "Pharmacie",      ar: "صيدلية",            en: "Pharmacy" } },
];

function FilterSheet({
  open, onClose,
  waitFilters, setWaitFilters,
  openNow, setOpenNow,
  minRating, setMinRating,
}: {
  open: boolean;
  onClose: () => void;
  waitFilters: string[];
  setWaitFilters: React.Dispatch<React.SetStateAction<string[]>>;
  openNow: boolean;
  setOpenNow: React.Dispatch<React.SetStateAction<boolean>>;
  minRating: number;
  setMinRating: React.Dispatch<React.SetStateAction<number>>;
}) {
  const toggleWait = (level: string) => {
    setWaitFilters(prev => prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
          />
          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 360, damping: 32 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[28px] px-5 pb-safe-bottom"
            style={{ boxShadow: "0 -8px 40px -8px rgba(20,24,33,.18)" }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-4">
              <div className="w-9 h-1 rounded-full bg-line" />
            </div>

            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-black text-ink">Filtres</h2>
              <button onClick={() => { setWaitFilters([]); setOpenNow(false); setMinRating(0); }}
                className="text-sm font-bold text-tornoo-green">Réinitialiser</button>
            </div>

            {/* Wait level */}
            <div className="mb-5">
              <p className="section-eyebrow mb-3">Temps d&apos;attente</p>
              <div className="flex gap-2">
                {[
                  { level: "low",  label: "Faible",   bg: "#e4f6ec", color: "#07984a" },
                  { level: "mod",  label: "Modéré",   bg: "#fff1de", color: "#ff9300" },
                  { level: "high", label: "Élevé",    bg: "#fde7e6", color: "#ef2b24" },
                ].map(({ level, label, bg, color }) => {
                  const isActive = waitFilters.includes(level);
                  return (
                    <button
                      key={level}
                      onClick={() => toggleWait(level)}
                      className="flex-1 h-12 rounded-[14px] text-sm font-bold border-2 transition-all active:scale-95"
                      style={{
                        background: isActive ? bg : "white",
                        borderColor: isActive ? color : "#eaedf0",
                        color: isActive ? color : "#5b6472",
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Open now */}
            <div className="flex items-center justify-between mb-5 p-4 bg-surface-2 rounded-[16px] border border-line">
              <div>
                <p className="font-bold text-ink text-sm">Ouvert maintenant</p>
                <p className="text-xs text-ink-3 mt-0.5">Afficher uniquement les établissements ouverts</p>
              </div>
              <button
                onClick={() => setOpenNow(prev => !prev)}
                className="w-11 h-6 rounded-full transition-colors relative shrink-0"
                style={{ background: openNow ? "#07984a" : "#c7cdd6" }}
              >
                <motion.span
                  animate={{ x: openNow ? 20 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute top-[2px] w-5 h-5 rounded-full bg-white shadow-sm block"
                />
              </button>
            </div>

            {/* Rating */}
            <div className="mb-6">
              <p className="section-eyebrow mb-3">Note minimale</p>
              <div className="flex gap-2">
                {[0, 3.5, 4, 4.5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setMinRating(rating)}
                    className="flex-1 h-11 rounded-[12px] text-sm font-bold border-2 transition-all active:scale-95"
                    style={{
                      background: minRating === rating ? "#0b1220" : "white",
                      borderColor: minRating === rating ? "#0b1220" : "#eaedf0",
                      color: minRating === rating ? "white" : "#5b6472",
                    }}
                  >
                    {rating === 0 ? "Tout" : `${rating}+★`}
                  </button>
                ))}
              </div>
            </div>

            {/* Apply */}
            <button
              onClick={onClose}
              className="w-full h-14 rounded-[15px] bg-tornoo-green text-white font-extrabold mb-3 active:scale-[0.98] transition-transform"
              style={{ boxShadow: "0 4px 20px rgba(7,152,74,.3)" }}
            >
              Voir les résultats
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function SearchPage() {
  const { t, lang } = useI18n();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tout");
  const [filterOpen, setFilterOpen] = useState(false);
  const [waitFilters, setWaitFilters] = useState<string[]>([]);
  const [openNowFilter, setOpenNowFilter] = useState(false);
  const [minRating, setMinRating] = useState(0);

  const activeFilterCount = waitFilters.length + (openNowFilter ? 1 : 0) + (minRating > 0 ? 1 : 0);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 280);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: establishments = [], isLoading } = useQuery({
    queryKey: ["establishments", "search", debouncedQuery],
    queryFn: () => api.establishments.list(debouncedQuery || undefined),
  });

  const filtered = establishments
    .filter((e) => activeCategory === "Tout" || e.category.toLowerCase().includes(activeCategory.toLowerCase()))
    .filter((e) => waitFilters.length === 0 || waitFilters.includes(e.waitLevel))
    .filter((e) => !openNowFilter || e.isOpen)
    .filter((e) => e.rating >= minRating);

  const resultsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isLoading || !resultsRef.current) return;
    const cards = resultsRef.current.querySelectorAll<HTMLElement>(".est-card");
    gsap.from(cards, {
      opacity: 0,
      y: 16,
      duration: 0.4,
      stagger: 0.06,
      ease: "power3.out",
      clearProps: "all",
    });
  }, [isLoading, filtered.length, activeCategory]);

  return (
    <div className="bg-white min-h-svh">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm px-4 pt-safe-top pb-3 space-y-3 border-b border-line">
        <h1 className="text-2xl font-black text-ink">{t.search}</h1>

        {/* Search input */}
        <div className="flex items-center gap-2">
          <div className="input-ring flex items-center gap-2 flex-1 bg-surface-2 rounded-[14px] px-4 h-12 border border-line transition-all">
            <MagnifyingGlass weight="bold" size={17} className="text-ink-3 shrink-0" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="flex-1 bg-transparent text-sm font-medium text-ink outline-none placeholder:text-ink-3"
              aria-label={t.search}
              autoFocus
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="Effacer">
                <X weight="bold" size={16} className="text-ink-3" />
              </button>
            )}
          </div>
          <button
            onClick={() => setFilterOpen(true)}
            className="relative w-12 h-12 rounded-[14px] bg-surface-2 border border-line flex items-center justify-center active:scale-95 transition-transform"
            aria-label="Filtres"
            style={activeFilterCount > 0 ? { borderColor: "#07984a", background: "#e4f6ec" } : undefined}
          >
            <Faders weight="bold" size={18} className={activeFilterCount > 0 ? "text-tornoo-green" : "text-ink-2"} />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-tornoo-green text-white text-[9px] font-black flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Category chips — sliding pill indicator */}
        <div className="relative -mx-4">
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none px-4 pb-1">
            {CATEGORIES.map((cat) => {
              const label = cat.label[lang as keyof typeof cat.label] ?? cat.label.fr;
              return (
                <button
                  key={cat.code}
                  onClick={() => setActiveCategory(cat.code)}
                  className="shrink-0 relative h-8 px-4 rounded-full text-sm font-bold flex items-center transition-colors"
                >
                  {activeCategory === cat.code && (
                    <motion.span
                      layoutId="search-cat-pill"
                      className="absolute inset-0 rounded-full bg-tornoo-green"
                      style={{ boxShadow: "0 2px 14px rgba(7,152,74,.32)" }}
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    />
                  )}
                  <span className={`relative z-10 transition-colors ${activeCategory === cat.code ? "text-white" : "text-ink-2"}`}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="pointer-events-none absolute right-0 top-0 bottom-1 w-10 bg-gradient-to-l from-white to-transparent" />
        </div>
      </div>

      <div className="px-4 pt-4 pb-6 space-y-3">
        {/* Wait level legend */}
        <div className="flex items-center gap-4 text-xs font-bold text-ink-2">
          <span className="flex items-center gap-1.5"><WaitDot level="low" /> {t.waitLow}</span>
          <span className="flex items-center gap-1.5"><WaitDot level="mod" /> {t.waitMod}</span>
          <span className="flex items-center gap-1.5"><WaitDot level="high" /> {t.waitHigh}</span>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 rounded-[22px] bg-surface-2 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            type="search"
            title={t.noResults}
            subtitle={t.tryOther}
          />
        ) : (
          <div ref={resultsRef} className="space-y-3">
            {filtered.map((e) => (
              <div key={e.id} className="est-card">
                <EstablishmentCard establishment={e} />
              </div>
            ))}
          </div>
        )}
      </div>

      <FilterSheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        waitFilters={waitFilters}
        setWaitFilters={setWaitFilters}
        openNow={openNowFilter}
        setOpenNow={setOpenNowFilter}
        minRating={minRating}
        setMinRating={setMinRating}
      />
    </div>
  );
}
