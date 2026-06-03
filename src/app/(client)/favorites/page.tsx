"use client";

import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { CaretLeft, Heart } from "@phosphor-icons/react";
import { EstablishmentCard } from "@/components/tornoo/EstablishmentCard";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { api } from "@/services/api";
import { gsap } from "@/lib/gsap";
import { MOCK_USER } from "@/lib/mock-data";

export default function FavoritesPage() {
  const router = useRouter();
  const heartRefs = useRef<Record<string, HTMLElement | null>>({});

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => api.establishments.favorites(MOCK_USER.favorites),
  });

  const [localFavorites, setLocalFavorites] = useState<typeof favorites>([]);
  const [initialized, setInitialized] = useState(false);

  if (!initialized && favorites.length > 0) {
    setLocalFavorites(favorites);
    setInitialized(true);
  }

  const removeFavorite = (id: string) => {
    const el = heartRefs.current[id];
    if (el) {
      gsap.to(el, {
        scale: 1.4,
        duration: 0.15,
        onComplete: () =>
          gsap.to(el, {
            scale: 0,
            opacity: 0,
            duration: 0.2,
            onComplete: () => setLocalFavorites((prev) => prev.filter((f) => f.id !== id)),
          }),
      });
    } else {
      setLocalFavorites((prev) => prev.filter((f) => f.id !== id));
    }
  };

  return (
    <div className="min-h-svh bg-surface-2">
      {/* Dark navy header */}
      <div className="bg-grad-navy px-5 pt-safe-top pb-20 rounded-b-[38px]">
        <div className="flex items-center justify-between mt-2">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center active:bg-white/20 transition-colors"
            aria-label="Retour"
          >
            <CaretLeft weight="bold" size={20} className="text-white" />
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white">Mes favoris</h1>
            <span className="w-7 h-7 rounded-full bg-tornoo-green flex items-center justify-center text-white text-xs font-black">
              {isLoading ? "…" : localFavorites.length}
            </span>
          </div>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-4 -mt-12 pb-6 space-y-3">
        {isLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : localFavorites.length === 0 ? (
          <div className="pt-8">
            <EmptyState
              type="favorites"
              title="Aucun favori"
              subtitle="Ajoutez des établissements à vos favoris pour les retrouver ici"
            />
          </div>
        ) : (
          <>
            <p className="section-eyebrow pt-2">{localFavorites.length} établissement{localFavorites.length > 1 ? "s" : ""}</p>
            {localFavorites.map((fav) => (
              <div key={fav.id} className="relative">
                <EstablishmentCard establishment={fav} />
                <button
                  ref={(el) => { heartRefs.current[fav.id] = el; }}
                  onClick={() => removeFavorite(fav.id)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white shadow-1 flex items-center justify-center border border-line active:scale-90 transition-transform"
                  aria-label="Retirer des favoris"
                >
                  <Heart weight="fill" size={16} className="text-[#ef2b24]" />
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
