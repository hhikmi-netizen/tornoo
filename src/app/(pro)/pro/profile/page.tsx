"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bell,
  Gear,
  MapPin,
  Star,
  CheckCircle,
  PencilSimple,
  Clock,
  Wrench,
  Users,
  QrCode,
  Camera,
} from "@phosphor-icons/react";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { MOCK_ESTABLISHMENTS } from "@/lib/mock-data";

/* ── Smooth bezier path helper ── */
function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return "";
  return pts
    .map((p, i) => {
      if (i === 0) return `M${p.x},${p.y}`;
      const prev = pts[i - 1];
      const cpX = (prev.x + p.x) / 2;
      return `C${cpX},${prev.y} ${cpX},${p.y} ${p.x},${p.y}`;
    })
    .join(" ");
}

/* ── Mini sparkline for performances section ── */
function PerfSparkline() {
  const values = [24, 31, 19, 28, 35, 22, 27];
  const W = 280, H = 64;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const pts = values.map((v, i) => ({
    x: (i / (values.length - 1)) * W,
    y: H - ((v - min) / range) * (H - 8) - 4,
  }));
  const line = smoothPath(pts);
  const area = line + ` L${pts[pts.length - 1].x},${H} L0,${H}Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-16 overflow-visible">
      <defs>
        <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#07984a" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#07984a" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#perfGrad)" />
      <path
        d={line}
        fill="none"
        stroke="#07984a"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {pts.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="3"
          fill={i === pts.length - 1 ? "#07984a" : "#b6e6c9"}
        />
      ))}
    </svg>
  );
}

/* ── Avatar circle with initial ── */
function Avatar({
  name,
  bg,
  size = "w-10 h-10",
}: {
  name: string;
  bg: string;
  size?: string;
}) {
  return (
    <div
      className={`${size} rounded-full flex items-center justify-center shrink-0 text-sm font-black text-white`}
      style={{ background: bg }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

const AVATAR_COLORS: Record<string, string> = {
  Ahmed: "#07984a",
  Karim: "#2563eb",
  Youssef: "#7c3aed",
  Hicham: "#ff9300",
};

const MOCK_QUEUE = [
  { name: "Ahmed", service: "Coupe homme", status: "En cours", statusType: "active" as const },
  { name: "Karim", service: "Coupe + barbe", status: "~12 min", statusType: "wait" as const },
  { name: "Youssef", service: "Coupe homme", status: "~25 min", statusType: "wait" as const },
  { name: "Hicham", service: "Coloration", status: "~40 min", statusType: "wait" as const },
];

export default function ProProfilePage() {
  const router = useRouter();
  const e = MOCK_ESTABLISHMENTS[0];
  const [userName, setUserName] = useState("Mon compte");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("tornoo_user");
      if (stored) {
        const u = JSON.parse(stored) as { name?: string; email?: string };
        if (u.name) setUserName(u.name);
      }
    } catch {}
  }, []);

  return (
    <div className="bg-surface-2 min-h-svh pb-28">
      {/* 1. Header */}
      <div className="flex items-center justify-between px-4 pt-safe-top py-3 bg-white border-b border-line">
        <h1 className="text-base font-extrabold text-ink">Mon Profil</h1>
        <div className="flex items-center gap-2">
          <button className="relative w-9 h-9 rounded-full bg-surface-2 flex items-center justify-center">
            <Bell weight="duotone" size={18} className="text-ink-2" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ef2b24] ring-2 ring-white" />
          </button>
          <Link
            href="/pro/settings"
            className="w-9 h-9 rounded-full bg-surface-2 flex items-center justify-center"
          >
            <Gear weight="duotone" size={18} className="text-ink-2" />
          </Link>
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        {/* 2. Cover + Identity */}
        <div className="relative">
          {/* Cover photo */}
          <div className="h-48 w-full overflow-hidden">
            <ImageWithFallback
              src={e.imageUrl}
              alt={e.name}
              width={900}
              height={192}
              className="w-full h-full object-cover"
              fallback={
                <div className="w-full h-full bg-gradient-to-br from-emerald-800 to-emerald-600" />
              }
            />
          </div>

          {/* Identity card below cover */}
          <div className="px-4 pb-4 bg-white">
            {/* Logo overlapping cover */}
            <div className="relative w-24 h-24 -mt-12 mb-3">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
                <ImageWithFallback
                  src={e.imageUrl}
                  alt={e.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                  fallback={
                    <div className="w-full h-full bg-gradient-to-br from-emerald-700 to-emerald-500 flex items-center justify-center">
                      <span className="text-3xl font-black text-white">{e.name.charAt(0)}</span>
                    </div>
                  }
                />
              </div>
              {/* Camera button */}
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-tornoo-green flex items-center justify-center shadow border-2 border-white">
                <Camera weight="fill" size={14} className="text-white" />
              </button>
            </div>

            {/* Name + verified */}
            <div className="flex items-center gap-1.5 mb-1">
              <h2 className="text-xl font-black text-ink leading-tight">{e.name}</h2>
              <CheckCircle weight="fill" size={20} className="text-tornoo-green shrink-0" />
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 text-sm text-ink-3 mb-2">
              <MapPin weight="duotone" size={14} className="text-tornoo-green shrink-0" />
              <span>{e.city}</span>
            </div>

            {/* Stars + open badge */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star weight="fill" size={14} className="text-[#f7c400]" />
                <span className="text-sm font-black text-ink">{e.rating}</span>
                <span className="text-xs text-ink-3">({e.reviewCount} avis)</span>
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-tornoo-green bg-tornoo-green/10 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-tornoo-green" />
                Établissement ouvert
              </span>
            </div>
          </div>
        </div>

        {/* 3. Quick actions grid */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="px-4 mt-4"
        >
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: PencilSimple, label: "Modifier profil", href: "/pro/establishment", color: "#07984a", bg: "#e4f6ec" },
              { icon: Clock, label: "Horaires", href: "/pro/schedule", color: "#2563eb", bg: "#eff6ff" },
              { icon: Wrench, label: "Services", href: "/pro/services", color: "#7c3aed", bg: "#f5f3ff" },
              { icon: Users, label: "Équipe", href: "/pro/queues", color: "#ff9300", bg: "#fff1de" },
            ].map(({ icon: Icon, label, href, color, bg }) => (
              <Link
                key={label}
                href={href}
                className="bg-white rounded-2xl border border-line shadow-1 p-3 flex flex-col items-center gap-2 active:scale-95 transition-transform"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                  <Icon weight="duotone" size={20} style={{ color }} />
                </div>
                <span className="text-[10px] font-bold text-ink-2 text-center leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* 4. Aperçu aujourd'hui */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="px-4 mt-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-extrabold text-ink">Aperçu aujourd&apos;hui</h2>
            <Link href="/pro/analytics" className="text-xs font-bold text-tornoo-green">
              Voir tout &gt;
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl border border-line shadow-1 p-3 text-center">
              <p className="text-2xl font-black text-tornoo-green">10</p>
              <p className="text-[11px] font-bold text-ink mt-0.5">clients</p>
              <p className="text-[10px] text-ink-3">En attente</p>
            </div>
            <div className="bg-white rounded-2xl border border-line shadow-1 p-3 text-center">
              <p className="text-2xl font-black text-[#ff9300]">22</p>
              <p className="text-[11px] font-bold text-ink mt-0.5">min</p>
              <p className="text-[10px] text-ink-3">Attente moy.</p>
            </div>
            <div className="bg-white rounded-2xl border border-line shadow-1 p-3 text-center">
              <p className="text-2xl font-black text-[#2563eb]">27</p>
              <p className="text-[11px] font-bold text-ink mt-0.5">&nbsp;</p>
              <p className="text-[10px] text-ink-3">Terminés</p>
            </div>
          </div>
        </motion.div>

        {/* 5. File actuelle */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="px-4 mt-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-extrabold text-ink">File actuelle</h2>
            <Link href="/pro/queues" className="text-xs font-bold text-tornoo-green">
              Voir la file &gt;
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-line shadow-1 overflow-hidden mb-3">
            {MOCK_QUEUE.map((client, i) => (
              <div
                key={client.name}
                className={`flex items-center gap-3 px-4 py-3 ${i < MOCK_QUEUE.length - 1 ? "border-b border-line" : ""}`}
              >
                <Avatar
                  name={client.name}
                  bg={AVATAR_COLORS[client.name] ?? "#07984a"}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-ink leading-tight">{client.name}</p>
                  <p className="text-xs text-ink-3">{client.service}</p>
                </div>
                {client.statusType === "active" ? (
                  <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-tornoo-green/10 text-tornoo-green">
                    {client.status}
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-ink-3">{client.status}</span>
                )}
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/pro/queues/new"
              className="flex items-center justify-center gap-2 h-12 rounded-[14px] bg-surface-2 border border-line text-sm font-bold text-ink active:scale-95 transition-transform"
            >
              <Users weight="duotone" size={16} className="text-tornoo-green" />
              Ajouter un client
            </Link>
            <button
              onClick={() => router.push("/pro/qrcode")}
              className="flex items-center justify-center gap-2 h-12 rounded-[14px] bg-tornoo-green text-white text-sm font-bold active:scale-95 transition-transform"
            >
              <QrCode weight="duotone" size={16} />
              Scanner un ticket
            </button>
          </div>
        </motion.div>

        {/* 6. Performances */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="px-4 mt-4"
        >
          <div className="bg-white rounded-2xl border border-line shadow-1 p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-extrabold text-ink">Performances</h2>
              <span className="text-[10px] font-bold text-ink-3 bg-surface-2 border border-line rounded-full px-2 py-0.5">
                7 derniers jours
              </span>
            </div>

            <PerfSparkline />

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-line">
              <div className="text-center">
                <p className="text-base font-black text-ink">183</p>
                <p className="text-[10px] text-ink-3">Clients servis</p>
              </div>
              <div className="w-px h-8 bg-line" />
              <div className="text-center">
                <p className="text-base font-black text-ink">12 450</p>
                <p className="text-[10px] text-ink-3">Revenus DH</p>
              </div>
              <div className="w-px h-8 bg-line" />
              <div className="text-center">
                <p className="text-base font-black text-ink">4.8/5</p>
                <p className="text-[10px] text-ink-3">Avis</p>
              </div>
            </div>

            <Link
              href="/pro/analytics"
              className="mt-4 flex items-center justify-center text-sm font-bold text-tornoo-green"
            >
              Voir les statistiques &gt;
            </Link>
          </div>
        </motion.div>

        {/* 7. Settings link */}
        <div className="px-4 mt-6 pb-4 text-center">
          <Link href="/pro/settings" className="text-xs text-ink-3 underline underline-offset-2">
            Paramètres &amp; compte
          </Link>
        </div>
      </div>
    </div>
  );
}
