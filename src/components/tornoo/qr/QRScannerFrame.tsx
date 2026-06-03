"use client";

import { motion } from "framer-motion";
import { QRCodeSVG } from "./QRCodeSVG";

const CORNER = 28;
const STROKE = 3;
const GREEN = "#00E676";

function CornerSVG({ rotate }: { rotate: number }) {
  return (
    <svg
      width={CORNER + STROKE}
      height={CORNER + STROKE}
      viewBox={`0 0 ${CORNER + STROKE} ${CORNER + STROKE}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <path
        d={`M${STROKE / 2} ${CORNER} L${STROKE / 2} ${STROKE / 2} L${CORNER} ${STROKE / 2}`}
        stroke={GREEN}
        strokeWidth={STROKE}
        strokeLinecap="round"
        fill="none"
        filter="url(#glow)"
      />
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
    </svg>
  );
}

interface Props {
  scanning: boolean;
}

export function QRScannerFrame({ scanning }: Props) {
  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Glow halo */}
      {scanning && (
        <motion.div
          className="absolute inset-[-12px] rounded-2xl"
          style={{ boxShadow: `0 0 40px 12px rgba(0,230,118,0.18)` }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* QR code */}
      <div className="w-full h-full rounded-2xl overflow-hidden bg-white shadow-2xl">
        <QRCodeSVG size={256} logoSize={44} className="w-full h-full" />
      </div>

      {/* Scan line */}
      {scanning && (
        <motion.div
          className="absolute left-3 right-3 h-0.5 rounded-full"
          style={{ background: `linear-gradient(90deg, transparent, ${GREEN}, transparent)` }}
          initial={{ top: "12px" }}
          animate={{ top: ["12px", "244px", "12px"] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Corners */}
      <div className="absolute top-0 left-0 -translate-x-0.5 -translate-y-0.5">
        <CornerSVG rotate={0} />
      </div>
      <div className="absolute top-0 right-0 translate-x-0.5 -translate-y-0.5">
        <CornerSVG rotate={90} />
      </div>
      <div className="absolute bottom-0 right-0 translate-x-0.5 translate-y-0.5">
        <CornerSVG rotate={180} />
      </div>
      <div className="absolute bottom-0 left-0 -translate-x-0.5 translate-y-0.5">
        <CornerSVG rotate={270} />
      </div>
    </div>
  );
}
