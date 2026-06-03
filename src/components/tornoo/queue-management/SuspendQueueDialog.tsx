"use client";
import { X } from "@phosphor-icons/react";
import type { QueueStatus } from "@/types/queue";

interface SuspendQueueDialogProps {
  open: boolean;
  status: QueueStatus;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function SuspendQueueDialog({ open, status, onClose, onConfirm, isLoading }: SuspendQueueDialogProps) {
  if (!open) return null;

  const isSuspended = status === "paused";

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute bottom-0 inset-x-0 bg-white rounded-t-[28px] max-h-[85vh]">
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
          <h2 className="font-black text-lg text-gray-900">
            {isSuspended ? "Reprendre la file ?" : "Suspendre la file ?"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X size={16} weight="bold" className="text-gray-600" />
          </button>
        </div>
        <div className="px-5 py-6">
          <p className="text-sm text-gray-500">
            {isSuspended
              ? "Les clients pourront à nouveau rejoindre la file."
              : "Les clients ne pourront plus rejoindre la file."}
          </p>
        </div>
        <div className="px-5 pb-8 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-12 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 h-12 rounded-xl text-white text-sm font-bold disabled:opacity-50 transition-colors"
            style={{ backgroundColor: isSuspended ? "#009B5A" : "#FF9800" }}
          >
            {isSuspended ? "Reprendre" : "Suspendre"}
          </button>
        </div>
      </div>
    </div>
  );
}
