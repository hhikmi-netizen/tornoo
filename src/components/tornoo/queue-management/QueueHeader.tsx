"use client";
import { QrCode, DotsThree } from "@phosphor-icons/react";

interface QueueHeaderProps {
  onQRCode: () => void;
}

export function QueueHeader({ onQRCode }: QueueHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="font-black text-xl text-gray-900">Gestion des files</h1>
        <p className="text-sm text-gray-500">Gérez votre file d&apos;attente en temps réel</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onQRCode}
          className="flex items-center gap-2 h-9 px-4 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <QrCode size={16} weight="duotone" />
          Voir le QR code
        </button>
        <button className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
          <DotsThree size={20} weight="bold" className="text-gray-700" />
        </button>
      </div>
    </div>
  );
}
