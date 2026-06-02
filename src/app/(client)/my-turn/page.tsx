"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, Share2, Bell, Phone, CheckCircle } from "lucide-react";
import { api } from "@/services/api";
import { MOCK_ESTABLISHMENTS } from "@/lib/mock-data";
import { WaitDot } from "@/components/tornoo/WaitBadge";

const TIMELINE_ROWS = [
  { label: "Client en cours", sub: "En service", highlight: false, done: true },
  { label: "Client suivant", sub: "En attente", highlight: false, done: false },
  { label: "Vous", sub: "Position #3", badge: "~ 7 min", highlight: true, done: false },
  { label: "Client suivant", sub: "En attente", highlight: false, done: false },
];

export default function MyTurnPage() {
  const router = useRouter();
  const { data: ticket } = useQuery({
    queryKey: ["ticket", "active"],
    queryFn: () => api.tickets.active(),
  });

  const cancelMutation = useMutation({
    mutationFn: () => api.tickets.cancel(ticket?.id ?? ""),
    onSuccess: () => router.replace("/home"),
  });

  const establishment = MOCK_ESTABLISHMENTS[0];

  return (
    <div className="bg-white min-h-svh">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm px-4 pt-safe-top pb-3 border-b border-line flex items-center gap-3">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center" aria-label="Retour">
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1 text-center">
          <h1 className="font-black text-base text-ink">Tornoo</h1>
          <div className="flex items-center justify-center gap-1.5 text-xs text-ink-3">
            <WaitDot level="low" size={7} />
            <span>Position en temps réel</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center" aria-label="Partager">
            <Share2 size={17} className="text-ink-2" />
          </button>
          <button className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center" aria-label="Notifications">
            <Bell size={17} className="text-ink-2" />
          </button>
        </div>
      </div>

      <div className="px-4 pb-8 max-w-lg mx-auto space-y-4 pt-4">
        {/* Position ring */}
        <div className="flex justify-center py-4">
          <div className="relative w-56 h-56">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#eaedf0" strokeWidth="14" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="#07984a" strokeWidth="14" strokeLinecap="round" strokeDasharray="160 264" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="#ff9300" strokeWidth="14" strokeLinecap="round" strokeDasharray="60 264" strokeDashoffset="-160" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="text-sm text-ink-3 font-medium">Votre position</p>
              <span className="text-6xl font-black text-ink leading-none">#3</span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="bg-white rounded-[22px] border border-line shadow-1 grid grid-cols-2 divide-x divide-line">
          <div className="p-4">
            <p className="text-xs text-ink-3 font-medium">Attente estimée</p>
            <p className="text-3xl font-black text-tornoo-green mt-1">7 min</p>
            <p className="text-xs text-ink-3 mt-1">Avant votre passage</p>
          </div>
          <div className="p-4">
            <p className="text-xs text-ink-3 font-medium">Heure prévue</p>
            <p className="text-3xl font-black text-ink mt-1">14h32</p>
            <p className="text-xs text-ink-3 mt-1">Aujourd'hui</p>
          </div>
        </div>

        {/* Establishment card */}
        <div className="bg-white rounded-[22px] border border-line shadow-1 flex items-center gap-3 p-3">
          <div className="w-20 h-18 rounded-2xl overflow-hidden shrink-0">
            <Image src={establishment.imageUrl} alt={establishment.name} width={80} height={72} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-black text-lg text-ink truncate">{establishment.name}</h2>
            <p className="text-sm text-ink-3">{establishment.category}</p>
            <p className="text-xs text-ink-3">{establishment.city}</p>
          </div>
          <a href={`tel:${establishment.phone}`} className="w-12 h-12 rounded-full bg-low-bg flex items-center justify-center shrink-0" aria-label="Appeler">
            <Phone size={20} className="text-tornoo-green" />
          </a>
        </div>

        {/* Queue timeline */}
        <div className="bg-white rounded-[22px] border border-line shadow-1 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-ink">File d'attente</h3>
            <p className="text-xs text-ink-3">Mise à jour : il y a 1 min</p>
          </div>
          <div className="space-y-3">
            {TIMELINE_ROWS.map((row, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 p-3 rounded-2xl ${row.highlight ? "bg-low-bg" : ""}`}
              >
                <span
                  className="w-4 h-4 rounded-full shrink-0"
                  style={{
                    background: row.done || row.highlight ? "#07984a" : "transparent",
                    border: row.done || row.highlight ? "none" : "1.5px solid #c7cdd6",
                  }}
                />
                <div className="flex-1">
                  <b className={row.highlight ? "text-tornoo-green" : "text-ink"}>{row.label}</b>
                  <p className="text-xs text-ink-3">{row.sub}</p>
                </div>
                {row.badge && (
                  <span className="px-3 py-1 rounded-full bg-low-bg text-tornoo-green text-sm font-bold">
                    {row.badge}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Alert options */}
        <div className="bg-white rounded-[22px] border border-line shadow-1 p-4">
          <h3 className="font-black text-ink">Prévenez-moi</h3>
          <p className="text-sm text-ink-3 mt-0.5">Recevoir une alerte selon l'avancement</p>
          <div className="grid grid-cols-4 gap-2 mt-3">
            {["15 min", "10 min", "5 min", "Mon tour"].map((label, i) => (
              <button
                key={label}
                className={`h-11 rounded-xl text-sm font-bold transition-colors ${
                  i === 2
                    ? "border-2 border-tornoo-green text-tornoo-green bg-low-bg"
                    : "border border-line text-ink-2"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Action grid */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Je suis en route", color: "#07984a" },
            { label: "Je suis arrivé", color: "#07984a", icon: CheckCircle },
            { label: "Retarder mon passage", color: "#ff9300" },
            { label: "Quitter la file", color: "#ef2b24", danger: true },
          ].map(({ label, danger }) => (
            <button
              key={label}
              onClick={danger ? () => cancelMutation.mutate() : undefined}
              className={`min-h-[72px] rounded-[18px] p-3 flex items-center justify-center text-sm font-bold text-center leading-tight border transition-colors ${
                danger ? "bg-[#fde7e6] text-[#ef2b24] border-[#f6c2bf]" : "bg-surface-2 text-ink-2 border-line"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tornoo tip */}
        <div className="p-5 rounded-[22px] bg-grad-navy text-white">
          <p className="font-black text-tornoo-green text-sm">Conseil Tornoo</p>
          <p className="text-sm mt-1 text-white/80 leading-relaxed">
            Profitez de votre temps libre, nous vous préviendrons avant votre tour.
          </p>
        </div>
      </div>
    </div>
  );
}
