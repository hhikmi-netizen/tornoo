"use client";

import { useRouter } from "next/navigation";
import { CaretLeft } from "@phosphor-icons/react";
import { useToast } from "@/components/ui/Toast";
import { PricingPage } from "@/components/tornoo/pricing/PricingPage";
import type { PlanType } from "@/types/pricing";

export default function SubscriptionPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSelectPlan = (planId: PlanType) => {
    if (planId === "free") {
      toast("Vous êtes déjà sur le plan Gratuit", "info");
      return;
    }
    toast(
      planId === "pro"
        ? "Plan Pro sélectionné — paiement bientôt disponible"
        : "Plan Premium sélectionné — paiement bientôt disponible",
      "info"
    );
  };

  return (
    <div>
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
          aria-label="Retour"
        >
          <CaretLeft weight="bold" size={18} className="text-[#071A2A]" />
        </button>
        <span className="font-black text-base text-[#071A2A]">Abonnement</span>
      </div>
      <PricingPage currentPlan="free" onSelectPlan={handleSelectPlan} />
    </div>
  );
}
