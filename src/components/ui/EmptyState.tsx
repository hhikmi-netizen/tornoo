"use client";

import { motion } from "framer-motion";

/* ── Illustrations from Tornoo Asset Sheet v1.0 ── */

function SearchIllustration() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <circle cx="54" cy="52" r="30" stroke="#c7cdd6" strokeWidth="7"/>
      <line x1="76" y1="74" x2="98" y2="96" stroke="#c7cdd6" strokeWidth="9" strokeLinecap="round"/>
      <path d="M44 52h20M54 42v20" stroke="#eef1f0" strokeWidth="6" strokeLinecap="round"/>
      <circle cx="98" cy="34" r="9" fill="#e4f6ec"/>
      <circle cx="98" cy="34" r="4" fill="#07984a"/>
    </svg>
  );
}

function TicketIllustration() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <path d="M26 44a8 8 0 018-8h52a8 8 0 018 8v8a8 8 0 000 16v8a8 8 0 01-8 8H34a8 8 0 01-8-8v-8a8 8 0 000-16z" stroke="#c7cdd6" strokeWidth="6"/>
      <line x1="60" y1="40" x2="60" y2="84" stroke="#eef1f0" strokeWidth="5" strokeDasharray="5 6" strokeLinecap="round"/>
      <circle cx="84" cy="34" r="10" fill="#e4f6ec"/>
      <path d="M80 34l3 3 6-7" stroke="#07984a" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function FavoritesIllustration() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <path d="M60 88S30 70 30 50a16 16 0 0130-7 16 16 0 0130 7c0 20-30 38-30 38z" stroke="#c7cdd6" strokeWidth="6" strokeLinejoin="round"/>
      <circle cx="90" cy="40" r="10" fill="#e4f6ec"/>
      <path d="M90 35v10M85 40h10" stroke="#07984a" strokeWidth="2.6" strokeLinecap="round"/>
    </svg>
  );
}

function NotificationsIllustration() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <path d="M60 18c-16 0-26 11-26 24v17L24 72h72l-10-13V42C86 29 76 18 60 18z" fill="#f5f8f6" stroke="#c7cdd6" strokeWidth="6" strokeLinejoin="round"/>
      <path d="M52 76c0 4 3.6 7 8 7s8-3 8-7" stroke="#c7cdd6" strokeWidth="4" strokeLinecap="round"/>
      <line x1="60" y1="13" x2="60" y2="18" stroke="#c7cdd6" strokeWidth="4" strokeLinecap="round"/>
      <circle cx="84" cy="38" r="10" fill="#e4f6ec"/>
      <path d="M80 38l3 3 6-7" stroke="#07984a" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function QueueProIllustration() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <circle cx="44" cy="46" r="11" stroke="#c7cdd6" strokeWidth="6"/>
      <circle cx="76" cy="46" r="11" stroke="#eef1f0" strokeWidth="6"/>
      <path d="M28 84c0-11 7-18 16-18s16 7 16 18" stroke="#c7cdd6" strokeWidth="6" strokeLinecap="round"/>
      <path d="M60 84c0-11 7-18 16-18s16 7 16 18" stroke="#eef1f0" strokeWidth="6" strokeLinecap="round"/>
      <circle cx="90" cy="34" r="10" fill="#e4f6ec"/>
      <path d="M86 34l3 3 6-7" stroke="#07984a" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const ILLUSTRATIONS = {
  search: SearchIllustration,
  ticket: TicketIllustration,
  favorites: FavoritesIllustration,
  notifications: NotificationsIllustration,
  "queue-pro": QueueProIllustration,
} as const;

interface EmptyStateProps {
  type: keyof typeof ILLUSTRATIONS;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function EmptyState({ type, title, subtitle, action }: EmptyStateProps) {
  const Illustration = ILLUSTRATIONS[type];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-14 px-6 text-center"
    >
      <div className="animate-float">
        <Illustration />
      </div>
      <p className="mt-6 font-black text-ink text-lg leading-snug">{title}</p>
      {subtitle && <p className="mt-2 text-sm text-ink-3 leading-relaxed max-w-[240px]">{subtitle}</p>}
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}
