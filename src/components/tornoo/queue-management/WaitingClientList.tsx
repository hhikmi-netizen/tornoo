"use client";
import { CaretDown } from "@phosphor-icons/react";
import type { QueueClient } from "@/types/queue";
import { WaitingClientRow } from "./WaitingClientRow";

interface WaitingClientListProps {
  clients: QueueClient[];
  onCall: (id: string) => void;
  onCancel: (id: string) => void;
  showAll: boolean;
  onToggleShowAll: () => void;
}

export function WaitingClientList({ clients, onCall, onCancel, showAll, onToggleShowAll }: WaitingClientListProps) {
  const displayed = !showAll && clients.length > 5 ? clients.slice(0, 5) : clients;

  return (
    <div>
      <h2 className="font-bold text-base text-gray-900 mb-3">
        Clients en attente ({clients.length})
      </h2>
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {clients.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-400 font-medium">Aucun client en attente</p>
          </div>
        ) : (
          <>
            {displayed.map((client, i) => (
              <div key={client.id}>
                <WaitingClientRow client={client} onCall={onCall} onCancel={onCancel} />
                {i < displayed.length - 1 && <div className="h-px bg-gray-100 mx-4" />}
              </div>
            ))}
            {!showAll && clients.length > 5 && (
              <>
                <div className="h-px bg-gray-100" />
                <button
                  onClick={onToggleShowAll}
                  className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-[#009B5A] hover:bg-gray-50 transition-colors"
                >
                  <CaretDown size={16} weight="bold" />
                  Voir plus de clients ({clients.length - 5})
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
