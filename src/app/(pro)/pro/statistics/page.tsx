"use client";

import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { CaretLeft, CaretDown, DownloadSimple } from "@phosphor-icons/react";
import { api } from "@/services/api";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { useI18n } from "@/i18n/context";

const PEAK_HOURS = [
  { range: "09h - 12h", pct: 34, color: "#ff9300" },
  { range: "12h - 15h", pct: 48, color: "#ef2b24" },
  { range: "15h - 18h", pct: 12, color: "#f7c400" },
  { range: "18h - 21h", pct: 6,  color: "#07984a" },
];

export default function StatisticsPage() {
  const router  = useRouter();
  const { t }   = useI18n();

  const barsRef      = useRef<HTMLDivElement>(null);
  const linePathRef  = useRef<SVGPathElement>(null);
  const areaPathRef  = useRef<SVGPathElement>(null);
  const peakRef      = useRef<HTMLDivElement>(null);
  const kpiRef       = useRef<HTMLDivElement>(null);

  const { data: stats = [], isLoading } = useQuery({
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

  const maxClients = Math.max(...stats.map((d) => d.clientsServed), 1);

  /* ── KPI card entrance ─────────────────────────── */
  useEffect(() => {
    if (isLoading || !kpiRef.current) return;
    gsap.from(kpiRef.current.children, {
      opacity: 0,
      y: 18,
      scale: 0.96,
      stagger: 0.08,
      duration: 0.55,
      ease: "back.out(1.4)",
    });
  }, [isLoading]);

  /* ── Bar chart grow from bottom ─────────────────── */
  useEffect(() => {
    if (!barsRef.current || stats.length === 0) return;
    const bars = barsRef.current.querySelectorAll<HTMLElement>(".stat-bar");
    gsap.from(bars, {
      scaleY: 0,
      transformOrigin: "bottom center",
      duration: 0.65,
      stagger: 0.07,
      ease: "back.out(1.6)",
      scrollTrigger: {
        trigger: barsRef.current,
        start: "top 85%",
        once: true,
      },
    });
  }, [stats]);

  /* ── SVG line draw + area fade ───────────────────── */
  useEffect(() => {
    const line = linePathRef.current;
    const area = areaPathRef.current;
    if (!line || !area) return;
    const len = line.getTotalLength();
    gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
    gsap.set(area, { opacity: 0 });
    gsap.to(line, {
      strokeDashoffset: 0,
      duration: 1.5,
      ease: "power2.inOut",
      scrollTrigger: { trigger: line, start: "top 85%", once: true },
    });
    gsap.to(area, {
      opacity: 1,
      duration: 0.8,
      delay: 0.7,
      ease: "power1.in",
      scrollTrigger: { trigger: area, start: "top 85%", once: true },
    });
  }, []);

  /* ── Peak hours bars fill from left ─────────────── */
  useEffect(() => {
    if (!peakRef.current) return;
    const bars = peakRef.current.querySelectorAll<HTMLElement>(".peak-bar-fill");
    gsap.from(bars, {
      scaleX: 0,
      transformOrigin: "left center",
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: peakRef.current,
        start: "top 85%",
        once: true,
      },
    });
  }, []);

  return (
    <div className="bg-surface-2 min-h-svh">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm px-4 pt-safe-top pb-3 border-b border-line flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center"
          aria-label={t.back}
        >
          <CaretLeft weight="bold" size={20} />
        </button>
        <h1 className="flex-1 text-xl font-black text-ink">{t.statsTitle}</h1>
        <span className="text-ink-3">•••</span>
      </div>

      <div className="px-4 pb-28 max-w-lg mx-auto space-y-4 pt-4">
        {/* Period selector */}
        <button className="mx-auto flex items-center gap-2 px-5 h-10 rounded-full bg-white border border-line shadow-1 text-sm font-bold text-ink active:scale-[0.97] transition-transform">
          {t.last7Days} <CaretDown weight="bold" size={16} className="text-ink-3" />
        </button>

        {/* KPI cards */}
        {isLoading ? (
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-[18px] bg-white animate-pulse border border-line" />
            ))}
          </div>
        ) : (
          <div ref={kpiRef} className="grid grid-cols-3 gap-3">
            <div className="bg-low-bg rounded-[18px] p-4 border border-low-rim">
              <AnimatedNumber
                value={totals.clients}
                duration={1.2}
                delay={0.1}
                className="text-2xl font-black text-tornoo-green block"
              />
              <p className="text-xs text-tornoo-green/80 mt-0.5">{t.clientsServed}</p>
              <p className="text-xs font-bold text-tornoo-green mt-1">+18%</p>
            </div>
            <div className="bg-[#e6f0f2] rounded-[18px] p-4 border border-[#c2d8dd]">
              <AnimatedNumber
                value={Math.round(totals.avgWait)}
                duration={1.2}
                delay={0.2}
                suffix=" min"
                className="text-2xl font-black text-[#0a5c6b] block"
              />
              <p className="text-xs text-[#0a5c6b]/70 mt-0.5">{t.avgWait}</p>
              <p className="text-xs font-bold text-[#0a5c6b] mt-1">-5 min</p>
            </div>
            <div className="bg-mod-bg rounded-[18px] p-4 border border-mod-rim">
              <AnimatedNumber
                value={Math.round(totals.revenue / 1000)}
                duration={1.4}
                delay={0.3}
                suffix="k"
                className="text-2xl font-black text-tornoo-orange block"
              />
              <p className="text-xs text-tornoo-orange/80 mt-0.5">{t.revenue}</p>
              <p className="text-xs font-bold text-tornoo-orange mt-1">+22%</p>
            </div>
          </div>
        )}

        {/* Bar chart */}
        <div className="bg-white rounded-[22px] border border-line shadow-1 p-5">
          <h2 className="font-black text-ink mb-4">{t.clientEvolution}</h2>
          <div ref={barsRef} className="flex items-end gap-2 h-36">
            {stats.map((d, i) => {
              const barH = Math.max((d.clientsServed / maxClients) * 108, 6);
              const day  = new Date(d.date).toLocaleDateString("fr", { weekday: "short" });
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <div
                    className="stat-bar w-full rounded-t-lg"
                    style={{
                      height: barH,
                      background: i === stats.length - 1
                        ? "#07984a"
                        : `hsl(152, 90%, ${30 + (i / stats.length) * 20}%)`,
                    }}
                  />
                  <span className="text-[10px] text-ink-3">{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Line chart */}
        <div className="bg-white rounded-[22px] border border-line shadow-1 p-5">
          <h2 className="font-black text-ink mb-4">Tendance hebdomadaire</h2>
          <svg viewBox="0 0 320 100" className="w-full h-24">
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#07984a" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#07984a" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              ref={areaPathRef}
              d="M20 80 L65 48 L105 60 L150 30 L190 65 L235 20 L280 40 L310 15 L310 95 L20 95Z"
              fill="url(#areaGrad)"
            />
            <path
              ref={linePathRef}
              d="M20 80 L65 48 L105 60 L150 30 L190 65 L235 20 L280 40 L310 15"
              fill="none"
              stroke="#07984a"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Dot on last point */}
            <circle cx="310" cy="15" r="4" fill="#07984a" />
            <circle cx="310" cy="15" r="7" fill="#07984a" opacity="0.2" />
          </svg>
        </div>

        {/* Peak hours */}
        <div ref={peakRef} className="bg-white rounded-[22px] border border-line shadow-1 p-5">
          <h2 className="font-black text-ink mb-4">{t.peakHours}</h2>
          <div className="space-y-3">
            {PEAK_HOURS.map((p) => (
              <div key={p.range} className="flex items-center gap-3">
                <span className="w-20 text-sm font-medium text-ink-2 shrink-0">{p.range}</span>
                <div className="flex-1 h-2.5 bg-surface-2 rounded-full overflow-hidden">
                  <div
                    className="peak-bar-fill h-full rounded-full"
                    style={{ width: `${p.pct}%`, background: p.color }}
                  />
                </div>
                <AnimatedNumber
                  value={p.pct}
                  duration={0.9}
                  suffix="%"
                  className="text-sm font-bold text-ink w-8 text-right block"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Export */}
        <button className="w-full flex items-center justify-center gap-2 h-14 rounded-[15px] bg-tornoo-green text-white font-extrabold active:scale-[0.98] transition-transform">
          <DownloadSimple weight="bold" size={18} />
          {t.exportReport}
        </button>
      </div>
    </div>
  );
}
