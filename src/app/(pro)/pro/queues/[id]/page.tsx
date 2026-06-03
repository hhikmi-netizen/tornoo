"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CaretLeft, SkipForward, Pause, Play, X, CheckCircle } from "@phosphor-icons/react";
import { MOCK_QUEUES } from "@/lib/mock-data";
import { useToast } from "@/components/ui/Toast";
import { useI18n } from "@/i18n/context";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

export default function QueueDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { t } = useI18n();
  const { toast } = useToast();

  const queue = MOCK_QUEUES.find((q) => q.id === id) ?? MOCK_QUEUES[0];

  const initialNum = parseInt(queue.currentTicket.split("-")[1], 10);
  const [currentNum, setCurrentNum] = useState(initialNum);
  const [servedCount, setServedCount] = useState(queue.servedToday);
  const [waitingCount, setWaitingCount] = useState(queue.waitingCount);
  const [isPaused, setIsPaused] = useState(false);
  const [isCalling, setIsCalling] = useState(false);

  const pad = (n: number) => String(n).padStart(3, "0");
  const currentTicket = `${queue.label}-${pad(currentNum)}`;
  const nextTicket = `${queue.label}-${pad(currentNum + 1)}`;

  const callNext = async () => {
    if (isCalling || waitingCount === 0 || isPaused) return;
    setIsCalling(true);
    await new Promise((r) => setTimeout(r, 500));
    setCurrentNum((n) => n + 1);
    setServedCount((n) => n + 1);
    setWaitingCount((n) => Math.max(0, n - 1));
    setIsCalling(false);
    toast(`${nextTicket} — appelé au guichet !`, "success");
  };

  const cancelWaiting = (ticket: string) => {
    setWaitingCount((n) => Math.max(0, n - 1));
    toast(`${ticket} annulé`, "info");
  };

  const togglePause = () => {
    const next = !isPaused;
    setIsPaused(next);
    toast(next ? t.queuePaused : t.resumeQueue, "info");
  };

  // Build a visible client list
  const servedRows = Array.from({ length: Math.min(2, currentNum - initialNum + 2) }, (_, i) => ({
    ticket: `${queue.label}-${pad(currentNum - 1 - i)}`,
    status: "served" as const,
  })).filter((r) => parseInt(r.ticket.split("-")[1]) >= initialNum - 2 && parseInt(r.ticket.split("-")[1]) > 0);

  const waitingRows = Array.from({ length: Math.min(waitingCount, 5) }, (_, i) => ({
    ticket: `${queue.label}-${pad(currentNum + i + 1)}`,
    status: "waiting" as const,
  }));

  const clients = [
    ...servedRows.reverse(),
    { ticket: currentTicket, status: "current" as const },
    ...waitingRows,
  ];

  return (
    <div className="bg-surface-2 min-h-svh">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm px-4 pt-safe-top pb-3 border-b border-line flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center"
          aria-label="Retour"
        >
          <CaretLeft size={20} weight="bold" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-black text-ink leading-tight">File {queue.label}</h1>
          <p className="text-xs text-ink-3 truncate">{queue.serviceName}</p>
        </div>
        <button
          onClick={togglePause}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            isPaused
              ? "bg-[#fff1de] border border-[#ffd9a6]"
              : "bg-surface-2 border border-line"
          }`}
          aria-label={isPaused ? t.resumeQueue : t.pauseQueue}
        >
          {isPaused
            ? <Play size={16} weight="fill" className="text-[#ff9300]" />
            : <Pause size={16} weight="fill" className="text-ink-2" />
          }
        </button>
      </div>

      <div className="px-4 pt-4 pb-28 max-w-lg mx-auto space-y-4">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white rounded-[18px] border border-line shadow-1 p-3 text-center">
            <motion.p
              key={currentTicket}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="text-base font-black text-ink leading-tight"
            >
              {currentTicket}
            </motion.p>
            <p className="text-[11px] text-ink-3 mt-0.5">{t.inProgress}</p>
          </div>
          <div className="bg-white rounded-[18px] border border-line shadow-1 p-3 text-center">
            <AnimatedNumber value={waitingCount} duration={0.5} className="text-base font-black text-ink leading-tight block" />
            <p className="text-[11px] text-ink-3 mt-0.5">{t.waiting}</p>
          </div>
          <div className="bg-white rounded-[18px] border border-line shadow-1 p-3 text-center">
            <AnimatedNumber value={servedCount} duration={0.5} className="text-base font-black text-tornoo-green leading-tight block" />
            <p className="text-[11px] text-ink-3 mt-0.5">{t.served}</p>
          </div>
        </div>

        {/* Current ticket hero */}
        <motion.div
          className={`rounded-[22px] p-6 text-center relative overflow-hidden ${
            isPaused
              ? "bg-surface-2 border-2 border-dashed border-line"
              : "bg-tornoo-green"
          }`}
          style={!isPaused ? { boxShadow: "0 8px 32px -8px rgba(7,152,74,.45)" } : undefined}
        >
          {/* Subtle radial glow */}
          {!isPaused && (
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.12) 0%, transparent 65%)" }} />
          )}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTicket}
              initial={{ opacity: 0, scale: 0.85, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.12, y: 6 }}
              transition={{ type: "spring", stiffness: 400, damping: 26 }}
              className="relative"
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                {!isPaused && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-breathe" />
                )}
                <p className={`text-[11px] font-bold tracking-[0.12em] uppercase ${isPaused ? "text-ink-3" : "text-white/70"}`}>
                  {isPaused ? t.queuePaused : t.currentTicketLabel}
                </p>
              </div>
              <p className={`text-[64px] font-black leading-none tracking-[-0.02em] ${isPaused ? "text-ink-3" : "text-white"}`}>
                {currentTicket}
              </p>
            </motion.div>
          </AnimatePresence>

          <button
            onClick={callNext}
            disabled={isCalling || waitingCount === 0 || isPaused}
            className={`relative mt-5 inline-flex items-center gap-2 h-12 px-7 rounded-[13px] font-extrabold text-sm transition-all active:scale-95 disabled:opacity-40 ${
              isPaused
                ? "bg-line text-ink-3"
                : "bg-white text-tornoo-green shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
            }`}
          >
            {isCalling ? (
              <span className="w-4 h-4 rounded-full border-2 border-tornoo-green/40 border-t-tornoo-green animate-spin" />
            ) : (
              <SkipForward size={16} weight="bold" />
            )}
            {waitingCount === 0
              ? t.queueEmpty
              : isCalling
              ? t.calling
              : `${t.callNext} ${nextTicket}`}
          </button>
        </motion.div>

        {/* Client list */}
        <div className="bg-white rounded-[22px] border border-line shadow-1 overflow-hidden">
          <div className="px-4 pt-4 pb-2 flex items-center justify-between">
            <h3 className="font-black text-ink">{t.tickets}</h3>
            <span className="text-xs text-ink-3 bg-surface-2 border border-line rounded-full px-2.5 py-0.5">
              {waitingCount} {t.waiting}
            </span>
          </div>
          <div>
            {clients.map((c, i) => (
              <div
                key={c.ticket}
                className={`flex items-center gap-3 px-4 py-3.5 ${
                  i < clients.length - 1 ? "border-b border-line" : ""
                } ${c.status === "current" ? "bg-low-bg" : ""}`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                    c.status === "served"
                      ? "bg-surface-2 text-ink-4"
                      : c.status === "current"
                      ? "bg-tornoo-green text-white"
                      : "bg-surface-2 text-ink-2"
                  }`}
                >
                  {c.ticket.split("-")[1]}
                </div>
                <div className="flex-1">
                  <p className={`font-bold text-sm ${c.status === "current" ? "text-tornoo-green" : "text-ink"}`}>
                    {c.ticket}
                  </p>
                  <p className="text-xs text-ink-3">
                    {c.status === "served" ? t.served : c.status === "current" ? t.statusInService : t.waiting}
                  </p>
                </div>
                {c.status === "waiting" && (
                  <button
                    onClick={() => cancelWaiting(c.ticket)}
                    className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center"
                    aria-label={`Annuler ${c.ticket}`}
                  >
                    <X size={14} weight="bold" className="text-ink-3" />
                  </button>
                )}
                {c.status === "served" && (
                  <CheckCircle size={16} weight="fill" className="text-tornoo-green" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Close queue */}
        <button
          onClick={() => { toast(t.closeQueue, "info"); router.replace("/pro/queues"); }}
          className="w-full h-12 rounded-[15px] bg-[#fde7e6] text-[#ef2b24] font-bold border border-[#f6c2bf] text-sm active:scale-[0.98] transition-transform"
        >
          {t.closeQueue}
        </button>
      </div>
    </div>
  );
}
