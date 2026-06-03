"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CaretLeft, Check, Lightning, Star } from "@phosphor-icons/react";
import { useToast } from "@/components/ui/Toast";

const PLANS = [
  {
    id: "free",
    name: "Gratuit",
    price: "0 DH",
    period: "/mois",
    color: "#5b6472",
    features: ["1 file d'attente", "Jusqu'à 50 tickets/jour", "Tableau de bord basique"],
    cta: "Plan actuel",
    current: true,
  },
  {
    id: "starter",
    name: "Starter",
    price: "299 DH",
    period: "/mois",
    color: "#07984a",
    features: ["3 files d'attente", "Tickets illimités", "Statistiques avancées", "Notifications WhatsApp"],
    cta: "Choisir Starter",
    current: false,
    popular: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "599 DH",
    period: "/mois",
    color: "#ff9300",
    features: ["Files illimitées", "Tickets illimités", "Tableau de bord complet", "Support prioritaire", "API accès"],
    cta: "Choisir Pro",
    current: false,
  },
];

export default function SubscriptionPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planId: string, planName: string) => {
    setLoading(planId);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(null);
    toast(`Plan ${planName} activé ! Bienvenue dans l'espace Pro.`, "success");
    setTimeout(() => router.replace("/pro"), 1000);
  };

  return (
    <div className="bg-surface-2 min-h-svh">
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm px-4 pt-safe-top pb-3 border-b border-line flex items-center gap-3">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center" aria-label="Retour">
          <CaretLeft weight="bold" size={20} />
        </button>
        <h1 className="flex-1 text-xl font-black text-ink">Abonnement</h1>
      </div>

      <div className="px-4 pt-4 pb-8 max-w-lg mx-auto space-y-4">
        <div className="text-center py-4">
          <div className="w-14 h-14 rounded-2xl bg-tornoo-green mx-auto flex items-center justify-center mb-3">
            <Lightning weight="fill" size={28} className="text-white" />
          </div>
          <h2 className="text-2xl font-black text-ink">Choisissez votre plan</h2>
          <p className="text-sm text-ink-3 mt-1">Sans engagement · Annulable à tout moment</p>
        </div>

        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-[22px] border-2 p-5 relative ${
              plan.popular ? "border-tornoo-green shadow-pop" : "border-line shadow-1"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-5 px-3 py-1 bg-tornoo-green text-white text-xs font-black rounded-full">
                <Star size={11} weight="fill" className="inline mr-1" />Populaire
              </div>
            )}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-black text-ink">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black" style={{ color: plan.color }}>{plan.price}</span>
                  <span className="text-sm text-ink-3">{plan.period}</span>
                </div>
              </div>
              {plan.current && (
                <span className="px-3 py-1 bg-surface-2 text-ink-3 rounded-full text-xs font-bold border border-line">
                  Actuel
                </span>
              )}
            </div>
            <div className="space-y-2 mb-4">
              {plan.features.map((f) => (
                <div key={f} className="flex items-center gap-2.5">
                  <Check weight="bold" size={15} style={{ color: plan.color }} className="shrink-0" />
                  <span className="text-sm font-medium text-ink-2">{f}</span>
                </div>
              ))}
            </div>
            {!plan.current && (
              <button
                onClick={() => handleSubscribe(plan.id, plan.name)}
                disabled={loading === plan.id}
                className="w-full h-12 rounded-[13px] font-extrabold text-sm text-white flex items-center justify-center gap-2 disabled:opacity-70 active:scale-[0.98] transition-all"
                style={{ background: plan.color }}
              >
                {loading === plan.id
                  ? <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  : plan.cta}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
