"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CaretLeft, Ticket, CheckCircle, XCircle, Clock } from "@phosphor-icons/react";
import { MOCK_ESTABLISHMENTS } from "@/lib/mock-data";
import { WaitBadge } from "@/components/tornoo/WaitBadge";

const HISTORY = [
  { id: "h1", establishment: MOCK_ESTABLISHMENTS[0], service: "Coupe homme", date: "Aujourd'hui, 14:32", status: "served", waitMinutes: 7 },
  { id: "h2", establishment: MOCK_ESTABLISHMENTS[1], service: "Massage relaxant", date: "Hier, 11:15", status: "served", waitMinutes: 25 },
  { id: "h3", establishment: MOCK_ESTABLISHMENTS[2], service: "Consultation", date: "12 jan, 09:45", status: "cancelled", waitMinutes: 0 },
  { id: "h4", establishment: MOCK_ESTABLISHMENTS[3], service: "État civil", date: "08 jan, 10:00", status: "served", waitMinutes: 45 },
  { id: "h5", establishment: MOCK_ESTABLISHMENTS[0], service: "Coupe + barbe", date: "02 jan, 16:20", status: "served", waitMinutes: 15 },
];

const statusConfig = {
  served: { label: "Servi", icon: CheckCircle, color: "#07984a" },
  cancelled: { label: "Annulé", icon: XCircle, color: "#ef2b24" },
  waiting: { label: "En attente", icon: Clock, color: "#ff9300" },
};

export default function HistoryPage() {
  const router = useRouter();

  return (
    <div className="bg-surface-2 min-h-svh">
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm px-4 pt-safe-top pb-3 border-b border-line flex items-center gap-3">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center" aria-label="Retour">
          <CaretLeft weight="bold" size={20} />
        </button>
        <h1 className="text-xl font-black text-ink">Historique</h1>
        <span className="ml-auto text-xs font-bold text-ink-3 bg-surface-2 border border-line rounded-full px-3 py-1">
          {HISTORY.length} passages
        </span>
      </div>

      <div className="px-4 pt-4 pb-8 max-w-lg mx-auto space-y-3">
        {HISTORY.map((item, i) => {
          const s = statusConfig[item.status as keyof typeof statusConfig];
          const StatusIcon = s.icon;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-white rounded-[20px] border border-line shadow-1 p-4 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center shrink-0">
                <Ticket weight="duotone" size={18} className="text-ink-3" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-ink truncate">{item.establishment.name}</p>
                <p className="text-xs text-ink-3">{item.service}</p>
                <p className="text-[11px] text-ink-4 mt-0.5">{item.date}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className="flex items-center gap-1 text-xs font-bold" style={{ color: s.color }}>
                  <StatusIcon size={12} weight="fill" />
                  {s.label}
                </span>
                {item.status === "served" && item.waitMinutes > 0 && (
                  <WaitBadge minutes={item.waitMinutes} size="sm" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
