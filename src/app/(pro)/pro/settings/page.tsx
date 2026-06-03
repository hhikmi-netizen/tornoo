"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CaretLeft, Globe, Bell, Lock, Buildings, SignOut, Trash } from "@phosphor-icons/react";
import { useI18n } from "@/i18n/context";
import type { Lang } from "@/types";

const LANGS: { code: Lang; label: string }[] = [
  { code: "fr", label: "Français" },
  { code: "ar", label: "العربية" },
  { code: "en", label: "English" },
];

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${value ? "bg-tornoo-green" : "bg-[#d0d5dd]"}`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${value ? "left-[22px]" : "left-0.5"}`}
      />
    </button>
  );
}

export default function ProSettingsPage() {
  const router = useRouter();
  const { lang, setLang } = useI18n();
  const [notifQueue, setNotifQueue] = useState(true);
  const [notifClient, setNotifClient] = useState(true);
  const [notifPromo, setNotifPromo] = useState(false);

  const doLogout = () => {
    localStorage.removeItem("tornoo_auth");
    localStorage.removeItem("tornoo_role");
    localStorage.removeItem("tornoo_user");
    router.replace("/login");
  };

  const SECTIONS = [
    {
      title: "Notifications",
      icon: Bell,
      items: [
        { label: "Alertes file d'attente", sub: "Quand un client rejoint ou quitte", value: notifQueue, onChange: setNotifQueue },
        { label: "Rappels clients", sub: "Notifier 15 min avant leur tour", value: notifClient, onChange: setNotifClient },
        { label: "Offres Tornoo", sub: "Actualités et promotions", value: notifPromo, onChange: setNotifPromo },
      ],
    },
  ];

  return (
    <div className="bg-surface-2 min-h-svh pb-28">
      {/* Header */}
      <div className="bg-white border-b border-line px-4 pt-safe-top pb-4 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-surface-2 border border-line flex items-center justify-center"
        >
          <CaretLeft weight="bold" size={18} className="text-ink" />
        </button>
        <h1 className="font-black text-lg text-ink flex-1">Paramètres</h1>
      </div>

      <div className="px-4 pt-4 space-y-4 max-w-lg mx-auto">
        {/* Notifications */}
        {SECTIONS.map(({ title, icon: Icon, items }) => (
          <motion.div key={title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[22px] border border-line shadow-1 overflow-hidden">
            <div className="px-4 py-3 border-b border-line flex items-center gap-2">
              <Icon weight="duotone" size={17} className="text-tornoo-green" />
              <h2 className="font-black text-sm text-ink">{title}</h2>
            </div>
            {items.map((item, i) => (
              <div key={item.label}
                className={`flex items-center gap-3 px-4 py-4 ${i < items.length - 1 ? "border-b border-line" : ""}`}>
                <div className="flex-1">
                  <p className="font-bold text-sm text-ink">{item.label}</p>
                  <p className="text-xs text-ink-3 mt-0.5">{item.sub}</p>
                </div>
                <Toggle value={item.value} onChange={item.onChange} />
              </div>
            ))}
          </motion.div>
        ))}

        {/* Language */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="bg-white rounded-[22px] border border-line shadow-1 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Globe weight="duotone" size={17} className="text-tornoo-green" />
            <h2 className="font-bold text-sm text-ink">Langue</h2>
          </div>
          <div className="flex gap-2">
            {LANGS.map(({ code, label }) => (
              <button key={code} onClick={() => setLang(code)}
                className={`flex-1 h-10 rounded-[12px] text-sm font-bold transition-colors ${
                  lang === code ? "bg-tornoo-green text-white" : "bg-surface-2 text-ink-2 border border-line"
                }`}>
                {label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Account */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          className="bg-white rounded-[22px] border border-line shadow-1 overflow-hidden">
          <div className="px-4 py-3 border-b border-line flex items-center gap-2">
            <Lock weight="duotone" size={17} className="text-ink-3" />
            <h2 className="font-black text-sm text-ink">Compte & sécurité</h2>
          </div>
          {[
            { label: "Modifier le mot de passe", sub: "Changer vos identifiants" },
            { label: "Données personnelles", sub: "Télécharger ou supprimer" },
          ].map((item, i, arr) => (
            <button key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-4 text-left active:bg-surface-2 ${i < arr.length - 1 ? "border-b border-line" : ""}`}>
              <div className="flex-1">
                <p className="font-bold text-sm text-ink">{item.label}</p>
                <p className="text-xs text-ink-3 mt-0.5">{item.sub}</p>
              </div>
            </button>
          ))}
        </motion.div>

        {/* Danger zone */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="space-y-2">
          <button
            onClick={doLogout}
            className="w-full flex items-center justify-center gap-2 h-12 rounded-[15px] bg-[#fde7e6] text-[#ef2b24] font-bold border border-[#f6c2bf] active:scale-[0.98] transition-transform"
          >
            <SignOut weight="bold" size={17} />
            Se déconnecter
          </button>
          <button
            className="w-full flex items-center justify-center gap-2 h-10 rounded-[15px] text-[#ef2b24] font-medium text-sm active:opacity-70 transition-opacity"
          >
            <Trash weight="bold" size={14} />
            Supprimer mon compte
          </button>
        </motion.div>

        <p className="text-center text-xs text-ink-4 pb-2">Tornoo Pro · v1.0</p>
      </div>
    </div>
  );
}
