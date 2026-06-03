"use client";

import { PRICING_PLANS } from "@/data/pricingPlans";
import type { PlanType } from "@/types/pricing";
import { PricingCard } from "./PricingCard";
import { PricingTrustBar } from "./PricingTrustBar";
import { PricingFAQ } from "./PricingFAQ";

interface Props {
  currentPlan?: PlanType;
  onSelectPlan: (planId: PlanType) => void;
}

export function PricingPage({ currentPlan, onSelectPlan }: Props) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-black tracking-[0.2em] uppercase text-[#009B5A] mb-3">
            Business Model
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-[#071A2A] leading-tight">
            Choisissez le plan qui vous convient
          </h1>
          <p className="mt-3 text-base text-gray-500 max-w-md mx-auto">
            Des formules simples et transparentes pour accompagner votre croissance.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-5 items-start lg:items-end">
          {PRICING_PLANS.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              onSelect={onSelectPlan}
            />
          ))}
        </div>

        {/* Trust bar */}
        <PricingTrustBar />

        {/* FAQ */}
        <PricingFAQ />
      </div>
    </div>
  );
}
