"use client";

import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, SkipForward } from "lucide-react";

const QUEUE_CLIENTS = [
  { ticket: "A-043", name: "Client #1", status: "served", time: "09:12" },
  { ticket: "A-044", name: "Client #2", status: "served", time: "09:28" },
  { ticket: "A-045", name: "Client #3", status: "current", time: "09:45" },
  { ticket: "A-046", name: "Client #4", status: "waiting", time: "—" },
  { ticket: "A-047", name: "Client #5", status: "waiting", time: "—" },
];

export default function QueueDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  return (
    <div className="bg-surface-2 min-h-svh">
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm px-4 pt-safe-top pb-3 border-b border-line flex items-center gap-3">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center" aria-label="Retour">
          <ChevronLeft size={20} />
        </button>
        <h1 className="flex-1 text-xl font-black text-ink">Gestion file A</h1>
      </div>
      <div className="px-4 pt-4 pb-8 max-w-lg mx-auto space-y-4">
        {/* Current ticket */}
        <div className="bg-tornoo-green text-white rounded-[22px] p-5 text-center">
          <p className="text-sm font-bold opacity-80">Numéro en cours</p>
          <p className="text-5xl font-black mt-2">A-045</p>
          <button className="mt-4 flex items-center gap-2 mx-auto h-10 px-5 rounded-[12px] bg-white/20 font-bold text-sm">
            <SkipForward size={16} />
            Appeler le suivant
          </button>
        </div>

        {/* Client list */}
        <div className="bg-white rounded-[22px] border border-line shadow-1 overflow-hidden">
          {QUEUE_CLIENTS.map((c, i) => (
            <div
              key={c.ticket}
              className={`flex items-center gap-3 px-4 py-3.5 ${i < QUEUE_CLIENTS.length - 1 ? "border-b border-line" : ""} ${c.status === "current" ? "bg-low-bg" : ""}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                c.status === "served" ? "bg-surface-2 text-ink-3" :
                c.status === "current" ? "bg-tornoo-green text-white" :
                "bg-surface-2 text-ink-2"
              }`}>
                {c.ticket.split("-")[1]}
              </div>
              <div className="flex-1">
                <p className="font-bold text-ink text-sm">{c.ticket}</p>
                <p className="text-xs text-ink-3">{c.status === "served" ? "Servi" : c.status === "current" ? "En cours" : "En attente"}</p>
              </div>
              <span className="text-xs text-ink-3">{c.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
