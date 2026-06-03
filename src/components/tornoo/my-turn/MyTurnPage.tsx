"use client";

import { motion } from "framer-motion";
import { MyTurnHeader } from "./MyTurnHeader";
import { MyTurnMainCard } from "./MyTurnMainCard";
import { EstablishmentMiniCard } from "./EstablishmentMiniCard";
import { useMyTurn } from "@/hooks/useMyTurn";

function LoadingState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
      <div className="w-64 h-64 rounded-full bg-[#EAF8F0] animate-pulse" />
      <div className="h-5 w-40 bg-[#EAF8F0] rounded-full animate-pulse" />
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-3">
      <div className="w-16 h-16 rounded-full bg-[#FDE7E6] flex items-center justify-center">
        <span className="text-2xl">✕</span>
      </div>
      <p className="font-bold text-[#071A2A]">Une erreur s&apos;est produite</p>
      <p className="text-sm text-[#667085]">{message}</p>
    </div>
  );
}

function CompletedState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-3">
      <div className="w-20 h-20 rounded-full bg-[#EAF8F0] flex items-center justify-center">
        <span className="text-4xl">✓</span>
      </div>
      <p className="font-black text-[#071A2A] text-xl">Service terminé</p>
      <p className="text-sm text-[#667085]">Merci pour votre visite. À bientôt !</p>
    </div>
  );
}

function CancelledState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-3">
      <div className="w-20 h-20 rounded-full bg-[#FDE7E6] flex items-center justify-center">
        <span className="text-4xl">✕</span>
      </div>
      <p className="font-black text-[#071A2A] text-xl">Ticket annulé</p>
      <p className="text-sm text-[#667085]">Votre ticket a été annulé. Vous pouvez reprendre un nouveau tour.</p>
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-3">
      <p className="font-black text-[#071A2A] text-xl">Ticket introuvable</p>
      <p className="text-sm text-[#667085]">Aucun tour actif pour le moment.</p>
    </div>
  );
}

interface Props {
  ticketId?: string;
}

export function MyTurnPage({ ticketId }: Props) {
  const { ticket, isLoading, error, callEstablishment } = useMyTurn(ticketId);

  return (
    <div className="min-h-svh bg-[#F8FAFC] flex flex-col">
      <MyTurnHeader />

      {/* Page title */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="text-center px-4 pb-5"
      >
        <h1 className="text-2xl font-black text-[#071A2A]">Mon tour</h1>
        <div className="flex items-center justify-center gap-2 mt-1 text-[#009B5A]">
          <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden>
            <path d="M1 6 Q3 1 5 6 Q7 11 9 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </svg>
          <span className="text-sm font-semibold text-[#667085]">Position en temps réel</span>
          <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden>
            <path d="M1 6 Q3 1 5 6 Q7 11 9 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </svg>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="flex-1 flex flex-col px-4 gap-4 pb-8 max-w-lg mx-auto w-full">
        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : !ticket ? (
          <NotFoundState />
        ) : ticket.status === "completed" ? (
          <CompletedState />
        ) : ticket.status === "cancelled" ? (
          <CancelledState />
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <MyTurnMainCard ticket={ticket} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.25 }}
            >
              <EstablishmentMiniCard
                name={ticket.establishmentName}
                serviceName={ticket.serviceName}
                phone={ticket.establishmentPhone}
                onCall={callEstablishment}
              />
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
