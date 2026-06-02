"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/services/api";
import { WaitDot } from "@/components/tornoo/WaitBadge";
import { useToast } from "@/components/ui/Toast";

export default function TicketPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();

  const { data: ticket, isLoading } = useQuery({
    queryKey: ["ticket", id],
    queryFn: () => id === "current" ? api.tickets.active() : api.tickets.byId(id),
  });

  const cancelMutation = useMutation({
    mutationFn: () => api.tickets.cancel(ticket?.id ?? ""),
    onSuccess: () => {
      toast("Vous avez quitté la file", "info");
      router.replace("/home");
    },
  });

  if (isLoading) return (
    <div className="min-h-svh bg-surface-2 flex items-center justify-center">
      <div className="animate-pulse text-ink-3 font-medium">Chargement...</div>
    </div>
  );

  if (!ticket) return (
    <div className="min-h-svh flex items-center justify-center">
      <p className="text-ink-2 font-bold">Ticket introuvable</p>
    </div>
  );

  return (
    <div className="bg-surface-2 min-h-svh">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-safe-top pb-3 bg-white border-b border-line">
        <button onClick={() => router.back()} aria-label="Retour" className="flex items-center gap-1.5 text-ink-2">
          <ChevronLeft size={20} />
          <span className="font-bold text-sm">Retour</span>
        </button>
        <div className="flex-1" />
        <span className="flex items-center gap-1.5 px-3 py-1 bg-low-bg text-tornoo-green rounded-full text-xs font-bold border border-low-rim">
          <WaitDot level="low" size={7} />
          File ouverte
        </span>
      </div>

      <div className="px-4 pt-4 pb-8 max-w-lg mx-auto space-y-4">
        <div>
          <p className="text-sm text-ink-3">Service sélectionné</p>
          <h1 className="text-2xl font-black text-ink">{ticket.serviceName}</h1>
        </div>

        {/* Ticket number */}
        <div className="bg-white rounded-[22px] border border-line shadow-1 p-8 text-center">
          <p className="text-xs font-bold text-ink-3 tracking-widest">VOTRE NUMÉRO</p>
          <div className="text-7xl font-black mt-3 leading-none">
            <span className="text-tornoo-green">{ticket.number.split("-")[0]}-</span>
            <span className="text-ink">{ticket.number.split("-")[1]}</span>
          </div>
          <p className="text-lg mt-3">
            <span className="font-black text-tornoo-green">{ticket.position}</span>
            <span className="text-ink-2"> personnes avant vous</span>
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-[22px] border border-line shadow-1 p-4">
            <p className="text-xs font-bold text-ink-3 tracking-widest">NUMÉRO EN COURS</p>
            <p className="text-2xl font-black text-tornoo-green mt-2">A-045</p>
          </div>
          <div className="bg-white rounded-[22px] border border-line shadow-1 p-4">
            <p className="text-xs font-bold text-ink-3 tracking-widest">TEMPS D'ATTENTE</p>
            <p className="text-2xl font-black text-tornoo-green mt-2">
              {ticket.estimatedWaitMinutes}{" "}
              <span className="text-sm">min</span>
            </p>
          </div>
        </div>

        {/* Leave button */}
        <button
          onClick={() => cancelMutation.mutate()}
          disabled={cancelMutation.isPending}
          className="w-full h-14 rounded-[15px] bg-[#fde7e6] text-[#ef2b24] font-extrabold border border-[#f6c2bf] text-sm disabled:opacity-60 transition-opacity active:scale-[0.98]"
        >
          {cancelMutation.isPending ? "Annulation..." : "Quitter la file"}
        </button>

        {/* Useful info */}
        <div className="bg-white rounded-[22px] border border-line shadow-1 p-4">
          <h3 className="font-black text-ink mb-1">Informations utiles</h3>
          {[
            `Horaires d'ouverture 09:00 - 17:00`,
            "Documents nécessaires",
            "Recevoir une alerte",
          ].map((item) => (
            <div key={item} className="flex items-center justify-between py-3.5 border-b last:border-0 border-line">
              <span className="text-sm font-medium text-ink">{item}</span>
              <ChevronLeft size={16} className="text-ink-3 rotate-180" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
