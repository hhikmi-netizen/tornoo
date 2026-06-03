"use client";

import { Rocket, Diamond } from "@phosphor-icons/react";
import type { PricingPlan, PlanType } from "@/types/pricing";
import { PlanBadge } from "./PlanBadge";
import { PricingFeature } from "./PricingFeature";
import { PlanCTA } from "./PlanCTA";

function PlanIcon({ plan }: { plan: PricingPlan }) {
  const cls = "w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4";
  if (plan.id === "free") {
    return (
      <div className={cls} style={{ background: plan.iconBg }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L8 6H4l2 4-2 3h4l4 9 4-9h4l-2-3 2-4h-4L12 2z" stroke="white" strokeWidth="1.8" strokeLinejoin="round" fill="none" />
        </svg>
      </div>
    );
  }
  if (plan.id === "pro") {
    return (
      <div className={cls} style={{ background: plan.iconBg }}>
        <Rocket weight="fill" size={26} className="text-white" />
      </div>
    );
  }
  return (
    <div className={cls} style={{ background: plan.iconBg }}>
      <Diamond weight="fill" size={26} className="text-white" />
    </div>
  );
}

interface Props {
  plan: PricingPlan;
  onSelect: (planId: PlanType) => void;
}

export function PricingCard({ plan, onSelect }: Props) {
  const isPro = plan.popular;
  const isPremium = plan.id === "premium";

  return (
    <div
      className={`relative flex flex-col rounded-3xl bg-white p-7 transition-shadow ${
        isPro
          ? "border-2 shadow-xl shadow-[#009B5A]/15 -mx-0.5 lg:-mt-4 lg:scale-[1.02] z-10"
          : isPremium
          ? "border border-gray-200 shadow-md"
          : "border border-gray-200 shadow-md"
      }`}
      style={isPro ? { borderColor: "#009B5A" } : {}}
    >
      {isPro && <PlanBadge />}

      <PlanIcon plan={plan} />

      <h3 className="text-2xl font-black text-[#071A2A] text-center">{plan.name}</h3>

      <div className="mt-3 text-center">
        <span
          className="text-4xl font-black"
          style={{ color: plan.accentColor }}
        >
          {plan.price}
        </span>
        <span className="text-base font-bold text-gray-400 ml-1">
          {plan.currency}
        </span>
        <span className="text-sm text-gray-400"> / {plan.period}</span>
      </div>

      <p className="mt-3 text-sm text-gray-500 text-center leading-snug min-h-[2.8rem]">
        {plan.description}
      </p>

      <div className="mt-5 h-px bg-gray-100" />

      <ul className="mt-5 space-y-0.5 flex-1">
        {plan.features.map((f) => (
          <PricingFeature key={f.label} feature={f} accentColor={plan.accentColor} />
        ))}
      </ul>

      <div className="mt-7">
        <PlanCTA
          planId={plan.id}
          label={plan.ctaLabel}
          popular={plan.popular}
          accentColor={plan.accentColor}
          onSelect={onSelect}
        />
      </div>
    </div>
  );
}
