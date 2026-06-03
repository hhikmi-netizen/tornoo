import { Clock } from "@phosphor-icons/react";
import type { QRWaitStatus } from "@/types/qr";

interface StatusProps {
  status: QRWaitStatus;
}

const STATUS_MAP: Record<QRWaitStatus, { label: string; bg: string; color: string; dot: string }> = {
  low:    { label: "Peu d'attente",   bg: "#E8F5E9", color: "#1B5E20", dot: "#43A047" },
  medium: { label: "Attente modérée", bg: "#FFF8E1", color: "#E65100", dot: "#FF9800" },
  high:   { label: "Forte affluence", bg: "#FFEBEE", color: "#C62828", dot: "#EF2B24" },
  closed: { label: "Fermé",           bg: "#F5F5F5", color: "#424242", dot: "#9E9E9E" },
};

export function QRStatusBadge({ status }: StatusProps) {
  const s = STATUS_MAP[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-xs font-bold"
      style={{ background: s.bg, color: s.color }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
      {s.label}
    </span>
  );
}

interface WaitBadgeProps {
  minutes: number;
}

export function QRWaitBadge({ minutes }: WaitBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-xs font-bold bg-[#F5F5F5] text-[#424242]">
      <Clock weight="duotone" size={12} />
      ≈ {minutes} min
    </span>
  );
}
