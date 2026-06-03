"use client";

import { motion } from "framer-motion";
import { MapPin, Star, Plus } from "@phosphor-icons/react";
import type { QRScanResult } from "@/types/qr";
import { QRStatusBadge, QRWaitBadge } from "./QRStatusBadge";

interface Props {
  result: QRScanResult;
  onJoin: () => void;
}

export function QRScanResultSheet({ result, onJoin }: Props) {
  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 280, damping: 30 }}
      className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[28px] px-5 pt-4 pb-safe-bottom shadow-2xl"
    >
      {/* Handle */}
      <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-4" />

      {/* Establishment identity */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-14 h-14 rounded-2xl bg-[#071A2A] flex items-center justify-center shrink-0 shadow-md">
          <span className="text-white font-black text-xs text-center leading-tight px-1">
            {result.establishmentName.split(" ").map((w) => w[0]).join("").slice(0, 4).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-black text-lg text-[#071A2A] truncate">{result.establishmentName}</h2>
          <div className="flex items-center gap-1 text-sm text-[#667085] mt-0.5">
            <MapPin weight="duotone" size={13} className="text-[#009B5A] shrink-0" />
            <span className="truncate">{result.area}, {result.city}</span>
          </div>
        </div>
      </div>

      {/* Status badges */}
      <div className="flex items-center gap-2 mb-4">
        <QRStatusBadge status={result.status} />
        <QRWaitBadge minutes={result.estimatedWaitMinutes} />
      </div>

      {/* Offer card */}
      {result.offer && (
        <div className="bg-[#EAF8F0] rounded-2xl px-4 py-3.5 flex items-start gap-3 mb-5">
          <Star weight="fill" size={18} className="text-[#009B5A] mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-[#071A2A]">{result.offer.title}</p>
            <p className="text-xs text-[#667085] mt-0.5 leading-snug">{result.offer.description}</p>
          </div>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={onJoin}
        className="w-full h-14 rounded-2xl bg-[#009B5A] text-white font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-[#009B5A]/30 active:scale-[0.98] transition-transform"
        aria-label="Rejoindre la file"
      >
        <Plus weight="bold" size={18} />
        Rejoindre la file
      </button>

      <div className="h-2" />
    </motion.div>
  );
}
