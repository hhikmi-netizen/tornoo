"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Buildings, Storefront, Wrench, QrCode, ChartBar, CreditCard,
  Bell, Globe, Question, SignOut, CaretRight, PencilSimple,
  CheckCircle, Users, Star,
} from "@phosphor-icons/react";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { MOCK_ESTABLISHMENTS } from "@/lib/mock-data";
import { useI18n } from "@/i18n/context";
import type { Lang } from "@/types";

const LANGS: { code: Lang; label: string }[] = [
  { code: "fr", label: "Français" },
  { code: "ar", label: "العربية" },
  { code: "en", label: "English" },
];

function MenuRow({
  icon: Icon,
  label,
  sub,
  href,
  color,
  bg,
  badge,
  idx,
  total,
}: {
  icon: React.ElementType;
  label: string;
  sub?: string;
  href: string;
  color: string;
  bg: string;
  badge?: string;
  idx: number;
  total: number;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3.5 active:bg-surface-2 transition-colors ${idx < total - 1 ? "border-b border-line" : ""}`}
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg }}>
        <Icon size={17} weight="duotone" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-ink">{label}</p>
        {sub && <p className="text-xs text-ink-3 mt-0.5">{sub}</p>}
      </div>
      {badge && (
        <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-tornoo-green text-white mr-1">{badge}</span>
      )}
      <CaretRight weight="bold" size={15} className="text-ink-4 shrink-0" />
    </Link>
  );
}

export default function ProProfilePage() {
  const router = useRouter();
  const { lang, setLang } = useI18n();
  const e = MOCK_ESTABLISHMENTS[0];
  const [userName, setUserName] = useState("Mon compte");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("tornoo_user");
      if (stored) {
        const u = JSON.parse(stored);
        if (u.name) setUserName(u.name);
        if (u.email) setUserEmail(u.email);
      }
    } catch {}
  }, []);

  const doLogout = () => {
    localStorage.removeItem("tornoo_auth");
    localStorage.removeItem("tornoo_role");
    localStorage.removeItem("tornoo_user");
    router.replace("/login");
  };

  const GESTION = [
    { icon: Storefront,  label: "Mon établissement",   sub: "Infos, horaires, photos",      href: "/pro/establishment", color: "#07984a", bg: "#e4f6ec" },
    { icon: Wrench,      label: "Services & tarifs",    sub: "Gérer vos prestations",        href: "/pro/services",      color: "#2563eb", bg: "#eff6ff" },
    { icon: Users,       label: "Files d'attente",      sub: "Gérer les files en temps réel",href: "/pro/queues",        color: "#7c3aed", bg: "#f5f3ff" },
    { icon: ChartBar,    label: "Statistiques",         sub: "Performances & analytiques",   href: "/pro/analytics",     color: "#0369a1", bg: "#e0f2fe" },
    { icon: QrCode,      label: "Mon QR code",          sub: "Afficher & partager",          href: "/pro/qrcode",        color: "#ff9300", bg: "#fff1de" },
  ];

  const COMPTE = [
    { icon: CreditCard,  label: "Abonnement",           sub: "Gérer votre plan Tornoo",      href: "/pro/subscription",  color: "#059669", bg: "#d1fae5", badge: "Starter" },
    { icon: Bell,        label: "Notifications",         sub: "Alertes et rappels",           href: "/notifications",     color: "#f59e0b", bg: "#fef3c7" },
    { icon: Question,    label: "Aide & support",        sub: "FAQ, contact",                 href: "/profile/help",      color: "#5b6472", bg: "#f0f2f4" },
  ];

  return (
    <div className="bg-surface-2 min-h-svh pb-28">
      {/* Header navy */}
      <div className="bg-grad-navy px-5 pt-safe-top pb-8">
        <div className="flex items-center justify-between mt-3 mb-5">
          <p className="text-white/60 text-sm font-bold">Espace professionnel</p>
          <Link href="/pro/establishment" aria-label="Modifier le profil"
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
            <PencilSimple size={16} weight="bold" className="text-white" />
          </Link>
        </div>

        {/* Establishment identity */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/20 shrink-0">
            <ImageWithFallback
              src={e.imageUrl} alt={e.name} width={64} height={64}
              className="w-full h-full object-cover"
              fallback={
                <div className="w-full h-full flex items-center justify-center bg-white/10">
                  <span className="text-2xl font-black text-white">{e.name.charAt(0)}</span>
                </div>
              }
            />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-black text-white leading-tight truncate">{e.name}</h1>
            <p className="text-white/60 text-sm mt-0.5">{e.category} · {e.city}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="flex items-center gap-1 text-xs font-bold text-tornoo-green bg-tornoo-green/15 px-2 py-0.5 rounded-full">
                <CheckCircle size={11} weight="fill" /> Ouvert
              </span>
              <span className="flex items-center gap-1 text-xs text-white/50">
                <Star size={11} weight="fill" className="text-[#f7c400]" /> {e.rating}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-3 space-y-4 max-w-lg mx-auto">
        {/* User account card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[22px] border border-line shadow-1 p-4 flex items-center gap-3"
        >
          <div className="w-12 h-12 rounded-full bg-grad-navy flex items-center justify-center shrink-0">
            <span className="text-lg font-black text-white">{userName.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-extrabold text-ink truncate">{userName}</p>
            <p className="text-xs text-ink-3 truncate">{userEmail || "Compte professionnel"}</p>
          </div>
          <div className="flex items-center gap-1 h-7 px-3 rounded-full bg-low-bg border border-low-rim">
            <Buildings size={13} weight="duotone" className="text-tornoo-green" />
            <span className="text-xs font-bold text-tornoo-green">Pro</span>
          </div>
        </motion.div>

        {/* Gestion section */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
          <p className="text-xs font-extrabold text-ink-3 uppercase tracking-widest mb-2 px-1">Gestion</p>
          <div className="bg-white rounded-[22px] border border-line shadow-1 overflow-hidden">
            {GESTION.map((item, i) => (
              <MenuRow key={item.label} {...item} idx={i} total={GESTION.length} />
            ))}
          </div>
        </motion.div>

        {/* Compte section */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <p className="text-xs font-extrabold text-ink-3 uppercase tracking-widest mb-2 px-1">Compte</p>
          <div className="bg-white rounded-[22px] border border-line shadow-1 overflow-hidden">
            {COMPTE.map((item, i) => (
              <MenuRow key={item.label} {...item} idx={i} total={COMPTE.length} />
            ))}
          </div>
        </motion.div>

        {/* Language */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.13 }}
          className="bg-white rounded-[22px] border border-line shadow-1 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Globe weight="duotone" size={17} className="text-ink-3" />
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

        {/* Logout */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
          <button
            onClick={doLogout}
            className="w-full flex items-center justify-center gap-2 h-12 rounded-[15px] bg-[#fde7e6] text-[#ef2b24] font-bold border border-[#f6c2bf] active:scale-[0.98] transition-transform"
          >
            <SignOut weight="bold" size={17} />
            Se déconnecter
          </button>
        </motion.div>

        <p className="text-center text-xs text-ink-4 pb-2">Tornoo Pro · v1.0</p>
      </div>
    </div>
  );
}
