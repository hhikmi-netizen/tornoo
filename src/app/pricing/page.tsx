"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { PricingPage } from "@/components/tornoo/pricing/PricingPage";
import type { PlanType } from "@/types/pricing";

export default function PricingRoute() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSelectPlan = (planId: PlanType) => {
    if (planId === "free") {
      router.push("/pro-register");
      return;
    }
    toast(
      planId === "pro"
        ? "Plan Pro sélectionné — paiement bientôt disponible"
        : "Plan Premium sélectionné — paiement bientôt disponible",
      "info"
    );
  };

  return <PricingPage onSelectPlan={handleSelectPlan} />;
}
