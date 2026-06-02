"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Ticket, Bell, CaretRight } from "@phosphor-icons/react";
import { MOCK_ESTABLISHMENTS, MOCK_TICKET } from "@/lib/mock-data";

export default function ConfirmPage() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("from");
  const establishment = slug
    ? MOCK_ESTABLISHMENTS.find((e) => e.slug === slug) ?? MOCK_ESTABLISHMENTS[0]
    : MOCK_ESTABLISHMENTS[0];

  return (
    <div className="min-h-svh bg-gradient-to-b from-low-bg to-white flex flex-col px-6">
      <div className="flex justify-end pt-safe-top pb-4">
        <Link href="/home" className="text-sm font-bold text-high">Annuler</Link>
      </div>

      {/* Animated check */}
      <div className="flex flex-col items-center mt-20">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
          className="w-36 h-36 rounded-full border-[14px] border-tornoo-green flex items-center justify-center bg-white shadow-[0_0_40px_rgba(7,152,74,.25)]"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
          >
            <Ticket weight="duotone" size={60} className="text-tornoo-green" />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-[28px] font-black text-ink text-center mt-8 leading-snug"
        >
          Vous êtes dans<br />la file d'attente !
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-ink-3 mt-2"
        >
          {establishment.name} · {establishment.category}
        </motion.p>
      </div>

      {/* Stats card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-[22px] border border-line shadow-1 grid grid-cols-3 divide-x divide-line mt-10"
      >
        <div className="p-4 text-center">
          <p className="text-xs font-semibold text-ink-2">Position</p>
          <p className="text-3xl font-black text-ink mt-1">{MOCK_TICKET.position}</p>
        </div>
        <div className="p-4 text-center">
          <p className="text-xs font-semibold text-ink-2">Attente</p>
          <p className="text-xl font-black text-ink mt-1">{MOCK_TICKET.estimatedWaitMinutes} min</p>
        </div>
        <div className="p-4 text-center">
          <p className="text-xs font-semibold text-ink-2">Arrivée</p>
          <p className="text-xl font-black text-ink mt-1">{MOCK_TICKET.estimatedTime}</p>
        </div>
      </motion.div>

      {/* Alert reminder */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-[22px] border border-line shadow-1 flex items-center gap-3 p-4 mt-4"
      >
        <div className="w-10 h-10 rounded-full bg-low-bg flex items-center justify-center">
          <Bell weight="duotone" size={18} className="text-tornoo-green" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm text-ink">Recevoir un rappel</p>
          <p className="text-xs text-ink-3">15 min avant mon tour</p>
        </div>
        <CaretRight weight="bold" size={16} className="text-ink-4" />
      </motion.div>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="mt-6 space-y-3"
      >
        <Link
          href={`/my-turn${slug ? `?from=${slug}` : ""}`}
          className="flex items-center justify-center h-14 rounded-[15px] bg-tornoo-green text-white font-extrabold w-full shadow-[0_4px_20px_rgba(7,152,74,.3)]"
        >
          Voir mon ticket
        </Link>
        <Link
          href="/home"
          className="flex items-center justify-center h-12 rounded-[15px] bg-surface-2 text-ink-2 font-bold border border-line w-full text-sm"
        >
          Retour à l'accueil
        </Link>
      </motion.div>
    </div>
  );
}
