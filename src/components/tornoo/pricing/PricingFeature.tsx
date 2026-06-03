import { CheckCircle, MinusCircle } from "@phosphor-icons/react";
import type { PlanFeature } from "@/types/pricing";

interface Props {
  feature: PlanFeature;
  accentColor: string;
}

export function PricingFeature({ feature, accentColor }: Props) {
  return (
    <li className="flex items-center gap-2.5 py-1">
      {feature.included ? (
        <CheckCircle weight="fill" size={18} style={{ color: accentColor }} className="shrink-0" />
      ) : (
        <MinusCircle weight="fill" size={18} className="text-gray-300 shrink-0" />
      )}
      <span className={`text-sm ${feature.included ? "text-[#071A2A] font-medium" : "text-gray-400"}`}>
        {feature.label}
      </span>
    </li>
  );
}
