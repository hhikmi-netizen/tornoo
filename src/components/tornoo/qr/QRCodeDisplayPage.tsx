"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CaretLeft, CheckCircle } from "@phosphor-icons/react";
import { useToast } from "@/components/ui/Toast";
import { useEstablishmentQRCode } from "@/hooks/useEstablishmentQRCode";
import { QRCodeCard } from "./QRCodeCard";

// Decorative scattered dots
function Confetti() {
  const dots = [
    { x: "18%", y: "6%", color: "#F5C400", r: 5 },
    { x: "80%", y: "4%", color: "#009B5A", r: 4 },
    { x: "88%", y: "12%", color: "#F5C400", r: 3 },
    { x: "10%", y: "14%", color: "#FF9800", r: 3 },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {dots.map((d, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ left: d.x, top: d.y, width: d.r * 2, height: d.r * 2, background: d.color }}
          animate={{ y: [0, -6, 0], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

interface Props {
  establishmentId?: string;
  subtitle?: string;
  instructionTitle?: string;
  instructionBody?: string;
}

export function QRCodeDisplayPage({
  establishmentId,
  subtitle = "Présentez ce code à l'établissement",
  instructionTitle,
  instructionBody,
}: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const { qrCode, isLoading, shareQrCode, printQrCode } = useEstablishmentQRCode(establishmentId);

  const handleShare = async () => {
    await shareQrCode();
    toast("Lien copié !", "success");
  };

  const handlePrint = () => {
    printQrCode();
  };

  return (
    <div className="min-h-svh bg-[#F8FAFC]">
      {/* Header */}
      <div className="flex items-center px-4 pt-safe-top pb-3 mt-1">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-[#071A2A] font-bold text-sm"
          aria-label="Retour"
        >
          <CaretLeft weight="bold" size={16} />
          Retour
        </button>
      </div>

      <div className="relative px-4 pb-8 max-w-[430px] mx-auto">
        <Confetti />

        {/* Title block */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col items-center mb-6 relative z-10"
        >
          <div className="w-14 h-14 rounded-full bg-[#EAF8F0] flex items-center justify-center mb-3 shadow-sm">
            <CheckCircle weight="fill" size={30} className="text-[#009B5A]" />
          </div>
          <h1 className="text-2xl font-black text-[#071A2A]">Mon QR Code</h1>
          <p className="text-sm text-[#667085] mt-1">{subtitle}</p>
        </motion.div>

        {/* QR Card */}
        {isLoading ? (
          <div className="h-80 rounded-3xl bg-gray-100 animate-pulse" />
        ) : qrCode ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <QRCodeCard
              qrCode={qrCode}
              onShare={handleShare}
              onPrint={handlePrint}
              instructionTitle={instructionTitle}
              instructionBody={instructionBody}
            />
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <p className="text-[#667085] font-medium">QR Code non disponible</p>
          </div>
        )}
      </div>
    </div>
  );
}
