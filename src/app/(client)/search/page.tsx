"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { EstablishmentCard } from "@/components/tornoo/EstablishmentCard";
import { WaitDot } from "@/components/tornoo/WaitBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { api } from "@/services/api";

const CATEGORIES = ["Tout", "Coiffure", "Santé", "Administration", "Bien-être", "Pharmacie"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tout");

  const { data: establishments = [], isLoading } = useQuery({
    queryKey: ["establishments", "search", query],
    queryFn: () => api.establishments.list(query || undefined),
  });

  const filtered = activeCategory === "Tout"
    ? establishments
    : establishments.filter((e) => e.category.toLowerCase().includes(activeCategory.toLowerCase()));

  return (
    <div className="bg-white min-h-svh">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm px-4 pt-safe-top pb-3 space-y-3 border-b border-line">
        <h1 className="text-2xl font-black text-ink">Rechercher</h1>

        {/* Search input */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 flex-1 bg-surface-2 rounded-[14px] px-4 h-12 border border-line">
            <Search size={17} className="text-ink-3 shrink-0" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Établissement, service..."
              className="flex-1 bg-transparent text-sm font-medium text-ink outline-none placeholder:text-ink-3"
              aria-label="Rechercher"
              autoFocus
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="Effacer">
                <X size={16} className="text-ink-3" />
              </button>
            )}
          </div>
          <button className="w-12 h-12 rounded-[14px] bg-surface-2 border border-line flex items-center justify-center" aria-label="Filtres">
            <SlidersHorizontal size={18} className="text-ink-2" />
          </button>
        </div>

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none -mx-4 px-4 pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 h-8 px-4 rounded-full text-sm font-bold transition-colors ${
                activeCategory === cat
                  ? "bg-tornoo-green text-white"
                  : "bg-surface-2 text-ink-2 border border-line"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 pb-6 space-y-3">
        {/* Status legend */}
        <div className="flex items-center gap-4 text-xs font-bold text-ink-2">
          <span className="flex items-center gap-1.5"><WaitDot level="low" /> Faible</span>
          <span className="flex items-center gap-1.5"><WaitDot level="mod" /> Modéré</span>
          <span className="flex items-center gap-1.5"><WaitDot level="high" /> Fort</span>
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
            title="Aucun résultat"
            subtitle="Essayez un autre terme ou une autre catégorie"
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((e) => (
              <EstablishmentCard key={e.id} establishment={e} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
