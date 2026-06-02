"use client";

import { motion } from "framer-motion";

function SearchEmpty() {
  return (
    <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="46" r="28" stroke="#eaedf0" strokeWidth="5"/>
      <circle cx="50" cy="46" r="16" fill="#f5f8f6"/>
      <line x1="71" y1="67" x2="88" y2="84" stroke="#eaedf0" strokeWidth="5" strokeLinecap="round"/>
      <circle cx="44" cy="41" r="3" fill="#c7cdd6"/>
      <circle cx="56" cy="41" r="3" fill="#c7cdd6"/>
      <path d="M44 53 Q50 49 56 53" stroke="#c7cdd6" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

function HeartEmpty() {
  return (
    <svg width="110" height="100" viewBox="0 0 110 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M55 82 C55 82 18 58 18 34 C18 22 27 15 36 15 C44 15 51 20 55 27 C59 20 66 15 74 15 C83 15 92 22 92 34 C92 58 55 82 55 82Z" stroke="#eaedf0" strokeWidth="5" fill="#f5f8f6" strokeLinejoin="round"/>
      <path d="M55 82 C55 82 18 58 18 34" stroke="#eaedf0" strokeWidth="5" strokeLinecap="round"/>
      <path d="M36 30 Q38 25 43 27" stroke="#c7cdd6" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

function BellEmpty() {
  return (
    <svg width="100" height="110" viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 15 C35 15 24 26 24 42 L24 60 L14 70 L86 70 L76 60 L76 42 C76 26 65 15 50 15Z" fill="#f5f8f6" stroke="#eaedf0" strokeWidth="5" strokeLinejoin="round"/>
      <path d="M43 74 C43 77.3 46.1 80 50 80 C53.9 80 57 77.3 57 74" stroke="#eaedf0" strokeWidth="4" strokeLinecap="round"/>
      <line x1="50" y1="10" x2="50" y2="15" stroke="#c7cdd6" strokeWidth="3.5" strokeLinecap="round"/>
      <line x1="36" y1="38" x2="64" y2="38" stroke="#c7cdd6" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="36" y1="47" x2="56" y2="47" stroke="#c7cdd6" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

function TicketEmpty() {
  return (
    <svg width="120" height="90" viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="22" width="100" height="56" rx="12" fill="#f5f8f6" stroke="#eaedf0" strokeWidth="4"/>
      <line x1="10" y1="45" x2="110" y2="45" stroke="#eaedf0" strokeWidth="3" strokeDasharray="6 4"/>
      <circle cx="10" cy="45" r="8" fill="white" stroke="#eaedf0" strokeWidth="4"/>
      <circle cx="110" cy="45" r="8" fill="white" stroke="#eaedf0" strokeWidth="4"/>
      <rect x="32" y="30" width="30" height="8" rx="4" fill="#e4f6ec"/>
      <rect x="70" y="30" width="20" height="8" rx="4" fill="#e4f6ec"/>
      <rect x="32" y="55" width="56" height="6" rx="3" fill="#eaedf0"/>
      <rect x="32" y="66" width="36" height="5" rx="2.5" fill="#eaedf0"/>
    </svg>
  );
}

interface EmptyStateProps {
  type: "search" | "favorites" | "notifications" | "ticket";
  title: string;
  subtitle?: string;
}

const ILLUSTRATIONS = { search: SearchEmpty, favorites: HeartEmpty, notifications: BellEmpty, ticket: TicketEmpty };

export function EmptyState({ type, title, subtitle }: EmptyStateProps) {
  const Illustration = ILLUSTRATIONS[type];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <Illustration />
      <p className="mt-5 font-bold text-ink-2 text-base">{title}</p>
      {subtitle && <p className="mt-1 text-sm text-ink-3 leading-relaxed max-w-[240px]">{subtitle}</p>}
    </motion.div>
  );
}
