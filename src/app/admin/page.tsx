"use client";

import { Users, Building2, ListIcon, Ticket, TrendingUp, TrendingDown } from "lucide-react";

const KPI = [
  { label: "Utilisateurs totaux", value: "12 847", change: "+8.2%", up: true, icon: Users, color: "#07984a" },
  { label: "Professionnels", value: "1 203", change: "+4.1%", up: true, icon: Building2, color: "#7c3aed" },
  { label: "Files actives", value: "847", change: "-2.3%", up: false, icon: ListIcon, color: "#ff9300" },
  { label: "Tickets aujourd'hui", value: "4 291", change: "+12.5%", up: true, icon: Ticket, color: "#ef2b24" },
];

const RECENT_PROS = [
  { name: "Barber Club", category: "Coiffure", city: "Casablanca", plan: "Pro", status: "active" },
  { name: "Spa Marina", category: "Bien-être", city: "Rabat", plan: "Starter", status: "active" },
  { name: "Clinique Atlas", category: "Santé", city: "Casablanca", plan: "Enterprise", status: "pending" },
  { name: "Pharmacie Centre", category: "Pharmacie", city: "Marrakech", plan: "Free", status: "active" },
];

export default function AdminPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="pt-safe-top">
        <h1 className="text-3xl font-black text-ink mb-6">Tableau de bord</h1>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {KPI.map(({ label, value, change, up, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-[22px] border border-line shadow-1 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
                <Icon size={20} style={{ color }} />
              </div>
              <span className={`flex items-center gap-1 text-xs font-bold ${up ? "text-tornoo-green" : "text-tornoo-red"}`}>
                {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {change}
              </span>
            </div>
            <p className="text-2xl font-black text-ink">{value}</p>
            <p className="text-xs text-ink-3 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent professionals */}
      <div className="bg-white rounded-[22px] border border-line shadow-1 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-line">
          <h2 className="text-xl font-black text-ink">Professionnels récents</h2>
          <span className="text-sm font-bold text-tornoo-green">Voir tout</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-2 border-b border-line">
              <tr>
                {["Établissement", "Catégorie", "Ville", "Plan", "Statut"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold text-ink-3 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_PROS.map((pro, i) => (
                <tr key={pro.name} className={i < RECENT_PROS.length - 1 ? "border-b border-line" : ""}>
                  <td className="px-4 py-3.5 font-bold text-ink">{pro.name}</td>
                  <td className="px-4 py-3.5 text-sm text-ink-2">{pro.category}</td>
                  <td className="px-4 py-3.5 text-sm text-ink-2">{pro.city}</td>
                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-surface-2 text-ink-2 border border-line">{pro.plan}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      pro.status === "active"
                        ? "bg-low-bg text-tornoo-green border border-low-rim"
                        : "bg-mod-bg text-tornoo-orange border border-mod-rim"
                    }`}>
                      {pro.status === "active" ? "Actif" : "En attente"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
