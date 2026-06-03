"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface TornooMarkProps {
  size?: number;
  className?: string;
  href?: string;
  onClick?: () => void;
  dark?: boolean;
}

export function TornooMark({ size = 64, className, href, onClick, dark = false }: TornooMarkProps) {
  const svg = (
    <svg viewBox="0 0 200 200" className="w-full h-full" aria-label="Tornoo">
      <defs>
        <linearGradient id="tornooGradient" x1="25" y1="30" x2="175" y2="170">
          <stop offset="0%"  stopColor="#009B5A" />
          <stop offset="45%" stopColor="#F5C400" />
          <stop offset="68%" stopColor="#FF8A00" />
          <stop offset="100%" stopColor="#EF2B24" />
        </linearGradient>
      </defs>
      <path d="M48 135C31 116 27 88 38 64C51 36 80 22 110 28C119 30 127 33 135 38" stroke="url(#tornooGradient)" strokeWidth="24" strokeLinecap="round" fill="none" />
      <path d="M143 45C157 56 166 71 169 88" stroke="#FF9800" strokeWidth="24" strokeLinecap="round" fill="none" />
      <path d="M170 104C168 121 160 137 148 149" stroke="#EF2B24" strokeWidth="24" strokeLinecap="round" fill="none" />
      <path d="M70 93L90 113L132 67" stroke={dark ? "white" : "#0B1B2B"} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="66"  cy="154" r="11" fill="#39B54A" />
      <circle cx="100" cy="154" r="11" fill="#FFB000" />
      <circle cx="134" cy="154" r="11" fill="#EF2B24" />
      <path d="M47 189C49 171 56 160 66 160C76 160 83 171 85 189H47Z"   fill="#39B54A" />
      <path d="M81 189C83 171 90 160 100 160C110 160 117 171 119 189H81Z" fill="#FFB000" />
      <path d="M115 189C117 171 124 160 134 160C144 160 151 171 153 189H115Z" fill="#EF2B24" />
    </svg>
  );

  const wrapper = (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      {svg}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block shrink-0 active:opacity-80 transition-opacity" style={{ width: size, height: size }}>
        {svg}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} className="block shrink-0 active:opacity-80 transition-opacity" style={{ width: size, height: size }}>
        {svg}
      </button>
    );
  }

  return wrapper;
}

interface TornooLogoProps {
  compact?: boolean;
  dark?: boolean;
  className?: string;
  showTagline?: boolean;
  href?: string;
}

export function TornooLogo({ compact = false, dark = false, className, showTagline = true, href }: TornooLogoProps) {
  const content = (
    <div className={cn("flex items-center gap-3", className)}>
      <TornooMark size={compact ? 40 : 56} dark={dark} />
      <div>
        <div className={cn(
          "font-black tracking-[-0.05em] leading-none",
          compact ? "text-2xl" : "text-4xl",
          dark ? "text-white" : "text-[#071A2A]",
        )}>
          Tornoo
        </div>
        {showTagline && (
          <div className={cn("font-bold leading-tight", compact ? "text-xs mt-0.5" : "text-sm mt-1")}>
            {dark ? (
              <>
                <span className="text-emerald-400">L'attente</span>{" "}
                <span className="text-orange-400">en temps réel</span>
              </>
            ) : (
              <>
                <span className="text-[#009B5A]">L'attente</span>{" "}
                <span className="text-[#8BC53F]">en</span>{" "}
                <span className="text-[#FF8A00]">temps</span>{" "}
                <span className="text-[#EF2B24]">réel</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex active:opacity-80 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
