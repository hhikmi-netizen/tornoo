"use client";

import { useRouter } from "next/navigation";
import { CaretLeft, Plus, Clock, PencilSimple, Trash } from "@phosphor-icons/react";
import { MOCK_ESTABLISHMENTS } from "@/lib/mock-data";

export default function ProServicesPage() {
  const router = useRouter();
  const services = MOCK_ESTABLISHMENTS[0].services;

  return (
    <div className="bg-surface-2 min-h-svh">
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm px-4 pt-safe-top pb-3 border-b border-line flex items-center gap-3">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center" aria-label="Retour">
          <CaretLeft weight="bold" size={20} />
        </button>
        <h1 className="flex-1 text-xl font-black text-ink">Services</h1>
        <button className="w-10 h-10 rounded-full bg-tornoo-green flex items-center justify-center" aria-label="Ajouter un service">
          <Plus weight="bold" size={20} className="text-white" />
        </button>
      </div>

      <div className="px-4 pt-4 pb-8 max-w-lg mx-auto">
        <div className="bg-white rounded-[22px] border border-line shadow-1 overflow-hidden">
          {services.map((s, idx) => (
            <div
              key={s.id}
              className={`flex items-center gap-3 px-4 py-4 ${idx < services.length - 1 ? "border-b border-line" : ""}`}
            >
              <div className="w-10 h-10 rounded-xl bg-low-bg flex items-center justify-center shrink-0">
                <Clock weight="duotone" size={18} className="text-tornoo-green" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-ink">{s.name}</p>
                <p className="text-xs text-ink-3">{s.durationMinutes} min{s.price ? ` · ${s.price} ${s.currency}` : ""}</p>
              </div>
              <div className="flex gap-2">
                <button className="w-9 h-9 rounded-xl bg-surface-2 flex items-center justify-center border border-line" aria-label="Modifier">
                  <PencilSimple weight="bold" size={15} className="text-ink-2" />
                </button>
                <button className="w-9 h-9 rounded-xl bg-[#fde7e6] flex items-center justify-center border border-[#f6c2bf]" aria-label="Supprimer">
                  <Trash weight="bold" size={15} className="text-[#ef2b24]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
