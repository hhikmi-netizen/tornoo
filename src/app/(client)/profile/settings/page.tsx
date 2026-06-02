"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, Bell, Globe, Shield, Smartphone, LogOut } from "lucide-react";
import { useI18n } from "@/i18n/context";
import type { Lang } from "@/types";

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className="relative w-12 h-6 rounded-full transition-colors"
      style={{ background: value ? "#07984a" : "#c7cdd6" }}
    >
      <motion.div
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
        animate={{ left: value ? "calc(100% - 20px)" : "4px" }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "ar", label: "العربية", flag: "🇲🇦" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

export default function SettingsPage() {
  const router = useRouter();
  const { lang, setLang } = useI18n();
  const [notifTurn, setNotifTurn] = useState(true);
  const [notifPromo, setNotifPromo] = useState(false);
  const [notifSms, setNotifSms] = useState(true);

  const SETTINGS_GROUPS = [
    {
      title: "Notifications",
      icon: Bell,
      items: [
        { label: "Mon tour approche", sub: "Alerte avant votre passage", value: notifTurn, onChange: setNotifTurn },
        { label: "Offres et promotions", sub: "Promos des établissements", value: notifPromo, onChange: setNotifPromo },
        { label: "SMS", sub: "Rappels par SMS", value: notifSms, onChange: setNotifSms },
      ],
    },
  ];

  return (
    <div className="bg-surface-2 min-h-svh">
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm px-4 pt-safe-top pb-3 border-b border-line flex items-center gap-3">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center" aria-label="Retour">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-xl font-black text-ink">Paramètres</h1>
      </div>

      <div className="px-4 pt-4 pb-8 max-w-lg mx-auto space-y-5">
        {/* Notifications */}
        {SETTINGS_GROUPS.map((group) => {
          const GroupIcon = group.icon;
          return (
            <motion.section
              key={group.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2 mb-3 px-1">
                <GroupIcon size={15} className="text-ink-3" />
                <h2 className="text-sm font-black text-ink-2 uppercase tracking-wide">{group.title}</h2>
              </div>
              <div className="bg-white rounded-[22px] border border-line shadow-1 overflow-hidden">
                {group.items.map((item, idx) => (
                  <div
                    key={item.label}
                    className={`flex items-center justify-between px-4 py-3.5 ${idx < group.items.length - 1 ? "border-b border-line" : ""}`}
                  >
                    <div>
                      <p className="font-bold text-sm text-ink">{item.label}</p>
                      <p className="text-xs text-ink-3 mt-0.5">{item.sub}</p>
                    </div>
                    <Toggle value={item.value} onChange={item.onChange} />
                  </div>
                ))}
              </div>
            </motion.section>
          );
        })}

        {/* Language */}
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center gap-2 mb-3 px-1">
            <Globe size={15} className="text-ink-3" />
            <h2 className="text-sm font-black text-ink-2 uppercase tracking-wide">Langue</h2>
          </div>
          <div className="bg-white rounded-[22px] border border-line shadow-1 overflow-hidden">
            {LANGS.map(({ code, label, flag }, idx) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors ${idx < LANGS.length - 1 ? "border-b border-line" : ""} ${lang === code ? "bg-low-bg" : ""}`}
              >
                <span className="text-xl">{flag}</span>
                <span className={`flex-1 font-bold text-sm ${lang === code ? "text-tornoo-green" : "text-ink"}`}>{label}</span>
                {lang === code && (
                  <div className="w-5 h-5 rounded-full bg-tornoo-green flex items-center justify-center">
                    <svg viewBox="0 0 12 12" className="w-3 h-3">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </motion.section>

        {/* App info */}
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="bg-white rounded-[22px] border border-line shadow-1 overflow-hidden">
            {[
              { icon: Shield, label: "Confidentialité" },
              { icon: Smartphone, label: "À propos de l'app" },
            ].map(({ icon: Icon, label }, idx) => (
              <div key={label} className={`flex items-center gap-3 px-4 py-3.5 ${idx === 0 ? "border-b border-line" : ""}`}>
                <Icon size={17} className="text-ink-3" />
                <span className="flex-1 font-bold text-sm text-ink">{label}</span>
                <ChevronLeft size={15} className="text-ink-4 rotate-180" />
              </div>
            ))}
          </div>
        </motion.section>

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full flex items-center justify-center gap-2 h-12 rounded-[15px] bg-high-bg text-high font-bold border border-high-rim text-sm"
        >
          <LogOut size={16} />
          Déconnexion
        </motion.button>

        <p className="text-center text-xs text-ink-4">Tornoo v1.0.0 · Made with ❤️ in Morocco</p>
      </div>
    </div>
  );
}
