"use client";
import Link from "next/link";
import { CaretRight } from "@phosphor-icons/react";
import type { QueueDailyStats } from "@/types/queue";

interface QueueStatsPanelProps {
  stats: QueueDailyStats;
}

function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h} h ${String(m).padStart(2, "0")}` : `${h} h`;
}

export function QueueStatsPanel({ stats }: QueueStatsPanelProps) {
  const rows = [
    { label: "Clients servis", value: String(stats.servedClients) },
    { label: "Clients annulés", value: String(stats.cancelledClients) },
    { label: "Temps d'attente moyen", value: formatMinutes(stats.averageWaitMinutes) },
    { label: "Délai maximum", value: formatMinutes(stats.maxWaitMinutes) },
  ];

  return (
    <div>
      <h2 className="font-bold text-base text-gray-900 mb-3">Statistiques du jour</h2>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {rows.map((row, i) => (
          <div key={row.label}>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-gray-600">{row.label}</span>
              <span className="font-bold text-sm text-gray-900">{row.value}</span>
            </div>
            {i < rows.length - 1 && <div className="h-px bg-gray-100 mx-4" />}
          </div>
        ))}
        <div className="h-px bg-gray-100" />
        <Link
          href="/pro/analytics"
          className="flex items-center justify-between px-4 py-3 text-[#009B5A] font-bold text-sm hover:bg-gray-50 transition-colors"
        >
          Voir les statistiques
          <CaretRight size={16} weight="bold" />
        </Link>
      </div>
    </div>
  );
}
