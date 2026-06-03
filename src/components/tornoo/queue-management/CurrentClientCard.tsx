"use client";
import { Clock, SpeakerHigh } from "@phosphor-icons/react";
import type { QueueClient } from "@/types/queue";

interface CurrentClientCardProps {
  client: QueueClient | undefined;
  onCallNext: () => void;
  isLoading: boolean;
}

export function CurrentClientCard({ client, onCallNext, isLoading }: CurrentClientCardProps) {
  return (
    <div>
      <h2 className="font-bold text-base text-gray-900 mb-3">Client actuel</h2>
      {!client ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <p className="text-gray-400 font-medium">Aucun client en cours</p>
        </div>
      ) : (
        <div className="bg-[#F0FAF4] rounded-2xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#009B5A] flex items-center justify-center shrink-0">
              <span className="text-white font-black text-xl">#{client.position}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-xl text-gray-900">{client.name}</p>
              <p className="text-sm text-gray-500">{client.phone}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#009B5A] text-white text-xs font-bold">
                  En cours
                </span>
                <span className="text-xs text-gray-400">Arrivé à {client.joinedAt}</span>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-xs text-gray-500 mb-1">Temps passé</p>
              <div className="flex items-center gap-1 justify-end mb-3">
                <Clock size={14} weight="duotone" className="text-[#009B5A]" />
                <span className="text-sm font-bold text-gray-700">12 min</span>
              </div>
              <button
                onClick={onCallNext}
                disabled={isLoading}
                className="flex items-center gap-2 h-9 px-4 rounded-lg bg-[#009B5A] text-white text-sm font-bold disabled:opacity-50 transition-opacity hover:bg-[#007a47]"
              >
                <SpeakerHigh size={15} weight="duotone" />
                Appeler suivant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
