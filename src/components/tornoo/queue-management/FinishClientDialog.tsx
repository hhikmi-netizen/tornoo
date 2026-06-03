"use client";
import { X } from "@phosphor-icons/react";
import type { QueueClient } from "@/types/queue";

interface FinishClientDialogProps {
  open: boolean;
  client: QueueClient | undefined;
  onClose: () => void;
  onFinish: () => void;
  isLoading: boolean;
}

export function FinishClientDialog({ open, client, onClose, onFinish, isLoading }: FinishClientDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute bottom-0 inset-x-0 bg-white rounded-t-[28px] max-h-[85vh]">
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
          <h2 className="font-black text-lg text-gray-900">
            Terminer le service{client ? ` de ${client.name}` : ""} ?
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X size={16} weight="bold" className="text-gray-600" />
          </button>
        </div>
        <div className="px-5 py-6">
          <p className="text-sm text-gray-500">Le client sera marqué comme servi.</p>
        </div>
        <div className="px-5 pb-8 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-12 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onFinish}
            disabled={isLoading}
            className="flex-1 h-12 rounded-xl bg-[#2563EB] text-white text-sm font-bold disabled:opacity-50 hover:bg-[#1d4ed8] transition-colors"
          >
            Terminer
          </button>
        </div>
      </div>
    </div>
  );
}
