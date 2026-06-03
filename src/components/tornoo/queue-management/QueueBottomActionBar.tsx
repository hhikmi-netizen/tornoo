"use client";
import { UserPlus, SpeakerHigh, CheckCircle, Pause, Play, XCircle } from "@phosphor-icons/react";
import type { ProQueue } from "@/types/queue";

interface QueueBottomActionBarProps {
  queue: ProQueue;
  onAdd: () => void;
  onCallNext: () => void;
  onFinish: () => void;
  onSuspend: () => void;
  onResume: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function QueueBottomActionBar({ queue, onAdd, onCallNext, onFinish, onSuspend, onResume, onCancel, isLoading }: QueueBottomActionBarProps) {
  const isSuspended = queue.status === "paused";

  const actions = [
    { label: "Ajouter", icon: <UserPlus size={20} weight="duotone" />, bg: "#009B5A", onClick: onAdd },
    { label: "Appeler", icon: <SpeakerHigh size={20} weight="duotone" />, bg: "#062E24", onClick: onCallNext },
    { label: "Terminer", icon: <CheckCircle size={20} weight="duotone" />, bg: "#2563EB", onClick: onFinish },
    {
      label: isSuspended ? "Reprendre" : "Suspendre",
      icon: isSuspended ? <Play size={20} weight="duotone" /> : <Pause size={20} weight="duotone" />,
      bg: "#FF9800",
      onClick: isSuspended ? onResume : onSuspend,
    },
    { label: "Annuler", icon: <XCircle size={20} weight="duotone" />, bg: "#EF2B24", onClick: onCancel },
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-200 safe-bottom lg:hidden">
      <div className="flex max-w-lg mx-auto">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            disabled={isLoading}
            className="flex-1 h-14 flex flex-col items-center justify-center gap-0.5 text-white text-xs font-bold disabled:opacity-50 transition-opacity"
            style={{ backgroundColor: action.bg }}
          >
            {action.icon}
            <span className="text-[10px] font-bold leading-none">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
