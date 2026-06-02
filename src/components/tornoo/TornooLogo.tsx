"use client";

import { cn } from "@/lib/utils";

interface TornooMarkProps {
  size?: number;
  className?: string;
}

export function TornooMark({ size = 64, className }: TornooMarkProps) {
  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 132 132" className="w-full h-full drop-shadow-sm">
        <rect width="132" height="132" rx="30" fill="#07984a"/>
        <g transform="translate(66,66) scale(.62) translate(-100,-100)">
          <path d="M48 135C31 116 27 88 38 64C51 36 80 22 110 28C119 30 127 33 135 38" stroke="#fff" strokeWidth="24" strokeLinecap="round" fill="none"/>
          <path d="M143 45C157 56 166 71 169 88" stroke="#fff" strokeWidth="24" strokeLinecap="round" fill="none" opacity=".85"/>
          <path d="M170 104C168 121 160 137 148 149" stroke="#fff" strokeWidth="24" strokeLinecap="round" fill="none" opacity=".7"/>
          <path d="M70 93L90 113L132 67" stroke="#fff" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </g>
      </svg>
    </div>
  );
}

interface TornooLogoProps {
  compact?: boolean;
  dark?: boolean;
  className?: string;
  showTagline?: boolean;
}

export function TornooLogo({ compact = false, dark = false, className, showTagline = true }: TornooLogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <TornooMark size={compact ? 40 : 56} />
      <div>
        <div
          className={cn(
            "font-black tracking-[-0.04em] leading-none",
            compact ? "text-2xl" : "text-4xl",
            dark ? "text-white" : "text-[#0b1220]"
          )}
        >
          Tornoo
        </div>
        {showTagline && (
          <div className={cn("font-bold leading-tight", compact ? "text-xs mt-0.5" : "text-sm mt-1")}>
            <span className="text-[#07984A]">L'attente</span>{" "}
            <span className="text-[#FF9300]">en temps réel</span>
          </div>
        )}
      </div>
    </div>
  );
}
