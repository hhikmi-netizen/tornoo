"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CaretLeft, CheckCircle, Clock } from "@phosphor-icons/react";
import { MOCK_ESTABLISHMENTS, MOCK_QUEUES } from "@/lib/mock-data";

export default function NewQueuePage() {
  const router = useRouter();
  const services = MOCK_ESTABLISHMENTS[0].services;
  const [issued, setIssued] = useState<{ serviceName: string; ticketNum: string } | null>(null);

  const issueTicket = (serviceName: string) => {
    const queue = MOCK_QUEUES[0];
    const nextNum = parseInt(queue.currentTicket.split("-")[1], 10) + queue.waitingCount + 1;
    const ticketNum = `${queue.label}-${String(nextNum).padStart(3, "0")}`;
    setIssued({ serviceName, ticketNum });
  };

  if (issued) {
    return (
      <div className="bg-gradient-to-b from-low-bg to-white min-h-svh flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 20 }}
          className="w-28 h-28 rounded-full border-[12px] border-tornoo-green bg-white flex items-center justify-center shadow-[0_0_36px_rgba(7,152,74,.25)]"
        >
          <CheckCircle weight="fill" size={52} className="text-tornoo-green" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-[28px] font-black text-ink text-center mt-8 leading-snug"
        >
          Ticket émis !
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-ink-3 mt-2 text-center"
        >
          {issued.serviceName}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-[22px] border border-line shadow-1 px-10 py-6 mt-8 text-center"
        >
          <p className="text-xs font-bold text-ink-3 tracking-widest uppercase">Numéro attribué</p>
          <p className="text-6xl font-black mt-2 text-tornoo-green leading-none">{issued.ticketNum}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="w-full space-y-3 mt-8"
        >
          <button
            onClick={() => router.replace("/pro/queues")}
            className="w-full h-14 rounded-[15px] bg-tornoo-green text-white font-extrabold shadow-[0_4px_20px_rgba(7,152,74,.3)]"
          >
            Voir la file d'attente
          </button>
          <button
            onClick={() => setIssued(null)}
            className="w-full h-12 rounded-[15px] bg-surface-2 text-ink-2 font-bold border border-line text-sm"
          >
            Émettre un autre ticket
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-surface-2 min-h-svh">
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm px-4 pt-safe-top pb-3 border-b border-line flex items-center gap-3">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center" aria-label="Retour">
          <CaretLeft weight="bold" size={20} />
        </button>
        <h1 className="text-xl font-black text-ink">Nouveau ticket</h1>
      </div>
      <div className="px-4 pt-4 pb-8 max-w-lg mx-auto space-y-4">
        <p className="text-sm text-ink-3">Sélectionnez un service pour émettre un ticket</p>
        <AnimatePresence>
          <div className="space-y-2">
            {services.map((s, i) => (
              <motion.button
                key={s.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => issueTicket(s.name)}
                className="w-full flex items-center justify-between bg-white rounded-[18px] px-4 py-4 border border-line shadow-1 text-left active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-low-bg flex items-center justify-center">
                    <Clock weight="duotone" size={17} className="text-tornoo-green" />
                  </div>
                  <div>
                    <p className="font-bold text-ink">{s.name}</p>
                    <p className="text-xs text-ink-3">{s.durationMinutes} min{s.price ? ` · ${s.price} ${s.currency}` : ""}</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-xl bg-tornoo-green flex items-center justify-center">
                  <CaretLeft weight="bold" size={16} className="text-white rotate-180" />
                </div>
              </motion.button>
            ))}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
}
