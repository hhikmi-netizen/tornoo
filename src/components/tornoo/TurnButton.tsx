"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Establishment } from "@/types";
import { useI18n } from "@/i18n/context";

interface TurnButtonProps {
  establishment: Establishment;
  className?: string;
}

const levelStyle = {
  low: "bg-tornoo-green text-white shadow-[0_4px_12px_rgba(7,152,74,.3)]",
  mod: "bg-tornoo-orange text-white shadow-[0_4px_12px_rgba(255,147,0,.3)]",
  high: "bg-[#fde7e6] text-[#ef2b24] border border-[#f6c2bf]",
};

export function TurnButton({ establishment: e, className }: TurnButtonProps) {
  const router = useRouter();
  const { t } = useI18n();

  const handleClick = (ev: React.MouseEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    if (e.waitLevel === "high") {
      router.push(`/establishment/${e.slug}`);
    } else {
      router.push(`/confirm?from=${e.slug}`);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "h-10 px-4 rounded-[15px] text-sm font-extrabold shrink-0 active:scale-[0.96] transition-transform",
        levelStyle[e.waitLevel],
        className
      )}
      aria-label={e.waitLevel === "high" ? t.seeDetails : t.takeTurn}
    >
      {e.waitLevel === "high" ? t.seeDetails : t.takeTurn}
    </button>
  );
}
