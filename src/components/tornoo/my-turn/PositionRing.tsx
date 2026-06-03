"use client";

import { motion } from "framer-motion";

interface Props {
  position: number;
}

export function PositionRing({ position }: Props) {
  const cx = 160;
  const cy = 160;

  return (
    <div className="relative w-64 h-64 mx-auto">
      <svg viewBox="0 0 320 320" className="absolute inset-0 w-full h-full" aria-hidden>
        {/* Outermost dashed ring */}
        <circle
          cx={cx} cy={cy} r={150}
          fill="none"
          stroke="#009B5A"
          strokeWidth="1.5"
          strokeDasharray="6 5"
          opacity="0.35"
        />

        {/* Halo rings — concentric fading circles */}
        {[130, 112, 95].map((r, i) => (
          <circle
            key={r}
            cx={cx} cy={cy} r={r}
            fill="#009B5A"
            opacity={0.04 + i * 0.025}
          />
        ))}

        {/* Main green stroke ring */}
        <circle
          cx={cx} cy={cy} r={122}
          fill="none"
          stroke="#009B5A"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Animated dot on top of ring */}
        <motion.circle
          cx={cx} cy={cy - 122}
          r="7"
          fill="#009B5A"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          cx={cx} cy={cy - 122}
          r="3.5"
          fill="white"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>

      {/* Pulsing halo behind center icon — Framer Motion */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="absolute w-20 h-20 rounded-full"
          style={{ background: "rgba(0,155,90,0.12)" }}
          animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Center icon */}
        <div className="relative z-10 flex flex-col items-center gap-1">
          <div className="w-14 h-14 rounded-full bg-[#009B5A] flex items-center justify-center shadow-lg shadow-[#009B5A]/30">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
              <circle cx="11" cy="11" r="9" stroke="white" strokeWidth="2" fill="none" />
              <circle cx="11" cy="11" r="4" fill="white" />
              <circle cx="11" cy="11" r="1.5" fill="#009B5A" />
            </svg>
          </div>

          <motion.p
            className="text-6xl font-black text-[#009B5A] leading-none tracking-tight"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
          >
            #{position}
          </motion.p>

          <p className="text-[#071A2A] font-bold text-sm">Votre position</p>
        </div>
      </div>
    </div>
  );
}
