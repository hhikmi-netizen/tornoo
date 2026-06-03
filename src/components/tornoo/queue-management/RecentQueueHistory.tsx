"use client";
import Link from "next/link";
import { CaretRight } from "@phosphor-icons/react";
import type { QueueHistoryEvent } from "@/types/queue";

interface RecentQueueHistoryProps {
  events: QueueHistoryEvent[];
}

const actionLabels: Record<QueueHistoryEvent["action"], string> = {
  added: "Ajouté à la file",
  called: "Appelé",
  started: "Pris en charge",
  completed: "Service terminé",
  cancelled: "Annulé",
  paused: "File suspendue",
  resumed: "File reprise",
};

export function RecentQueueHistory({ events }: RecentQueueHistoryProps) {
  return (
    <div>
      <h2 className="font-bold text-base text-gray-900 mb-3">Historique récent</h2>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {events.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-sm text-gray-400">Aucun événement récent</p>
          </div>
        ) : (
          <>
            {events.map((event, i) => (
              <div key={event.id}>
                <div className="flex items-center px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-gray-900 truncate">{event.clientName}</p>
                    <p className="text-xs text-gray-500">{actionLabels[event.action]}</p>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0 ml-3">{event.time}</span>
                </div>
                {i < events.length - 1 && <div className="h-px bg-gray-100 mx-4" />}
              </div>
            ))}
          </>
        )}
        <div className="h-px bg-gray-100" />
        <Link
          href="/pro/analytics"
          className="flex items-center justify-between px-4 py-3 text-[#009B5A] font-bold text-sm hover:bg-gray-50 transition-colors"
        >
          Voir tout l&apos;historique
          <CaretRight size={16} weight="bold" />
        </Link>
      </div>
    </div>
  );
}
