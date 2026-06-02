"use client";

import Link from "next/link";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import {
  Ticket, History, Bell, Settings, HelpCircle, LogOut, ChevronRight, Globe
} from "lucide-react";
import { useI18n } from "@/i18n/context";
import { TornooLogo } from "@/components/tornoo/TornooLogo";
import { MOCK_USER } from "@/lib/mock-data";
import type { Lang } from "@/types";

const MENU_ITEMS = [
  { label: "Mes tickets", icon: Ticket, href: "/ticket/current" },
  { label: "Historique", icon: History, href: "/profile/history" },
  { label: "Notifications", icon: Bell, href: "/notifications" },
  { label: "Paramètres", icon: Settings, href: "/profile/settings" },
  { label: "Aide", icon: HelpCircle, href: "/profile/help" },
];

const LANGUAGES: { code: Lang; label: string }[] = [
  { code: "fr", label: "Français" },
  { code: "ar", label: "العربية" },
  { code: "en", label: "English" },
];

export default function ProfilePage() {
  const { lang, setLang } = useI18n();

  return (
    <div className="bg-surface-2 min-h-svh">
      {/* Header */}
      <div className="bg-white px-4 pt-safe-top pb-6 border-b border-line">
        <div className="flex items-center justify-between mb-6">
          <TornooLogo compact showTagline={false} />
          <Link href="/profile/settings" className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center" aria-label="Paramètres">
            <Settings size={19} className="text-ink-2" />
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-surface-2 shrink-0">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
              alt="Avatar"
              width={64}
              height={64}
              className="w-full h-full object-cover"
              fallback={
                <div className="w-full h-full flex items-center justify-center bg-low-bg">
                  <span className="text-xl font-black text-tornoo-green">{MOCK_USER.name.charAt(0)}</span>
                </div>
              }
            />
          </div>
          <div>
            <h1 className="text-xl font-black text-ink">{MOCK_USER.name}</h1>
            <p className="text-sm text-ink-3">{MOCK_USER.email}</p>
            <p className="text-xs text-ink-3 mt-0.5">{MOCK_USER.phone}</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 pb-8 max-w-lg mx-auto space-y-4">
        {/* Menu */}
        <nav className="bg-white rounded-[22px] border border-line shadow-1 overflow-hidden">
          {MENU_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-4 hover:bg-surface-2 transition-colors ${i < MENU_ITEMS.length - 1 ? "border-b border-line" : ""}`}
              >
                <div className="w-9 h-9 rounded-xl bg-low-bg flex items-center justify-center">
                  <Icon size={17} className="text-tornoo-green" />
                </div>
                <span className="flex-1 font-bold text-sm text-ink">{item.label}</span>
                <ChevronRight size={16} className="text-ink-4" />
              </Link>
            );
          })}
        </nav>

        {/* Language selector */}
        <div className="bg-white rounded-[22px] border border-line shadow-1 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Globe size={17} className="text-ink-3" />
            <h2 className="font-bold text-sm text-ink">Langue</h2>
          </div>
          <div className="flex gap-2">
            {LANGUAGES.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={`flex-1 h-10 rounded-[12px] text-sm font-bold transition-colors ${
                  lang === code
                    ? "bg-tornoo-green text-white"
                    : "bg-surface-2 text-ink-2 border border-line"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Pro link */}
        <Link
          href="/pro"
          className="flex items-center gap-3 bg-grad-navy text-white rounded-[22px] p-4 border border-white/10"
        >
          <div className="flex-1">
            <p className="font-black">Espace professionnel</p>
            <p className="text-sm text-white/60 mt-0.5">Gérez votre établissement</p>
          </div>
          <ChevronRight size={18} className="text-white/60" />
        </Link>

        {/* Logout */}
        <button className="w-full flex items-center justify-center gap-2 h-12 rounded-[15px] bg-[#fde7e6] text-[#ef2b24] font-bold border border-[#f6c2bf]">
          <LogOut size={17} />
          Déconnexion
        </button>
      </div>
    </div>
  );
}
