"use client";

import { Download, FileText, BarChart2, Users, TrendingUp } from "lucide-react";
import { MOCK_DAILY_STATS } from "@/lib/mock-data";

const REPORT_TYPES = [
  { id: "usage", icon: BarChart2, label: "Rapport d'utilisation", desc: "Tickets, files, temps d'attente", color: "#07984a" },
  { id: "users", icon: Users, label: "Rapport utilisateurs", desc: "Inscription, activité, rétention", color: "#7c3aed" },
  { id: "revenue", icon: TrendingUp, label: "Rapport financier", desc: "Abonnements, revenus, conversion", color: "#ff9300" },
  { id: "logs", icon: FileText, label: "Logs système", desc: "Erreurs, événements, sécurité", color: "#5b6472" },
];

export default function AdminReportsPage() {
  const totals = MOCK_DAILY_STATS.reduce(
    (acc, d) => ({ clients: acc.clients + d.clientsServed, revenue: acc.revenue + (d.revenue ?? 0) }),
    { clients: 0, revenue: 0 }
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="pt-safe-top mb-6">
        <h1 className="text-3xl font-black text-ink">Rapports</h1>
        <p className="text-sm text-ink-3 mt-1">Exportez et analysez les données de la plateforme</p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Clients (7j)", value: totals.clients.toString() },
          { label: "Revenus (7j)", value: `${(totals.revenue / 1000).toFixed(1)}k DH` },
          { label: "Taux satisfaction", value: "94%" },
          { label: "Temps moyen", value: "19 min" },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-[18px] border border-line shadow-1 p-4 text-center">
            <p className="text-2xl font-black text-ink">{value}</p>
            <p className="text-xs text-ink-3 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Report types */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {REPORT_TYPES.map(({ id, icon: Icon, label, desc, color }) => (
          <div key={id} className="bg-white rounded-[22px] border border-line shadow-1 p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${color}18` }}>
              <Icon size={22} style={{ color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-ink">{label}</p>
              <p className="text-xs text-ink-3 mt-0.5">{desc}</p>
            </div>
            <button
              className="w-10 h-10 rounded-xl flex items-center justify-center border border-line hover:bg-surface-2 transition-colors shrink-0"
              aria-label={`Télécharger ${label}`}
            >
              <Download size={16} className="text-ink-2" />
            </button>
          </div>
        ))}
      </div>

      {/* Chart preview */}
      <div className="bg-white rounded-[22px] border border-line shadow-1 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-ink">Activité des 7 derniers jours</h2>
          <button className="flex items-center gap-2 h-9 px-4 rounded-xl bg-tornoo-green text-white text-sm font-bold">
            <Download size={14} />
            Exporter
          </button>
        </div>
        <div className="flex items-end gap-3 h-40">
          {MOCK_DAILY_STATS.map((d, i) => {
            const maxVal = Math.max(...MOCK_DAILY_STATS.map((s) => s.clientsServed));
            const h = (d.clientsServed / maxVal) * 100;
            const day = new Date(d.date).toLocaleDateString("fr", { weekday: "short" });
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex-1 flex items-end">
                  <div
                    className="w-full rounded-t-lg bg-tornoo-green"
                    style={{ height: `${h}%`, opacity: 0.7 + (i / MOCK_DAILY_STATS.length) * 0.3 }}
                  />
                </div>
                <span className="text-[10px] text-ink-3">{day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
