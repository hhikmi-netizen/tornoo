"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { CaretLeft } from "@phosphor-icons/react";
import { EstablishmentCard } from "@/components/tornoo/EstablishmentCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { api } from "@/services/api";
import { MOCK_USER } from "@/lib/mock-data";

export default function FavoritesPage() {
  const router = useRouter();
  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => api.establishments.favorites(MOCK_USER.favorites),
  });

  return (
    <div className="bg-white min-h-svh">
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm px-4 pt-safe-top pb-3 border-b border-line flex items-center gap-3">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center" aria-label="Retour">
          <CaretLeft weight="bold" size={20} />
        </button>
        <h1 className="text-xl font-black text-ink">Mes favoris</h1>
      </div>

      <div className="px-4 pt-4 pb-6 max-w-lg mx-auto">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => <div key={i} className="h-32 rounded-[22px] bg-surface-2 animate-pulse" />)}
          </div>
        ) : favorites.length === 0 ? (
          <EmptyState
            type="favorites"
            title="Aucun favori"
            subtitle="Ajoutez des établissements à vos favoris pour les retrouver ici"
          />
        ) : (
          <div className="space-y-3">
            {favorites.map((e) => (
              <EstablishmentCard key={e.id} establishment={e} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
