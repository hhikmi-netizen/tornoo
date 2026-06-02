"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, SkipForward, Pause, Play, X } from "lucide-react";
import { MOCK_QUEUES } from "@/lib/mock-data";
import { useToast } from "@/components/ui/Toast";

export default function QueueDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
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
    toast(next ? "File mise en pause" : "File reprise", "info");
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
          <ChevronLeft size={20} />
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
          aria-label={isPaused ? "Reprendre la file" : "Mettre en pause"}
        >
          {isPaused
            ? <Play size={16} className="text-[#ff9300]" />
            : <Pause size={16} className="text-ink-2" />
          }
        </button>
      </div>

      <div className="px-4 pt-4 pb-28 max-w-lg mx-auto space-y-4">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: currentTicket, label: "En cours" },
            { value: String(waitingCount), label: "En attente" },
            { value: String(servedCount), label: "Servis" },
          ].map(({ value, label }) => (
            <div key={label} className="bg-white rounded-[18px] border border-line shadow-1 p-3 text-center">
              <p className="text-base font-black text-ink leading-tight">{value}</p>
              <p className="text-[11px] text-ink-3 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Current ticket hero */}
        <motion.div
          className={`rounded-[22px] p-6 text-center ${
            isPaused
              ? "bg-surface-2 border-2 border-dashed border-line"
              : "bg-tornoo-green"
          }`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTicket}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 26 }}
            >
              <p className={`text-xs font-bold tracking-widest uppercase ${isPaused ? "text-ink-3" : "text-white/70"}`}>
                {isPaused ? "File en pause" : "Numéro en cours"}
              </p>
              <p className={`text-6xl font-black mt-1 ${isPaused ? "text-ink-3" : "text-white"}`}>
                {currentTicket}
              </p>
            </motion.div>
          </AnimatePresence>

          <button
            onClick={callNext}
            disabled={isCalling || waitingCount === 0 || isPaused}
            className={`mt-5 inline-flex items-center gap-2 h-11 px-6 rounded-[12px] font-bold text-sm transition-all active:scale-95 disabled:opacity-50 ${
              isPaused
                ? "bg-line text-ink-3"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            {isCalling ? (
              <span className="w-4 h-4 rounded-full border-2 border-white/50 border-t-white animate-spin" />
            ) : (
              <SkipForward size={16} />
            )}
            {waitingCount === 0
              ? "File vide"
              : isCalling
              ? "Appel en cours…"
              : `Appeler ${nextTicket}`}
          </button>
        </motion.div>

        {/* Client list */}
        <div className="bg-white rounded-[22px] border border-line shadow-1 overflow-hidden">
          <div className="px-4 pt-4 pb-2 flex items-center justify-between">
            <h3 className="font-black text-ink">Tickets</h3>
            <span className="text-xs text-ink-3 bg-surface-2 border border-line rounded-full px-2.5 py-0.5">
              {waitingCount} en attente
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
                    {c.status === "served" ? "Servi" : c.status === "current" ? "En cours de service" : "En attente"}
                  </p>
                </div>
                {c.status === "waiting" && (
                  <button
                    onClick={() => cancelWaiting(c.ticket)}
                    className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center"
                    aria-label={`Annuler ${c.ticket}`}
                  >
                    <X size={14} className="text-ink-3" />
                  </button>
                )}
                {c.status === "served" && (
                  <span className="text-xs text-tornoo-green font-bold">✓</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Close queue */}
        <button
          onClick={() => { toast("File fermée", "info"); router.replace("/pro/queues"); }}
          className="w-full h-12 rounded-[15px] bg-[#fde7e6] text-[#ef2b24] font-bold border border-[#f6c2bf] text-sm"
        >
          Fermer la file
        </button>
      </div>
    </div>
  );
}
