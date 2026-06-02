"use client";

import Link from "next/link";
import { Bell, Settings, BarChart2, Users, ChevronRight, Plus } from "lucide-react";
import { TornooMark } from "@/components/tornoo/TornooLogo";
import { WaitBadge, WaitDot } from "@/components/tornoo/WaitBadge";
import { MOCK_ESTABLISHMENTS, MOCK_QUEUES } from "@/lib/mock-data";

export default function ProDashboardPage() {
  const e = MOCK_ESTABLISHMENTS[0];
  const queues = MOCK_QUEUES.filter((q) => q.establishmentId === e.id);

  const SERVICES = [
    { label: "A", name: "État civil", count: 7 },
    { label: "B", name: "Légalisation", count: 5 },
    { label: "C", name: "Autre service", count: 3 },
  ];

  return (
    <div className="min-h-svh">
      {/* Navy header */}
      <div className="bg-grad-navy px-5 pt-safe-top pb-24 rounded-b-[38px]">
        <div className="flex items-center justify-between mt-2">
          <div>
            <p className="text-white/60 text-sm">Bonjour,</p>
            <h1 className="text-3xl font-black text-white leading-tight">Admin</h1>
            <Link href="/pro/profile" className="flex items-center gap-1 text-tornoo-green text-sm font-bold mt-0.5">
              Tornoo Business <ChevronRight size={14} />
            </Link>
          </div>
          <div className="flex gap-2">
            <Link href="/notifications" className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center" aria-label="Notifications">
              <Bell size={20} className="text-white" />
            </Link>
            <Link href="/pro/profile" className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center" aria-label="Paramètres">
              <Settings size={20} className="text-white" />
            </Link>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-16 pb-6 space-y-4">
        {/* Main card */}
        <div className="bg-white rounded-[22px] border border-line shadow-pop p-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-black text-ink">{e.name}</h2>
              <p className="text-sm text-ink-3">{e.city}</p>
            </div>
            <div className="flex items-center gap-1 text-[#F7C400] font-bold text-sm">
              <span>★</span>
              <span>{e.rating}</span>
            </div>
          </div>

          <div className="flex gap-2 mt-3">
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-low-bg text-tornoo-green rounded-full text-xs font-bold border border-low-rim">
              <WaitDot level="low" size={7} />
              Établissement ouvert
            </span>
            <Link href="/pro/profile" className="px-3 py-1.5 rounded-xl border border-line text-xs font-bold text-ink-2">
              Voir profil
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <Link href="/pro/statistics" className="bg-surface-2 rounded-[18px] p-4 border border-line">
              <BarChart2 size={22} className="text-tornoo-green" />
              <p className="font-black text-ink mt-2">Statistiques</p>
              <p className="text-xs text-ink-3">Aujourd'hui</p>
            </Link>
            <Link href="/pro/queues" className="bg-surface-2 rounded-[18px] p-4 border border-line">
              <Users size={22} className="text-tornoo-green" />
              <p className="font-black text-ink mt-2">File d'attente</p>
              <p className="text-xs text-ink-3">En temps réel</p>
            </Link>
          </div>
        </div>

        {/* Today stats */}
        <div className="bg-white rounded-[22px] border border-line shadow-1 p-5">
          <h3 className="font-black text-ink mb-3">Vue d'ensemble aujourd'hui</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "10", label: "Tickets émis" },
              { value: "67", label: "Servis" },
              { value: "2", label: "En attente" },
            ].map(({ value, label }) => (
              <div key={label} className="bg-surface-2 rounded-[16px] p-3 text-center border border-line">
                <p className="text-2xl font-black text-ink">{value}</p>
                <p className="text-xs text-ink-3 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Services / queues */}
        <div className="bg-white rounded-[22px] border border-line shadow-1 p-5">
          <h3 className="font-black text-ink mb-3">Quel service ?</h3>
          <div className="space-y-2">
            {SERVICES.map((s, i) => (
              <div
                key={s.label}
                className={`flex items-center justify-between p-3.5 rounded-[16px] border ${
                  i === 0 ? "border-tornoo-green bg-low-bg" : "border-line"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-grad-navy flex items-center justify-center">
                    <span className="text-white font-black text-sm">{s.label}</span>
                  </div>
                  <span className="font-bold text-ink">{s.name}</span>
                </div>
                <span className="text-sm text-ink-3">{s.count} personnes</span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between bg-low-bg rounded-[14px] px-4 py-3 border border-low-rim">
            <span className="font-bold text-sm text-ink">Temps d'attente estimé</span>
            <WaitBadge minutes={28} size="sm" />
          </div>

          <Link
            href="/pro/queues/new"
            className="mt-3 flex items-center justify-center gap-2 h-14 rounded-[15px] bg-tornoo-green text-white font-extrabold w-full"
          >
            <Plus size={20} />
            Prendre un ticket
          </Link>
        </div>
      </div>
    </div>
  );
}
