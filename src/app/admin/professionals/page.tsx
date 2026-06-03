"use client";

import { useState } from "react";
import { MagnifyingGlass, CheckCircle, Clock, XCircle, DotsThree } from "@phosphor-icons/react";
import { MOCK_ESTABLISHMENTS } from "@/lib/mock-data";
import { useToast } from "@/components/ui/Toast";

const PROFESSIONALS = MOCK_ESTABLISHMENTS.map((e, i) => ({
  ...e,
  plan: ["Pro", "Starter", "Enterprise", "Free", "Pro"][i],
  status: i === 2 ? "pending" : i === 3 ? "inactive" : "active",
  servedMonth: [547, 312, 89, 421, 678][i],
}));

const statusConfig = {
  active: { label: "Actif", icon: CheckCircle, className: "bg-low-bg text-tornoo-green border-low-rim" },
  pending: { label: "En attente", icon: Clock, className: "bg-mod-bg text-tornoo-orange border-mod-rim" },
  inactive: { label: "Inactif", icon: XCircle, className: "bg-surface-2 text-ink-3 border-line" },
};

export default function AdminProfessionalsPage() {
  const { toast } = useToast();
  const [query, setQuery] = useState("");

  const filtered = PROFESSIONALS.filter(
    (p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="pt-safe-top flex items-center justify-between mb-6">
        <h1 className="text-3xl font-black text-ink">Professionnels</h1>
        <span className="px-3 py-1.5 bg-low-bg text-tornoo-green rounded-full text-sm font-bold border border-low-rim">
          {PROFESSIONALS.length} total
        </span>
      </div>

      <div className="flex items-center gap-3 bg-white rounded-[14px] px-4 h-12 border border-line shadow-1 mb-4">
        <MagnifyingGlass weight="bold" size={17} className="text-ink-3" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un établissement..."
          className="flex-1 bg-transparent text-sm font-medium text-ink outline-none placeholder:text-ink-3"
        />
      </div>

      <div className="bg-white rounded-[22px] border border-line shadow-1 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-2 border-b border-line">
              <tr>
                {["Établissement", "Catégorie", "Ville", "Plan", "Servis/mois", "Statut", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold text-ink-3 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((pro, i) => {
                const status = statusConfig[pro.status as keyof typeof statusConfig];
                const StatusIcon = status.icon;
                return (
                  <tr key={pro.id} className={i < filtered.length - 1 ? "border-b border-line" : ""}>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="font-bold text-ink">{pro.name}</div>
                        {pro.verified && <CheckCircle weight="fill" size={13} className="text-tornoo-green shrink-0" />}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-ink-2">{pro.category}</td>
                    <td className="px-4 py-3.5 text-sm text-ink-2">{pro.city}</td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-surface-2 text-ink-2 border border-line">{pro.plan}</span>
                    </td>
                    <td className="px-4 py-3.5 text-sm font-bold text-ink">{pro.servedMonth.toLocaleString()}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${status.className}`}>
                        <StatusIcon size={11} weight="fill" />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => toast(`Actions pour ${pro.name} disponibles prochainement`, "info")}
                        className="w-8 h-8 rounded-lg hover:bg-surface-2 flex items-center justify-center"
                        aria-label="Options"
                      >
                        <DotsThree weight="bold" size={16} className="text-ink-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
