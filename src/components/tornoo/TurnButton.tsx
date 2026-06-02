"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Establishment } from "@/types";

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
        "h-10 px-4 rounded-[15px] text-sm font-extrabold shrink-0",
        levelStyle[e.waitLevel],
        className
      )}
      aria-label={e.waitLevel === "high" ? "Voir les détails" : "Prendre mon tour"}
    >
      {e.waitLevel === "high" ? "Voir détails" : "Prendre mon tour"}
    </button>
  );
}
