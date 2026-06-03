"use client";
import { CaretLeft } from "@phosphor-icons/react";

interface CancelClientDialogProps {
  open: boolean;
  onClose: () => void;
  onCancelClient: () => void;
  onCloseQueue: () => void;
  isLoading: boolean;
  clientName?: string;
}

export function CancelClientDialog({ open, onClose, onCancelClient, onCloseQueue, isLoading, clientName }: CancelClientDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute bottom-0 inset-x-0 bg-white rounded-t-[28px] max-h-[85vh]">
        <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-gray-100">
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
            <CaretLeft size={16} weight="bold" className="text-gray-600" />
          </button>
          <h2 className="font-black text-lg text-gray-900">Annuler</h2>
        </div>
        <div className="px-5 py-6 space-y-3">
          <p className="text-sm text-gray-500 mb-4">Que souhaitez-vous faire ?</p>
          {clientName && (
            <button
              onClick={onCancelClient}
              disabled={isLoading}
              className="w-full h-12 rounded-xl border-2 border-[#EF2B24] text-[#EF2B24] text-sm font-bold disabled:opacity-50 hover:bg-red-50 transition-colors"
            >
              Annuler {clientName}
            </button>
          )}
          <button
            onClick={onCloseQueue}
            disabled={isLoading}
            className="w-full h-12 rounded-xl bg-[#EF2B24] text-white text-sm font-bold disabled:opacity-50 hover:bg-[#c82020] transition-colors"
          >
            Fermer la file entière
          </button>
        </div>
        <div className="px-5 pb-8">
          <button
            onClick={onClose}
            className="w-full h-12 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Retour
          </button>
        </div>
      </div>
    </div>
  );
}
