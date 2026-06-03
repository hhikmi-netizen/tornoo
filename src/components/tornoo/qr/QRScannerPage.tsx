"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, ScanSmiley, Lightning, LightningSlash } from "@phosphor-icons/react";
import { useQrScanner } from "@/hooks/useQrScanner";
import { QRScannerFrame } from "./QRScannerFrame";
import { QRScanResultSheet } from "./QRScanResultSheet";

export function QRScannerPage() {
  const {
    scanResult,
    scanState,
    isLoading,
    torchOn,
    toggleTorch,
    simulateScan,
    joinQueue,
    reset,
  } = useQrScanner();

  const hasResult = scanState === "success" && scanResult;

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "#071A2A" }}>
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(0,155,90,0.10), transparent 70%)" }}
      />

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-safe-top pb-4 mt-2 relative z-10">
        <button
          onClick={reset}
          className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center"
          aria-label="Fermer"
        >
          <X weight="bold" size={18} className="text-white" />
        </button>

        <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 h-9">
          <ScanSmiley weight="duotone" size={16} className="text-white" />
          <span className="text-white font-bold text-sm">Scanner</span>
        </div>

        <button
          onClick={toggleTorch}
          className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center"
          aria-label={torchOn ? "Éteindre le flash" : "Allumer le flash"}
        >
          {torchOn
            ? <Lightning weight="fill" size={18} className="text-yellow-300" />
            : <LightningSlash weight="duotone" size={18} className="text-white" />}
        </button>
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center px-6 mb-8 relative z-10"
      >
        <h1 className="text-white font-black text-xl">Scannez pour rejoindre la file</h1>
        <p className="text-white/50 text-sm mt-1.5">Placez le QR Code dans le cadre</p>
      </motion.div>

      {/* Scanner frame */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 relative z-10">
        <QRScannerFrame scanning={scanState === "scanning" || isLoading} />

        {/* Tap to simulate */}
        {scanState === "idle" && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={simulateScan}
            className="mt-8 text-white/40 text-xs font-medium underline underline-offset-2"
          >
            Simuler un scan
          </motion.button>
        )}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 flex items-center gap-2 text-white/60 text-sm"
          >
            <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            Identification en cours…
          </motion.div>
        )}
      </div>

      {/* Result sheet */}
      <AnimatePresence>
        {hasResult && (
          <QRScanResultSheet result={scanResult} onJoin={joinQueue} />
        )}
      </AnimatePresence>
    </div>
  );
}
