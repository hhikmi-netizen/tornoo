import type { PlanType } from "@/types/pricing";

interface Props {
  planId: PlanType;
  label: string;
  popular?: boolean;
  accentColor: string;
  onSelect: (planId: PlanType) => void;
}

export function PlanCTA({ planId, label, popular, accentColor, onSelect }: Props) {
  const base = "w-full h-13 rounded-2xl font-bold text-sm transition-all active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2";

  if (popular) {
    return (
      <button
        onClick={() => onSelect(planId)}
        className={`${base} text-white shadow-lg`}
        style={{ background: accentColor, focusOutlineColor: accentColor } as React.CSSProperties}
        aria-label={label}
      >
        {label}
      </button>
    );
  }

  if (planId === "premium") {
    return (
      <button
        onClick={() => onSelect(planId)}
        className={`${base} text-white`}
        style={{ background: "#2563EB" }}
        aria-label={label}
      >
        {label}
      </button>
    );
  }

  return (
    <button
      onClick={() => onSelect(planId)}
      className={`${base} bg-white border-2 font-bold`}
      style={{ borderColor: accentColor, color: accentColor }}
      aria-label={label}
    >
      {label}
    </button>
  );
}
