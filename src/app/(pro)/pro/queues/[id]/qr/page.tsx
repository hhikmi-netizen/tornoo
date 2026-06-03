"use client";

import { useRouter } from "next/navigation";
import { CaretLeft, ShareNetwork, DownloadSimple } from "@phosphor-icons/react";
import { useToast } from "@/components/ui/Toast";

function MockQRCode() {
  const pattern = [
    1,1,1,1,1,1,1,0,1,0,1,0,0,0,1,1,1,1,1,1,1,
    1,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,1,
    1,0,1,1,1,0,1,0,1,0,1,0,0,0,1,0,1,1,1,0,1,
    1,0,1,1,1,0,1,0,0,1,1,1,0,0,1,0,1,1,1,0,1,
    1,0,1,1,1,0,1,0,1,0,0,0,1,0,1,0,1,1,1,0,1,
    1,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,1,
    1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,
    0,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,0,0,0,
    1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,0,1,1,0,
    0,1,0,0,1,0,0,0,1,0,0,1,0,0,0,1,0,1,0,0,1,
    1,1,1,0,1,1,1,1,0,1,1,0,1,0,1,1,1,0,0,1,0,
    0,0,1,1,0,0,0,0,1,1,0,1,1,1,0,0,1,1,1,0,1,
    1,0,0,0,1,1,1,1,1,0,0,0,1,0,1,0,0,0,0,1,0,
    0,0,0,0,0,0,0,0,1,0,1,1,0,1,0,1,1,0,1,1,1,
    1,1,1,1,1,1,1,0,0,1,1,0,1,0,1,0,1,0,0,0,1,
    1,0,0,0,0,0,1,0,1,0,0,1,0,1,0,1,0,1,1,0,0,
    1,0,1,1,1,0,1,1,0,1,1,0,1,0,0,1,1,0,1,0,1,
    1,0,1,1,1,0,1,0,1,1,0,1,1,1,0,0,0,1,0,1,0,
    1,0,1,1,1,0,1,0,0,0,1,0,0,0,1,1,1,0,1,0,1,
    1,0,0,0,0,0,1,0,1,1,0,1,0,1,0,0,1,1,0,1,0,
    1,1,1,1,1,1,1,0,0,0,1,0,1,0,1,0,0,0,1,0,1,
  ];

  const size = 21;
  const cellSize = 5;
  const padding = 4;
  const total = size * cellSize + padding * 2;

  return (
    <svg viewBox={`0 0 ${total} ${total}`} className="w-56 h-56" xmlns="http://www.w3.org/2000/svg">
      <rect width={total} height={total} fill="white" />
      {pattern.map((cell, i) => {
        if (!cell) return null;
        const col = i % size;
        const row = Math.floor(i / size);
        return (
          <rect
            key={i}
            x={padding + col * cellSize}
            y={padding + row * cellSize}
            width={cellSize}
            height={cellSize}
            fill="#062E24"
          />
        );
      })}
    </svg>
  );
}

export default function QueueQRPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: "Barber Club - File d'attente", url: "https://tornoo.app/barber-club" }).catch(() => null);
    } else {
      navigator.clipboard.writeText("https://tornoo.app/barber-club").then(() => {
        toast("Lien copié", "success");
      });
    }
  };

  const handleDownload = () => {
    toast("Téléchargement du QR code...", "info");
  };

  return (
    <div className="min-h-svh bg-[#F8FAFC]">
      <div className="bg-white border-b border-gray-200 px-5 py-4 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
          aria-label="Retour"
        >
          <CaretLeft size={18} weight="bold" className="text-gray-700" />
        </button>
        <h1 className="font-black text-lg text-gray-900">QR Code</h1>
      </div>

      <div className="max-w-sm mx-auto px-5 py-10 flex flex-col items-center gap-6">
        <div className="bg-white rounded-2xl border-2 border-[#062E24] p-6 shadow-lg flex flex-col items-center gap-4">
          <MockQRCode />
          <p className="text-sm font-bold text-gray-500 tracking-wide">Barber Club</p>
        </div>

        <div className="text-center">
          <p className="text-sm font-bold text-[#009B5A]">tornoo.app/barber-club</p>
          <p className="text-xs text-gray-400 mt-1">Scannez pour rejoindre la file</p>
        </div>

        <div className="flex gap-3 w-full">
          <button
            onClick={handleShare}
            className="flex-1 h-12 rounded-xl bg-[#009B5A] text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#007a47] transition-colors"
          >
            <ShareNetwork size={18} weight="duotone" />
            Partager
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 h-12 rounded-xl bg-white border border-gray-200 text-sm font-bold text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <DownloadSimple size={18} weight="duotone" />
            Télécharger
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-600 text-center leading-relaxed">
            Imprimez ce QR code et affichez-le dans votre établissement. Vos clients pourront scanner pour rejoindre la file.
          </p>
        </div>
      </div>
    </div>
  );
}
