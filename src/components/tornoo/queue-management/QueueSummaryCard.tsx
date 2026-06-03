"use client";
import { Clock, Users } from "@phosphor-icons/react";
import type { ProQueue } from "@/types/queue";

interface QueueSummaryCardProps {
  queue: ProQueue;
  onSuspend: () => void;
  onResume: () => void;
}

export function QueueSummaryCard({ queue, onSuspend, onResume }: QueueSummaryCardProps) {
  const borderColor = queue.status === "active" ? "#009B5A" : queue.status === "paused" ? "#FF9800" : "#EF2B24";

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
      style={{ borderLeft: `4px solid ${borderColor}` }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: borderColor, boxShadow: queue.status === "active" ? `0 0 6px ${borderColor}` : undefined }}
        />
        <span className="text-sm text-gray-500">File active</span>
        <span className="font-bold text-gray-900 ml-1">{queue.name}</span>
      </div>

      <div className="flex items-center gap-0">
        <div className="flex-1 flex items-center gap-3 pr-4">
          <Clock size={20} weight="duotone" className="text-[#009B5A] shrink-0" />
          <div>
            <p className="text-[11px] text-gray-500 uppercase tracking-wide font-medium">Temps d&apos;attente moyen</p>
            <p className="text-2xl font-black text-[#009B5A]">{queue.averageWaitMinutes} min</p>
          </div>
        </div>
        <div className="w-px h-12 bg-gray-200" />
        <div className="flex-1 flex items-center gap-3 px-4">
          <Users size={20} weight="duotone" className="text-[#009B5A] shrink-0" />
          <div>
            <p className="text-[11px] text-gray-500 uppercase tracking-wide font-medium">Clients en attente</p>
            <p className="text-2xl font-black text-[#009B5A]">{queue.waitingCount}</p>
          </div>
        </div>
        <div className="w-px h-12 bg-gray-200" />
        <div className="pl-4">
          {queue.status === "active" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#009B5A] text-[#009B5A] text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#009B5A]" />
              File active
            </span>
          )}
          {queue.status === "paused" && (
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#FF9800] text-[#FF9800] text-xs font-bold">
                ⏸ File suspendue
              </span>
              <p className="text-[10px] text-gray-400 mt-1 text-center">Depuis 14:32</p>
            </div>
          )}
          {queue.status === "closed" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#EF2B24] text-[#EF2B24] text-xs font-bold">
              File fermée
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
