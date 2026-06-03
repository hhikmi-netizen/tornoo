"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
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

export default function SearchPage() {
  const { t, lang } = useI18n();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tout");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 280);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: establishments = [], isLoading } = useQuery({
    queryKey: ["establishments", "search", debouncedQuery],
    queryFn: () => api.establishments.list(debouncedQuery || undefined),
  });

  const filtered = activeCategory === "Tout"
    ? establishments
    : establishments.filter((e) => e.category.toLowerCase().includes(activeCategory.toLowerCase()));

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
          <div className="flex items-center gap-2 flex-1 bg-surface-2 rounded-[14px] px-4 h-12 border border-line">
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
          <button className="w-12 h-12 rounded-[14px] bg-surface-2 border border-line flex items-center justify-center" aria-label="Filtres">
            <Faders weight="bold" size={18} className="text-ink-2" />
          </button>
        </div>

        {/* Category chips */}
        <div className="relative -mx-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-none px-4 pb-1">
            {CATEGORIES.map((cat) => {
              const label = cat.label[lang as keyof typeof cat.label] ?? cat.label.fr;
              return (
                <button
                  key={cat.code}
                  onClick={() => setActiveCategory(cat.code)}
                  className={`shrink-0 h-8 px-4 rounded-full text-sm font-bold transition-colors ${
                    activeCategory === cat.code
                      ? "bg-tornoo-green text-white"
                      : "bg-surface-2 text-ink-2 border border-line"
                  }`}
                >
                  {label}
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
    </div>
  );
}
