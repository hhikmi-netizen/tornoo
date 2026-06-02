"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal, MapPin, Bell, ChevronRight, History, Ticket, Map } from "lucide-react";
import { TornooLogo } from "@/components/tornoo/TornooLogo";
import { EstablishmentCard } from "@/components/tornoo/EstablishmentCard";
import { api } from "@/services/api";
import { MOCK_USER } from "@/lib/mock-data";

export default function HomePage() {
  const { data: establishments = [], isLoading } = useQuery({
    queryKey: ["establishments"],
    queryFn: () => api.establishments.list(),
  });

  const favorites = establishments.filter((e) => MOCK_USER.favorites.includes(e.id));

  return (
    <div className="bg-white min-h-svh">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-line px-4 pt-safe-top pb-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <TornooLogo compact showTagline={false} />
          <div className="flex items-center gap-2">
            <Link href="/notifications" className="relative w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center" aria-label="Notifications">
              <Bell size={20} className="text-ink-2" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-tornoo-green border-2 border-white" aria-hidden="true" />
            </Link>
            <Link href="/profile" className="w-10 h-10 rounded-full bg-surface-2 overflow-hidden" aria-label="Profil">
              <Image
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
                alt="Avatar"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </Link>
          </div>
        </div>
      </div>

      <div className="px-4 max-w-lg mx-auto space-y-5 pb-6 pt-4">
        {/* Search bar */}
        <Link href="/search" className="flex items-center gap-3 bg-surface-2 rounded-[14px] px-4 h-14 border border-line">
          <Search size={18} className="text-ink-3 shrink-0" />
          <span className="text-ink-3 font-medium flex-1 text-sm">Rechercher un établissement, un service...</span>
          <SlidersHorizontal size={18} className="text-tornoo-green shrink-0" />
        </Link>

        {/* Location */}
        <div className="flex items-center gap-3 bg-surface-2 rounded-[14px] px-4 h-12 border border-line">
          <MapPin size={17} className="text-tornoo-green shrink-0" />
          <div>
            <p className="text-[11px] text-ink-3 font-medium">Autour de moi</p>
            <p className="font-bold text-sm text-ink leading-none">Casablanca, Maroc</p>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Historique", icon: History, href: "/profile" },
            { label: "Mes tickets", icon: Ticket, href: "/ticket/current" },
            { label: "Notifications", icon: Bell, href: "/notifications" },
            { label: "Carte", icon: Map, href: "/search?view=map" },
          ].map(({ label, icon: Icon, href }) => (
            <Link
              key={label}
              href={href}
              className="flex flex-col items-center gap-2 bg-surface-2 rounded-[18px] p-3 border border-line"
            >
              <div className="w-10 h-10 rounded-full bg-low-bg flex items-center justify-center">
                <Icon size={18} className="text-tornoo-green" />
              </div>
              <span className="text-[11px] font-bold text-ink-2 text-center leading-tight">{label}</span>
            </Link>
          ))}
        </div>

        {/* Mes favoris */}
        {favorites.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-black text-ink">Mes favoris</h2>
              <Link href="/favorites" className="text-sm font-bold text-ink-3 flex items-center gap-0.5">
                Voir tout <ChevronRight size={14} />
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto scrollbar-none pb-1 -mx-4 px-4">
              {favorites.map((e) => (
                <EstablishmentCard key={e.id} establishment={e} variant="compact" />
              ))}
            </div>
          </section>
        )}

        {/* Établissements populaires */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-black text-ink">Établissements populaires</h2>
            <Link href="/search" className="text-sm font-bold text-ink-3 flex items-center gap-0.5">
              Voir tout <ChevronRight size={14} />
            </Link>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 rounded-[22px] bg-surface-2 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {establishments.map((e) => (
                <EstablishmentCard key={e.id} establishment={e} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
