"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CaretLeft, DownloadSimple, Share, Copy } from "@phosphor-icons/react";
import { useToast } from "@/components/ui/Toast";
import { MOCK_ESTABLISHMENTS } from "@/lib/mock-data";

export default function QRCodePage() {
  const router = useRouter();
  const { toast } = useToast();
  const e = MOCK_ESTABLISHMENTS[0];

  const qrUrl = `https://tornoo.ma/establishment/${e.slug}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(qrUrl).catch(() => {});
    toast("Lien copié !", "success");
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: e.name, url: qrUrl }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  return (
    <div className="bg-surface-2 min-h-svh pb-28">
      {/* Header */}
      <div className="bg-white border-b border-line px-4 pt-safe-top pb-4 flex items-center gap-3">
        <button onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-surface-2 border border-line flex items-center justify-center">
          <CaretLeft weight="bold" size={18} className="text-ink" />
        </button>
        <h1 className="font-black text-lg text-ink flex-1">Mon QR code</h1>
      </div>

      <div className="px-4 pt-6 max-w-lg mx-auto space-y-4">
        {/* QR card */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[28px] border border-line shadow-pop p-6 flex flex-col items-center">
          <p className="text-sm font-bold text-ink-3 mb-4">{e.name}</p>

          {/* QR Code SVG placeholder */}
          <div className="w-56 h-56 rounded-[18px] bg-white border-2 border-line p-3 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              {/* QR corners */}
              <rect x="10" y="10" width="55" height="55" rx="6" fill="none" stroke="#061819" strokeWidth="8"/>
              <rect x="22" y="22" width="31" height="31" rx="2" fill="#061819"/>
              <rect x="135" y="10" width="55" height="55" rx="6" fill="none" stroke="#061819" strokeWidth="8"/>
              <rect x="147" y="22" width="31" height="31" rx="2" fill="#061819"/>
              <rect x="10" y="135" width="55" height="55" rx="6" fill="none" stroke="#061819" strokeWidth="8"/>
              <rect x="22" y="147" width="31" height="31" rx="2" fill="#061819"/>
              {/* QR data dots */}
              {[80,90,100,110,120].map((x) =>
                [80,90,100,110,120].map((y) =>
                  Math.random() > 0.4 ? <rect key={`${x}-${y}`} x={x} y={y} width="8" height="8" rx="1.5" fill="#061819"/> : null
                )
              )}
              {[135,145,155,165,175,185].map((x) =>
                [80,90,100,110,120].map((y) =>
                  Math.random() > 0.5 ? <rect key={`${x}-${y}`} x={x} y={y} width="8" height="8" rx="1.5" fill="#061819"/> : null
                )
              )}
              {[10,20,30,40,50,60].map((x) =>
                [80,90,100,110,120].map((y) =>
                  Math.random() > 0.5 ? <rect key={`${x}-${y}`} x={x} y={y} width="8" height="8" rx="1.5" fill="#061819"/> : null
                )
              )}
              {/* Tornoo logo center */}
              <rect x="87" y="87" width="26" height="26" rx="5" fill="white"/>
              <rect x="91" y="91" width="18" height="18" rx="3" fill="#07984a"/>
              <text x="100" y="103.5" textAnchor="middle" fontSize="10" fontWeight="900" fill="white">T</text>
            </svg>
          </div>

          <p className="text-xs text-ink-3 mt-4 font-medium text-center">Scannez pour rejoindre la file d'attente</p>
          <p className="text-[11px] text-ink-4 mt-1 font-medium break-all text-center">{qrUrl}</p>
        </motion.div>

        {/* Actions */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3">
          {[
            { icon: DownloadSimple, label: "Télécharger", onClick: () => toast("PDF généré !", "success") },
            { icon: Share,          label: "Partager",    onClick: handleShare },
            { icon: Copy,           label: "Copier lien", onClick: handleCopy },
          ].map(({ icon: Icon, label, onClick }) => (
            <button key={label} onClick={onClick}
              className="bg-white rounded-[18px] border border-line shadow-1 p-4 flex flex-col items-center gap-2 active:scale-95 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-low-bg flex items-center justify-center">
                <Icon size={18} weight="duotone" className="text-tornoo-green" />
              </div>
              <span className="text-xs font-bold text-ink-2">{label}</span>
            </button>
          ))}
        </motion.div>

        {/* Info */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white rounded-[22px] border border-line shadow-1 p-4 space-y-3">
          <h2 className="font-black text-ink">Comment l'utiliser ?</h2>
          {[
            "Imprimez ce QR code et affichez-le à l'entrée de votre établissement.",
            "Vos clients le scannent avec l'app Tornoo pour rejoindre la file.",
            "Vous gérez tout depuis votre tableau de bord en temps réel.",
          ].map((text, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-tornoo-green flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-white text-xs font-black">{i + 1}</span>
              </div>
              <p className="text-sm text-ink-2 font-medium leading-relaxed">{text}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
