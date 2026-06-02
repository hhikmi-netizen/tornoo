"use client";

import { useState } from "react";
import Link from "next/link";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { MagnifyingGlass, Faders, MapPin, Bell, CaretRight, ClockCounterClockwise, Ticket, MapTrifold } from "@phosphor-icons/react";
import { TornooLogo } from "@/components/tornoo/TornooLogo";
import { EstablishmentCard } from "@/components/tornoo/EstablishmentCard";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { useI18n } from "@/i18n/context";
import { api } from "@/services/api";
import { MOCK_USER } from "@/lib/mock-data";
import { WaitDot } from "@/components/tornoo/WaitBadge";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.35, ease: "easeOut" as const } }),
};

const CATEGORIES = [
  { label: "Tout", emoji: "✦" },
  { label: "Coiffure", emoji: "✂️" },
  { label: "Santé", emoji: "🏥" },
  { label: "Admin", emoji: "🏛️" },
  { label: "Bien-être", emoji: "🌿" },
  { label: "Pharmacie", emoji: "💊" },
];

export default function HomePage() {
  const { t } = useI18n();
  const [activeCategory, setActiveCategory] = useState("Tout");

  const { data: establishments = [], isLoading } = useQuery({
    queryKey: ["establishments"],
    queryFn: () => api.establishments.list(),
  });

  const { data: activeTicket } = useQuery({
    queryKey: ["ticket", "active"],
    queryFn: () => api.tickets.active(),
  });

  const favorites = establishments.filter((e) => MOCK_USER.favorites.includes(e.id));

  const filtered = activeCategory === "Tout"
    ? establishments
    : establishments.filter((e) => e.category.toLowerCase().includes(activeCategory.toLowerCase()));

  return (
    <div className="bg-white min-h-svh">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-line px-4 pt-safe-top pb-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <TornooLogo compact showTagline={false} />
          <div className="flex items-center gap-2">
            <Link
              href="/notifications"
              className="relative w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center border border-line"
              aria-label={t.notifications}
            >
              <Bell weight="duotone" size={18} className="text-ink-2" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-tornoo-green border-2 border-white" aria-hidden="true" />
            </Link>
            <Link href="/profile" className="w-10 h-10 rounded-full bg-surface-2 overflow-hidden border border-line" aria-label={t.profile}>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
                alt="Avatar"
                width={40}
                height={40}
                className="w-full h-full object-cover"
                fallback={
                  <div className="w-full h-full flex items-center justify-center bg-low-bg">
                    <span className="text-xs font-black text-tornoo-green">{MOCK_USER.name.charAt(0)}</span>
                  </div>
                }
              />
            </Link>
          </div>
        </div>
      </div>

      <div className="px-4 max-w-lg mx-auto pb-6 pt-4 space-y-5">
        {/* MagnifyingGlass bar */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show">
          <Link
            href="/search"
            className="flex items-center gap-3 bg-surface-2 rounded-[14px] px-4 h-14 border border-line shadow-1"
          >
            <MagnifyingGlass weight="bold" size={18} className="text-ink-3 shrink-0" />
            <span className="text-ink-3 font-medium flex-1 text-sm">{t.searchPlaceholder}</span>
            <Faders weight="bold" size={17} className="text-tornoo-green shrink-0" />
          </Link>
        </motion.div>

        {/* Location */}
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show"
          className="flex items-center gap-3 bg-surface-2 rounded-[14px] px-4 h-12 border border-line"
        >
          <MapPin weight="duotone" size={16} className="text-tornoo-green shrink-0" />
          <div>
            <p className="text-[10px] text-ink-3 font-semibold uppercase tracking-wide">{t.aroundMe}</p>
            <p className="font-bold text-sm text-ink leading-none">Casablanca, Maroc</p>
          </div>
        </motion.div>

        {/* Active ticket banner */}
        {activeTicket && (
          <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show">
            <Link
              href={`/my-turn?from=${activeTicket.establishmentSlug}`}
              className="flex items-center gap-3 bg-grad-navy rounded-[18px] px-4 py-3.5 text-white shadow-[0_4px_20px_rgba(6,24,25,.3)]"
            >
              <div className="w-10 h-10 rounded-full bg-tornoo-green/20 border border-tornoo-green/40 flex items-center justify-center shrink-0">
                <WaitDot level="low" size={9} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm">{activeTicket.establishmentName}</p>
                <p className="text-xs text-white/75">
                  Position #{activeTicket.position} · ~{activeTicket.estimatedWaitMinutes} min
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs font-bold text-tornoo-green">En cours</span>
                <CaretRight weight="bold" size={14} className="text-white/40" />
              </div>
            </Link>
          </motion.div>
        )}

        {/* Quick links */}
        <motion.div custom={activeTicket ? 3 : 2} variants={fadeUp} initial="hidden" animate="show"
          className="grid grid-cols-4 gap-3"
        >
          {[
            { label: t.history,       icon: ClockCounterClockwise, href: "/profile/history",   color: "#2563eb", bg: "#eff6ff" },
            { label: t.myTickets,     icon: Ticket,                href: "/ticket/current",    color: "#07984a", bg: "#e4f6ec" },
            { label: t.notifications, icon: Bell,                  href: "/notifications",     color: "#ff9300", bg: "#fff1de" },
            { label: "Carte",         icon: MapTrifold,            href: "/map",               color: "#0891b2", bg: "#e0f7fa" },
          ].map(({ label, icon: Icon, href, color, bg }) => (
            <Link
              key={label}
              href={href}
              className="flex flex-col items-center gap-2 bg-white rounded-[18px] p-3 border border-line shadow-1"
            >
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: bg }}>
                <Icon size={18} weight="duotone" style={{ color }} />
              </div>
              <span className="text-[10px] font-bold text-ink-2 text-center leading-tight">{label}</span>
            </Link>
          ))}
        </motion.div>

        {/* Favoris */}
        {favorites.length > 0 && (
          <motion.section custom={activeTicket ? 4 : 3} variants={fadeUp} initial="hidden" animate="show">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-black text-ink">{t.myFavorites}</h2>
              <Link href="/favorites" className="text-sm font-bold text-tornoo-green flex items-center gap-0.5">
                {t.seeAll} <CaretRight weight="bold" size={14} />
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto scrollbar-none pb-1 -mx-4 px-4">
              {favorites.map((e) => (
                <EstablishmentCard key={e.id} establishment={e} variant="compact" />
              ))}
            </div>
          </motion.section>
        )}

        {/* Populaires */}
        <motion.section custom={activeTicket ? 5 : 4} variants={fadeUp} initial="hidden" animate="show">
          <div className="flex items-center justify-between mb-3 gap-3">
            <h2 className="text-xl font-black text-ink">{t.popular}</h2>
            <Link href="/search" className="text-sm font-bold text-tornoo-green flex items-center gap-0.5 shrink-0">
              {t.seeAll} <CaretRight weight="bold" size={14} />
            </Link>
          </div>

          {/* Category chips */}
          <div className="relative -mx-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-none px-4 pb-3">
              {CATEGORIES.map(({ label, emoji }) => (
                <button
                  key={label}
                  onClick={() => setActiveCategory(label)}
                  className={`shrink-0 h-9 px-4 rounded-full text-sm font-bold flex items-center gap-1.5 transition-colors ${
                    activeCategory === label
                      ? "bg-tornoo-green text-white shadow-[0_2px_12px_rgba(7,152,74,.3)]"
                      : "bg-surface-2 text-ink-2 border border-line"
                  }`}
                >
                  <span className="text-[13px]">{emoji}</span>
                  {label}
                </button>
              ))}
            </div>
            <div className="pointer-events-none absolute right-0 top-0 bottom-3 w-8 bg-gradient-to-l from-white to-transparent" />
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm font-medium text-ink-3">Aucun établissement dans cette catégorie</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((e, i) => (
                <motion.div
                  key={e.id}
                  custom={5 + i}
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                >
                  <EstablishmentCard establishment={e} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}
