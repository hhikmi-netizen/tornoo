"use client";
import { UserPlus, SpeakerHigh, CheckCircle, Pause, Play, XCircle, CaretRight } from "@phosphor-icons/react";
import type { ProQueue } from "@/types/queue";

interface QuickActionsPanelProps {
  queue: ProQueue;
  onAdd: () => void;
  onCallNext: () => void;
  onFinish: () => void;
  onSuspend: () => void;
  onResume: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

interface ActionRowProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
  onClick: () => void;
  disabled?: boolean;
}

function ActionRow({ icon, iconBg, title, subtitle, onClick, disabled }: ActionRowProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100 hover:bg-gray-50 transition-colors disabled:opacity-50 text-left"
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: iconBg }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
      <CaretRight size={16} weight="bold" className="text-gray-300 shrink-0" />
    </button>
  );
}

export function QuickActionsPanel({ queue, onAdd, onCallNext, onFinish, onSuspend, onResume, onCancel, isLoading }: QuickActionsPanelProps) {
  const isSuspended = queue.status === "paused";

  return (
    <div>
      <h2 className="font-bold text-base text-gray-900 mb-3">Actions rapides</h2>
      <div className="space-y-2">
        <ActionRow
          icon={<UserPlus size={20} weight="duotone" color="#009B5A" />}
          iconBg="#E8F5E9"
          title="Ajouter un client"
          subtitle="Ajouter manuellement"
          onClick={onAdd}
          disabled={isLoading}
        />
        <ActionRow
          icon={<SpeakerHigh size={20} weight="duotone" color="#062E24" />}
          iconBg="#E0F2E9"
          title="Appeler suivant"
          subtitle="Appeler le client suivant"
          onClick={onCallNext}
          disabled={isLoading}
        />
        <ActionRow
          icon={<CheckCircle size={20} weight="duotone" color="#2563EB" />}
          iconBg="#EFF6FF"
          title="Terminer"
          subtitle="Terminer le service actuel"
          onClick={onFinish}
          disabled={isLoading}
        />
        <ActionRow
          icon={isSuspended
            ? <Play size={20} weight="duotone" color="#FF9800" />
            : <Pause size={20} weight="duotone" color="#FF9800" />}
          iconBg="#FFF3E0"
          title={isSuspended ? "Reprendre la file" : "Suspendre la file"}
          subtitle={isSuspended ? "Réactiver les inscriptions" : "Suspendre temporairement"}
          onClick={isSuspended ? onResume : onSuspend}
          disabled={isLoading}
        />
        <ActionRow
          icon={<XCircle size={20} weight="duotone" color="#EF2B24" />}
          iconBg="#FDE7E6"
          title="Annuler"
          subtitle="Annuler la file d'attente"
          onClick={onCancel}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
