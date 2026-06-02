"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { CaretLeft, Bell, Ticket, Tag, Info } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/services/api";
import type { Notification } from "@/types";
import { cn } from "@/lib/utils";
import { NotifSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "À l'instant";
  if (diff < 3600) return `${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}j`;
}

const typeIcon = { turn: Bell, reminder: Ticket, promo: Tag, system: Info };

const typeColor: Record<Notification["type"], string> = {
  turn: "#07984a",
  reminder: "#ff9300",
  promo: "#f7c400",
  system: "#5b6472",
};

export default function NotificationsPage() {
  const router = useRouter();
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => api.notifications.list(),
  });

  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    if (!seeded && notifications.length > 0) {
      setReadIds(new Set(notifications.filter((n) => n.read).map((n) => n.id)));
      setSeeded(true);
    }
  }, [notifications, seeded]);

  const markAllRead = () => setReadIds(new Set(notifications.map((n) => n.id)));
  const markRead = (id: string) => setReadIds((prev) => new Set([...prev, id]));

  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length;

  return (
    <div className="bg-white min-h-svh">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm px-4 pt-safe-top pb-3 border-b border-line flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center"
          aria-label="Retour"
        >
          <CaretLeft weight="bold" size={20} />
        </button>
        <h1 className="flex-1 text-xl font-black text-ink">Notifications</h1>
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={markAllRead}
              className="text-sm font-bold text-tornoo-green"
            >
              Tout marquer
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="px-4 pb-6 max-w-lg mx-auto">
        {isLoading ? (
          <div className="space-y-3 pt-4">
            {[1, 2, 3].map((i) => <NotifSkeleton key={i} />)}
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState
            type="notifications"
            title="Aucune notification"
            subtitle="Vous serez notifié quand votre tour approche"
          />
        ) : (
          <div className="pt-4 space-y-2">
            {notifications.map((n, i) => {
              const Icon = typeIcon[n.type];
              const color = typeColor[n.type];
              const isRead = readIds.has(n.id);
              return (
                <motion.button
                  key={n.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => markRead(n.id)}
                  className={cn(
                    "w-full text-left flex items-start gap-3 p-4 rounded-[18px] border border-line transition-colors",
                    isRead ? "bg-white" : ""
                  )}
                  style={!isRead ? { background: `${color}12` } : undefined}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: `${color}18` }}
                  >
                    <Icon size={18} weight="duotone" style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn("font-bold text-sm", isRead ? "text-ink-2" : "text-ink")}>{n.title}</p>
                    <p className="text-xs text-ink-3 mt-0.5 leading-relaxed">{n.body}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-xs text-ink-3">{timeAgo(n.createdAt)}</span>
                    {!isRead && <span className="w-2 h-2 rounded-full" style={{ background: color }} aria-hidden="true" />}
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
