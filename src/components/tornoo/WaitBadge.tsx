import { cn, formatWaitTime, getWaitLevel } from "@/lib/utils";
import type { WaitLevel } from "@/types";

interface WaitBadgeProps {
  minutes: number;
  level?: WaitLevel;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const levelConfig = {
  low: { bg: "#e4f6ec", color: "#07984a", border: "#b6e6c9", dot: "#07984a" },
  mod: { bg: "#fff1de", color: "#ff9300", border: "#ffd9a6", dot: "#ff9300" },
  high: { bg: "#fde7e6", color: "#ef2b24", border: "#f6c2bf", dot: "#ef2b24" },
};

const levelLabel = {
  low: "Faible affluence",
  mod: "Affluence moyenne",
  high: "Forte affluence",
};

export function WaitBadge({ minutes, level, showLabel = false, size = "md", className }: WaitBadgeProps) {
  const lvl = level ?? getWaitLevel(minutes);
  const cfg = levelConfig[lvl];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-bold",
        size === "sm" && "px-2 py-0.5 text-xs",
        size === "md" && "px-3 py-1 text-sm",
        size === "lg" && "px-4 py-1.5 text-base",
        className
      )}
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
    >
      <span
        className="rounded-full shrink-0"
        style={{ width: 8, height: 8, background: cfg.dot }}
        aria-hidden="true"
      />
      {showLabel ? levelLabel[lvl] : formatWaitTime(minutes)}
    </span>
  );
}

interface WaitDotProps {
  level: WaitLevel;
  size?: number;
}

export function WaitDot({ level, size = 10 }: WaitDotProps) {
  const colors = { low: "#07984a", mod: "#ff9300", high: "#ef2b24" };
  return (
    <span
      className="rounded-full inline-block shrink-0"
      style={{ width: size, height: size, background: colors[level] }}
      aria-hidden="true"
    />
  );
}
