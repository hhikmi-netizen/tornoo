"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { CaretLeft, CaretDown, DownloadSimple } from "@phosphor-icons/react";
import { api } from "@/services/api";

export default function StatisticsPage() {
  const router = useRouter();
  const { data: stats = [], isLoading } = useQuery({
    queryKey: ["pro-stats"],
    queryFn: () => api.pro.stats(),
  });

  const totals = stats.reduce(
    (acc, d) => ({
      clients: acc.clients + d.clientsServed,
      revenue: acc.revenue + (d.revenue ?? 0),
      avgWait: acc.avgWait + d.avgWaitMinutes / stats.length,
    }),
    { clients: 0, revenue: 0, avgWait: 0 }
  );

  const maxClients = Math.max(...stats.map((d) => d.clientsServed), 1);

  const PEAK_HOURS = [
    { range: "09h - 12h", pct: 34, color: "#ff9300" },
    { range: "12h - 15h", pct: 48, color: "#ef2b24" },
    { range: "15h - 18h", pct: 12, color: "#f7c400" },
    { range: "18h - 21h", pct: 6, color: "#07984a" },
  ];

  return (
    <div className="bg-surface-2 min-h-svh">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm px-4 pt-safe-top pb-3 border-b border-line flex items-center gap-3">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center" aria-label="Retour">
          <CaretLeft weight="bold" size={20} />
        </button>
        <h1 className="flex-1 text-xl font-black text-ink">Statistiques</h1>
        <span className="text-ink-3">•••</span>
      </div>

      <div className="px-4 pb-28 max-w-lg mx-auto space-y-4 pt-4">
        {/* Period selector */}
        <button className="mx-auto flex items-center gap-2 px-5 h-10 rounded-full bg-white border border-line shadow-1 text-sm font-bold text-ink">
          7 derniers jours <CaretDown weight="bold" size={16} className="text-ink-3" />
        </button>

        {/* KPI cards */}
        {isLoading ? (
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-[18px] bg-white animate-pulse border border-line" />)}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-low-bg rounded-[18px] p-4 border border-low-rim">
              <p className="text-2xl font-black text-tornoo-green">{totals.clients}</p>
              <p className="text-xs text-tornoo-green/80 mt-0.5">Clients servis</p>
              <p className="text-xs font-bold text-tornoo-green mt-1">+18%</p>
            </div>
            <div className="bg-[#e6f0f2] rounded-[18px] p-4 border border-[#c2d8dd]">
              <p className="text-2xl font-black text-[#0a5c6b]">{Math.round(totals.avgWait)} min</p>
              <p className="text-xs text-[#0a5c6b]/70 mt-0.5">Attente moyenne</p>
              <p className="text-xs font-bold text-[#0a5c6b] mt-1">-5 min</p>
            </div>
            <div className="bg-mod-bg rounded-[18px] p-4 border border-mod-rim">
              <p className="text-2xl font-black text-tornoo-orange">{Math.round(totals.revenue / 1000)}k</p>
              <p className="text-xs text-tornoo-orange/80 mt-0.5">Revenus (DH)</p>
              <p className="text-xs font-bold text-tornoo-orange mt-1">+22%</p>
            </div>
          </div>
        )}

        {/* Bar chart */}
        <div className="bg-white rounded-[22px] border border-line shadow-1 p-5">
          <h2 className="font-black text-ink mb-4">Évolution des clients</h2>
          <div className="flex items-end gap-2 h-36">
            {stats.map((d, i) => {
              const barH = Math.max((d.clientsServed / maxClients) * 108, 6);
              const day = new Date(d.date).toLocaleDateString("fr", { weekday: "short" });
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <div
                    className="w-full rounded-t-lg bg-tornoo-green"
                    style={{ height: barH }}
                  />
                  <span className="text-[10px] text-ink-3">{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Line chart simplified */}
        <div className="bg-white rounded-[22px] border border-line shadow-1 p-5">
          <h2 className="font-black text-ink mb-4">Tendance hebdomadaire</h2>
          <svg viewBox="0 0 320 100" className="w-full h-24">
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#07984a" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#07984a" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M20 80 L65 48 L105 60 L150 30 L190 65 L235 20 L280 40 L310 15"
              fill="none"
              stroke="#07984a"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20 80 L65 48 L105 60 L150 30 L190 65 L235 20 L280 40 L310 15 L310 95 L20 95Z"
              fill="url(#areaGrad)"
            />
          </svg>
        </div>

        {/* Peak hours */}
        <div className="bg-white rounded-[22px] border border-line shadow-1 p-5">
          <h2 className="font-black text-ink mb-4">Heures de pointe</h2>
          <div className="space-y-3">
            {PEAK_HOURS.map((p) => (
              <div key={p.range} className="flex items-center gap-3">
                <span className="w-20 text-sm font-medium text-ink-2 shrink-0">{p.range}</span>
                <div className="flex-1 h-2.5 bg-surface-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${p.pct}%`, background: p.color }}
                  />
                </div>
                <span className="text-sm font-bold text-ink w-8 text-right">{p.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Export */}
        <button className="w-full flex items-center justify-center gap-2 h-14 rounded-[15px] bg-tornoo-green text-white font-extrabold">
          <DownloadSimple weight="bold" size={18} />
          Exporter le rapport
        </button>
      </div>
    </div>
  );
}
