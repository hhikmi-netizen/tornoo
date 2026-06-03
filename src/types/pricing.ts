export type PlanType = "free" | "pro" | "premium";

export interface PlanFeature {
  label: string;
  included: boolean;
}

export interface PricingPlan {
  id: PlanType;
  name: string;
  price: number;
  currency: string;
  period: string;
  description: string;
  features: PlanFeature[];
  popular?: boolean;
  ctaLabel: string;
  accentColor: string;
  iconBg: string;
}
