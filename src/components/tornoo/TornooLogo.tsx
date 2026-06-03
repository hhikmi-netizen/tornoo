"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface TornooMarkProps {
  size?: number;
  className?: string;
  href?: string;
  onClick?: () => void;
}

export function TornooMark({ size = 64, className, href, onClick }: TornooMarkProps) {
  const svg = (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" aria-label="Tornoo">
      <defs>
        <linearGradient id="tornooGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"  stopColor="#00A75A" />
          <stop offset="48%" stopColor="#F7C400" />
          <stop offset="70%" stopColor="#FF9300" />
          <stop offset="100%" stopColor="#EF2B24" />
        </linearGradient>
      </defs>
      {/* Main arc — gradient (green → yellow → orange) */}
      <path d="M21 72a36 36 0 1 1 58-40" stroke="url(#tornooGrad)" strokeWidth="13" fill="none" strokeLinecap="round" />
      {/* Small orange segment */}
      <path d="M80 38a35 35 0 0 1 6 14" stroke="#FF9300" strokeWidth="13" fill="none" strokeLinecap="round" />
      {/* Small red segment */}
      <path d="M84 62a35 35 0 0 1-7 16" stroke="#EF2B24" strokeWidth="13" fill="none" strokeLinecap="round" />
      {/* Checkmark */}
      <path d="M35 51l10 10 22-24" stroke="#07984A" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* People circles */}
      <circle cx="34" cy="82" r="5" fill="#07984A"/>
      <circle cx="50" cy="82" r="5" fill="#FFB000"/>
      <circle cx="66" cy="82" r="5" fill="#EF2B24"/>
      {/* People bodies */}
      <path d="M27 94c1-8 5-11 9-11s8 3 9 11" fill="#07984A"/>
      <path d="M43 94c1-8 5-11 9-11s8 3 9 11" fill="#FFB000"/>
      <path d="M59 94c1-8 5-11 9-11s8 3 9 11" fill="#EF2B24"/>
    </svg>
  );

  const wrapper = (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
    >
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

  if (href) {
    return (
      <Link href={href} className="inline-flex active:opacity-80 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
