"use client";
import { SpeakerHigh } from "@phosphor-icons/react";
import type { QueueClient } from "@/types/queue";

interface WaitingClientRowProps {
  client: QueueClient;
  onCall: (id: string) => void;
  onCancel: (id: string) => void;
}

function positionColors(position: number): { bg: string; text: string } {
  if (position <= 6) return { bg: "#E8F5E9", text: "#2E7D32" };
  if (position <= 9) return { bg: "#FFF8E1", text: "#F57F17" };
  return { bg: "#FCE4EC", text: "#C62828" };
}

export function WaitingClientRow({ client, onCall, onCancel }: WaitingClientRowProps) {
  const colors = positionColors(client.position);

  return (
    <div className="flex items-center gap-3 py-3 px-4">
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-black text-sm"
        style={{ backgroundColor: colors.bg, color: colors.text }}
      >
        #{client.position}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-gray-900 truncate">{client.name}</p>
        <p className="text-xs text-gray-500 truncate">{client.phone}</p>
      </div>
      <div className="shrink-0 text-right mr-3">
        <p className="text-[10px] text-gray-400 uppercase tracking-wide">Attente</p>
        <p className="text-sm font-bold text-gray-700">{client.estimatedWaitMinutes} min</p>
      </div>
      <button
        onClick={() => onCall(client.id)}
        className="shrink-0 h-8 px-3 rounded-lg border border-[#009B5A] text-[#009B5A] text-xs font-bold hover:bg-[#F0FAF4] transition-colors"
      >
        <SpeakerHigh size={13} weight="duotone" className="inline mr-1" />
        Appeler
      </button>
    </div>
  );
}
