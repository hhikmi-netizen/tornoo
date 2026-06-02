"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { MOCK_ESTABLISHMENTS } from "@/lib/mock-data";

export default function NewQueuePage() {
  const router = useRouter();
  const services = MOCK_ESTABLISHMENTS[0].services;

  return (
    <div className="bg-surface-2 min-h-svh">
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm px-4 pt-safe-top pb-3 border-b border-line flex items-center gap-3">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center" aria-label="Retour">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-xl font-black text-ink">Nouveau ticket</h1>
      </div>
      <div className="px-4 pt-4 pb-8 max-w-lg mx-auto space-y-4">
        <p className="text-sm text-ink-3">Sélectionnez un service pour émettre un ticket</p>
        <div className="space-y-2">
          {services.map((s) => (
            <button
              key={s.id}
              onClick={() => router.push("/pro/queues")}
              className="w-full flex items-center justify-between bg-white rounded-[18px] px-4 py-4 border border-line shadow-1 text-left"
            >
              <div>
                <p className="font-bold text-ink">{s.name}</p>
                <p className="text-xs text-ink-3">{s.durationMinutes} min{s.price ? ` · ${s.price} ${s.currency}` : ""}</p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-tornoo-green flex items-center justify-center">
                <ChevronLeft size={16} className="text-white rotate-180" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
