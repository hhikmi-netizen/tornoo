import { ShareNetwork, Printer } from "@phosphor-icons/react";

interface Props {
  onShare: () => void;
  onPrint: () => void;
}

export function QRCodeActions({ onShare, onPrint }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        onClick={onShare}
        className="h-14 rounded-2xl flex items-center justify-center gap-2 border-2 border-gray-200 bg-white text-[#071A2A] font-bold text-sm active:scale-[0.98] transition-transform"
        aria-label="Partager le QR Code"
      >
        <ShareNetwork weight="bold" size={18} />
        Partager
      </button>
      <button
        onClick={onPrint}
        className="h-14 rounded-2xl flex items-center justify-center gap-2 bg-[#071A2A] text-white font-bold text-sm active:scale-[0.98] transition-transform"
        aria-label="Imprimer le QR Code"
      >
        <Printer weight="fill" size={18} />
        Imprimer
      </button>
    </div>
  );
}
