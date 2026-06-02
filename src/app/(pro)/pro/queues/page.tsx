"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { MoreHorizontal } from "lucide-react";
import { TornooMark } from "@/components/tornoo/TornooLogo";
import { api } from "@/services/api";
import { MOCK_ESTABLISHMENTS } from "@/lib/mock-data";

export default function ProQueuesPage() {
  const e = MOCK_ESTABLISHMENTS[0];
  const { data: queues = [] } = useQuery({
    queryKey: ["queues", e.id],
    queryFn: () => api.queues.byEstablishment(e.id),
  });

  const stats = [
    { value: "10", label: "Tickets émis" },
    { value: "67", label: "Servis" },
    { value: String(queues.reduce((a, q) => a + q.waitingCount, 0)), label: "En attente" },
  ];

  return (
    <div className="min-h-svh">
      {/* Dark header */}
      <div className="bg-[#061819] px-5 pt-safe-top pb-8">
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3">
            <TornooMark size={38} />
            <div>
              <h1 className="text-xl font-black text-white">{e.name}</h1>
              <p className="text-xs text-white/60">{e.city}</p>
            </div>
          </div>
          <button className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center" aria-label="Options">
            <MoreHorizontal size={20} className="text-white" />
          </button>
        </div>

        <div className="mt-6">
          <p className="text-white font-black text-sm">Vue d'ensemble aujourd'hui</p>
          <div className="grid grid-cols-3 gap-3 mt-3">
            {stats.map(({ value, label }) => (
              <div key={label} className="p-3 rounded-2xl bg-white/10 text-center">
                <p className="text-2xl font-black text-white">{value}</p>
                <p className="text-xs text-white/60 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* White content */}
      <div className="bg-white rounded-t-[38px] -mt-4 px-5 py-6 min-h-[60vh]">
        <h2 className="text-2xl font-black text-ink mb-4">Files d'attente actives</h2>

        {queues.length === 0 ? (
          <div className="text-center py-10 text-ink-3">
            <p className="font-medium">Aucune file active</p>
          </div>
        ) : (
          <div className="space-y-4">
            {queues.map((q) => (
              <div key={q.id} className="bg-white rounded-[22px] border border-line shadow-1 p-5">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-grad-navy flex items-center justify-center shrink-0">
                    <span className="text-white font-black text-lg">{q.label}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-black text-ink">{q.serviceName}</h3>
                    <p className="text-sm text-ink-3">En cours · {q.waitingCount} personnes</p>
                    <p className="mt-3 text-xs font-bold text-ink-3 uppercase tracking-wide">Numéro en cours</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-2xl font-black text-tornoo-green">{q.currentTicket}</span>
                      <Link
                        href={`/pro/queues/${q.id}`}
                        className="h-11 px-4 rounded-[13px] bg-ink text-white font-bold text-sm flex items-center"
                      >
                        Gérer la file ›
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Link
          href="/pro/queues/new"
          className="mt-4 flex items-center justify-center h-14 rounded-[15px] border-2 border-dashed border-tornoo-green text-tornoo-green font-black w-full"
        >
          + Ouvrir une nouvelle file
        </Link>
      </div>
    </div>
  );
}
