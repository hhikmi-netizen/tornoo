"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  CaretLeft, CaretDown, DownloadSimple, TrendUp, TrendDown,
  Users, Clock, CurrencyDollar, Star, ArrowRight, Lightning,
} from "@phosphor-icons/react";
import { api } from "@/services/api";
import { gsap } from "@/lib/gsap";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { useToast } from "@/components/ui/Toast";

/* ── Smooth bezier path from points ── */
function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return "";
  const d = pts.map((p, i) => {
    if (i === 0) return `M${p.x},${p.y}`;
    const prev = pts[i - 1];
    const cpX = (prev.x + p.x) / 2;
    return `C${cpX},${prev.y} ${cpX},${p.y} ${p.x},${p.y}`;
  });
  return d.join(" ");
}

/* ── Sparkline mini chart ── */
function Sparkline({ values, color = "#07984a" }: { values: number[]; color?: string }) {
  if (values.length < 2) return null;
  const W = 64, H = 28;
  const max = Math.max(...values, 1);
  const min = Math.min(...values);
  const range = max - min || 1;
  const pts = values.map((v, i) => ({
    x: (i / (values.length - 1)) * W,
    y: H - ((v - min) / range) * (H - 4) - 2,
  }));
  const line = smoothPath(pts);
  const area = line + ` L${pts[pts.length - 1].x},${H} L0,${H}Z`;
  return (
    <svg width={W} height={H} className="overflow-visible">
      <defs>
        <linearGradient id={`sg-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sg-${color.replace("#", "")})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── KPI Card ── */
function KpiCard({
  label, value, suffix = "", prefix = "", trend, trendLabel, color, bg, border,
  sparkValues, icon: Icon, delay = 0, decimals = 0,
}: {
  label: string; value: number; suffix?: string; prefix?: string;
  trend?: number; trendLabel?: string; color: string; bg: string; border: string;
  sparkValues?: number[]; icon: React.ElementType; delay?: number; decimals?: number;
}) {
  const isUp = (trend ?? 0) >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: "easeOut" }}
      className="bg-white rounded-[22px] border p-5 shadow-1 flex flex-col gap-3"
      style={{ borderColor: border }}
    >
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
          <Icon weight="duotone" size={20} style={{ color }} />
        </div>
        {sparkValues && <Sparkline values={sparkValues} color={color} />}
      </div>
      <div>
        <p className="section-eyebrow mb-1">{label}</p>
        <AnimatedNumber
          value={value}
          duration={1.4}
          delay={delay + 0.2}
          prefix={prefix}
          suffix={suffix}
          decimals={decimals}
          className="text-3xl font-black text-ink block"
        />
      </div>
      {trend !== undefined && (
        <div className="flex items-center gap-1.5">
          {isUp
            ? <TrendUp weight="fill" size={14} className="text-tornoo-green" />
            : <TrendDown weight="fill" size={14} className="text-[#ef2b24]" />}
          <span className={`text-xs font-bold ${isUp ? "text-tornoo-green" : "text-[#ef2b24]"}`}>
            {isUp ? "+" : ""}{trend}% {trendLabel}
          </span>
        </div>
      )}
    </motion.div>
  );
}

/* ── Revenue area chart ── */
function RevenueChart({ data }: { data: { date: string; revenue: number; clients: number }[] }) {
  const pathRef = useRef<SVGPathElement>(null);
  const areaRef = useRef<SVGPathElement>(null);

  const W = 320, H = 120, padX = 0, padY = 8;
  const maxVal = Math.max(...data.map((d) => d.revenue), 1);
  const pts = data.map((d, i) => ({
    x: padX + (i / (data.length - 1)) * (W - padX * 2),
    y: padY + (1 - d.revenue / maxVal) * (H - padY * 2),
  }));
  const linePath = smoothPath(pts);
  const areaPath = linePath + ` L${pts[pts.length - 1].x},${H} L${pts[0].x},${H}Z`;

  useEffect(() => {
    const line = pathRef.current;
    const area = areaRef.current;
    if (!line || !area) return;
    const len = line.getTotalLength();
    gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
    gsap.set(area, { opacity: 0 });
    gsap.to(line, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut", delay: 0.3 });
    gsap.to(area, { opacity: 1, duration: 0.8, delay: 1.0, ease: "power1.in" });
    return () => { gsap.killTweensOf([line, area]); };
  }, [data]);

  const days = data.map((d) => new Date(d.date).toLocaleDateString("fr", { weekday: "short" }));

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[120px] overflow-visible">
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#07984a" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#07984a" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path ref={areaRef} d={areaPath} fill="url(#revGrad)" />
        <path ref={pathRef} d={linePath} fill="none" stroke="#07984a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill={i === pts.length - 1 ? "#07984a" : "#b6e6c9"} />
        ))}
        <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="7" fill="#07984a" opacity="0.15" />
      </svg>
      <div className="flex justify-between mt-2 px-0.5">
        {days.map((d, i) => (
          <span key={i} className="text-[10px] text-ink-3 font-medium capitalize">{d}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Horizontal bar ── */
function ServiceBar({ name, pct, value, rank }: { name: string; pct: number; value: number; rank: number }) {
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!barRef.current) return;
    gsap.from(barRef.current, {
      scaleX: 0,
      transformOrigin: "left center",
      duration: 0.7,
      delay: rank * 0.1,
      ease: "power3.out",
    });
  }, [rank]);

  const colors = ["#07984a", "#ff9300", "#2563eb", "#7c3aed", "#ef2b24"];
  const c = colors[rank % colors.length];

  return (
    <div className="flex items-center gap-3">
      <span className="w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center shrink-0 text-white"
        style={{ background: c }}>
        {rank + 1}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-bold text-ink truncate">{name}</span>
          <span className="text-xs font-black text-ink-2 ml-2">{pct}%</span>
        </div>
        <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
          <div ref={barRef} className="h-full rounded-full" style={{ width: `${pct}%`, background: c }} />
        </div>
      </div>
      <span className="text-xs text-ink-3 font-medium shrink-0">{value}</span>
    </div>
  );
}

/* ── Activity feed item ── */
function ActivityItem({ type, ticket, time, i }: { type: "served" | "joined" | "cancelled"; ticket: string; time: string; i: number }) {
  const config = {
    served:    { dot: "#07984a", label: "Servi",     bg: "#e4f6ec" },
    joined:    { dot: "#2563eb", label: "Rejoint",   bg: "#eff6ff" },
    cancelled: { dot: "#ef2b24", label: "Annulé",    bg: "#fde7e6" },
  }[type];

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6 + i * 0.06 }}
      className="flex items-center gap-3 py-2.5"
    >
      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: config.dot }} />
      <div className="flex-1">
        <span className="text-sm font-bold text-ink">{ticket}</span>
        <span
          className="ml-2 inline-flex items-center h-5 px-2 rounded-full text-[10px] font-bold"
          style={{ background: config.bg, color: config.dot }}
        >
          {config.label}
        </span>
      </div>
      <span className="text-xs text-ink-3">{time}</span>
    </motion.div>
  );
}

/* ── Period pill ── */
const PERIODS = [
  { key: "7j", label: "7 jours" },
  { key: "30j", label: "30 jours" },
  { key: "3m", label: "3 mois" },
];

export default function AnalyticsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [period, setPeriod] = useState("7j");
  const [periodOpen, setPeriodOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  const { data: stats = [] } = useQuery({
    queryKey: ["pro-stats"],
    queryFn: () => api.pro.stats(),
  });

  const totals = stats.reduce(
    (acc, d) => ({
      clients: acc.clients + d.clientsServed,
      revenue: acc.revenue + (d.revenue ?? 0),
      avgWait: acc.avgWait + d.avgWaitMinutes / (stats.length || 1),
    }),
    { clients: 0, revenue: 0, avgWait: 0 }
  );

  const revenueData = stats.map((d) => ({ date: d.date, revenue: d.revenue ?? 0, clients: d.clientsServed }));
  const clientValues = stats.map((d) => d.clientsServed);

  const SERVICES = [
    { name: "Coupe homme",   pct: 34, value: Math.round(totals.clients * 0.34) },
    { name: "Coupe + barbe", pct: 28, value: Math.round(totals.clients * 0.28) },
    { name: "Barbe",         pct: 18, value: Math.round(totals.clients * 0.18) },
    { name: "Coloration",    pct: 12, value: Math.round(totals.clients * 0.12) },
    { name: "Autre",         pct: 8,  value: Math.round(totals.clients * 0.08) },
  ];

  const ACTIVITY = [
    { type: "served"    as const, ticket: "A-015", time: "Il y a 2 min" },
    { type: "joined"    as const, ticket: "A-016", time: "Il y a 4 min" },
    { type: "served"    as const, ticket: "A-014", time: "Il y a 7 min" },
    { type: "cancelled" as const, ticket: "A-013", time: "Il y a 12 min" },
    { type: "joined"    as const, ticket: "A-017", time: "Il y a 15 min" },
    { type: "served"    as const, ticket: "A-012", time: "Il y a 18 min" },
  ];

  const handleExport = async () => {
    setIsExporting(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsExporting(false);
    toast("Rapport exporté avec succès — PDF généré", "success");
  };

  return (
    <div className="bg-[#f5f8f6] min-h-svh">
      {/* Header */}
      <div
        ref={headerRef}
        className="sticky top-0 z-30 px-4 pt-safe-top pb-4 border-b border-white/10"
        style={{ background: "linear-gradient(135deg,#062e24 0%,#061819 100%)" }}
      >
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center"
          >
            <CaretLeft weight="bold" size={18} className="text-white" />
          </button>
          <div className="flex-1">
            <p className="text-white/60 text-xs font-semibold">ANALYTICS</p>
            <h1 className="text-xl font-black text-white leading-tight">Barber Club</h1>
          </div>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 h-9 px-4 rounded-full bg-white/10 text-white text-sm font-bold active:bg-white/20 transition-colors disabled:opacity-50"
          >
            {isExporting
              ? <span className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              : <DownloadSimple weight="bold" size={14} />}
            Export
          </button>
        </div>

        {/* Period picker */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1 p-1 bg-white/10 rounded-[12px]">
            {PERIODS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setPeriod(key)}
                className="relative h-7 px-3.5 rounded-[10px] text-xs font-bold transition-colors"
              >
                {period === key && (
                  <motion.span
                    layoutId="period-pill"
                    className="absolute inset-0 rounded-[10px] bg-white"
                    transition={{ type: "spring", stiffness: 420, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 ${period === key ? "text-ink" : "text-white/60"}`}>{label}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 h-9 px-3 rounded-full bg-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-tornoo-green animate-breathe" />
            <span className="text-xs font-bold text-white/80">En direct</span>
          </div>
        </div>
      </div>

      <div className="px-4 pb-24 pt-4 max-w-lg mx-auto space-y-4">
        {/* Hero metric */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-[24px] border border-line shadow-1 p-5"
        >
          <div className="flex items-start justify-between mb-1">
            <p className="section-eyebrow">Revenus · {PERIODS.find((p) => p.key === period)?.label}</p>
            <span className="flex items-center gap-1 text-xs font-bold text-tornoo-green">
              <TrendUp weight="fill" size={12} /> +22%
            </span>
          </div>
          <div className="flex items-end gap-3 mb-4">
            <AnimatedNumber
              value={Math.round(totals.revenue / 100) * 100}
              duration={1.6}
              delay={0.3}
              suffix=" DH"
              className="text-[40px] font-black text-ink leading-none tracking-[-0.02em] block"
            />
          </div>
          {revenueData.length >= 2 && <RevenueChart data={revenueData} />}
        </motion.div>

        {/* KPI grid */}
        <div className="grid grid-cols-2 gap-3">
          <KpiCard
            label="Clients servis"
            value={totals.clients}
            trend={18}
            trendLabel="vs sem. préc."
            color="#07984a"
            bg="#e4f6ec"
            border="#b6e6c9"
            sparkValues={clientValues}
            icon={Users}
            delay={0.1}
          />
          <KpiCard
            label="Attente moyenne"
            value={Math.round(totals.avgWait)}
            suffix=" min"
            trend={-5}
            trendLabel="min de moins"
            color="#2563eb"
            bg="#eff6ff"
            border="#dbeafe"
            sparkValues={stats.map((d) => d.avgWaitMinutes)}
            icon={Clock}
            delay={0.2}
          />
          <KpiCard
            label="Ticket moyen"
            value={totals.clients > 0 ? Math.round(totals.revenue / totals.clients) : 0}
            suffix=" DH"
            trend={8}
            trendLabel="vs sem. préc."
            color="#ff9300"
            bg="#fff1de"
            border="#ffd9a6"
            sparkValues={stats.map((d) => (d.revenue ?? 0) / Math.max(d.clientsServed, 1))}
            icon={CurrencyDollar}
            delay={0.3}
          />
          <KpiCard
            label="Note moyenne"
            value={4.8}
            decimals={1}
            suffix=" ★"
            trend={4}
            trendLabel="pts de plus"
            color="#f7c400"
            bg="#fffde0"
            border="#fde68a"
            icon={Star}
            delay={0.4}
          />
        </div>

        {/* Top services */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-[24px] border border-line shadow-1 p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="section-eyebrow mb-0.5">DISTRIBUTION</p>
              <h2 className="font-black text-ink leading-none">Services populaires</h2>
            </div>
            <span className="text-xs text-ink-3 bg-surface-2 border border-line rounded-full px-2.5 py-1 font-bold">
              {totals.clients} total
            </span>
          </div>
          <div className="space-y-4">
            {SERVICES.map((s, i) => (
              <ServiceBar key={s.name} name={s.name} pct={s.pct} value={s.value} rank={i} />
            ))}
          </div>
        </motion.div>

        {/* Activity feed */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-[24px] border border-line shadow-1 p-5"
        >
          <div className="flex items-center justify-between mb-1">
            <div>
              <p className="section-eyebrow mb-0.5">TEMPS RÉEL</p>
              <h2 className="font-black text-ink leading-none">Activité récente</h2>
            </div>
            <div className="flex items-center gap-1.5 h-7 px-3 rounded-full bg-low-bg border border-low-rim">
              <span className="w-1.5 h-1.5 rounded-full bg-tornoo-green animate-breathe" />
              <span className="text-xs font-bold text-tornoo-green">Live</span>
            </div>
          </div>
          <div className="divide-y divide-line">
            {ACTIVITY.map((a, i) => (
              <ActivityItem key={i} {...a} i={i} />
            ))}
          </div>
          <Link
            href="/pro/queues"
            className="mt-3 flex items-center justify-center gap-1 text-sm font-bold text-tornoo-green"
          >
            Gérer les files <ArrowRight weight="bold" size={14} />
          </Link>
        </motion.div>

        {/* Quick insights */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-5 rounded-[24px] border border-white/10"
          style={{ background: "linear-gradient(135deg,#062e24 0%,#061819 100%)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Lightning weight="fill" size={16} className="text-tornoo-green" />
            <p className="font-black text-white text-sm">Insights Tornoo</p>
          </div>
          <div className="space-y-2.5">
            {[
              "Pic d'activité détecté entre 12h-15h — augmentez la capacité",
              "Le service \"Coupe + barbe\" génère 28% des revenus",
              "Temps d'attente -5 min vs semaine dernière — excellent !",
            ].map((insight, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-tornoo-green mt-1.5 shrink-0" />
                <p className="text-sm text-white/75 leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
