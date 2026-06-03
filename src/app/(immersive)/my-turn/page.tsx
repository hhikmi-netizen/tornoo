"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { motion } from "framer-motion";
import { CaretLeft, ShareNetwork, Bell, Phone, CheckCircle } from "@phosphor-icons/react";
import { api } from "@/services/api";
import { MOCK_ESTABLISHMENTS } from "@/lib/mock-data";
import { WaitDot } from "@/components/tornoo/WaitBadge";
import { useToast } from "@/components/ui/Toast";
import { useI18n } from "@/i18n/context";

function buildTimeline(position: number) {
  const rows = [];
  for (let i = 1; i <= Math.min(position + 1, 5); i++) {
    if (i < position) rows.push({ label: `Client #${i}`, sub: "Servi", done: true, current: false, badge: null });
    else if (i === position) rows.push({ label: "Vous", sub: `Position #${position}`, done: false, current: true, badge: null });
    else rows.push({ label: `Client suivant`, sub: "En attente", done: false, current: false, badge: null });
  }
  return rows;
}

export default function MyTurnPage() {
  const router = useRouter();
  const { t } = useI18n();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const fromSlug = searchParams.get("from");

  const establishment = fromSlug
    ? MOCK_ESTABLISHMENTS.find((e) => e.slug === fromSlug) ?? MOCK_ESTABLISHMENTS[0]
    : MOCK_ESTABLISHMENTS[0];

  const { data: ticket } = useQuery({
    queryKey: ["ticket", "active"],
    queryFn: () => api.tickets.active(),
  });

  const cancelMutation = useMutation({
    mutationFn: () => api.tickets.cancel(ticket?.id ?? ""),
    onSuccess: () => {
      toast("Vous avez quitté la file d'attente", "info");
      router.replace("/home");
    },
  });

  const position = ticket?.position ?? 3;
  const waitMins = ticket?.estimatedWaitMinutes ?? 7;
  const arrivalTime = ticket?.estimatedTime ?? "14:32";
  const ringPct = Math.max(0.12, 1 - Math.min(position / 10, 0.88));
  const CIRCUMFERENCE = 314;
  const timeline = buildTimeline(position);

  const handleAlert = (label: string) => {
    toast(`Alerte programmée : ${label}`, "success");
  };

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
        <div className="flex-1 text-center">
          <h1 className="font-black text-base text-ink">Tornoo</h1>
          <div className="flex items-center justify-center gap-1.5 text-xs text-ink-3">
            <WaitDot level="low" size={7} />
            <span>{t.position} · {t.realtimeQueue}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => toast("Lien copié !", "success")}
            className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center"
            aria-label="Partager"
          >
            <ShareNetwork weight="bold" size={17} className="text-ink-2" />
          </button>
          <button
            onClick={() => toast("Notifications activées", "success")}
            className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center"
            aria-label="Notifications"
          >
            <Bell weight="fill" size={17} className="text-ink-2" />
          </button>
        </div>
      </div>

      <div className="px-4 pb-8 max-w-lg mx-auto space-y-4 pt-4">
        {/* Position ring */}
        <div className="flex justify-center py-2">
          <div className="relative w-52 h-52">
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#eaedf0" strokeWidth="14" />
              <motion.circle
                cx="60" cy="60" r="50"
                fill="none"
                stroke="#07984a"
                strokeWidth="14"
                strokeLinecap="round"
                initial={{ strokeDasharray: `0 ${CIRCUMFERENCE}` }}
                animate={{ strokeDasharray: `${ringPct * CIRCUMFERENCE} ${CIRCUMFERENCE}` }}
                transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
              />
              <motion.circle
                cx="60" cy="60" r="50"
                fill="none"
                stroke="#ff9300"
                strokeWidth="14"
                strokeLinecap="round"
                initial={{ strokeDasharray: `0 ${CIRCUMFERENCE}`, strokeDashoffset: `-${ringPct * CIRCUMFERENCE}` }}
                animate={{ strokeDasharray: `${(1 - ringPct) * CIRCUMFERENCE * 0.4} ${CIRCUMFERENCE}`, strokeDashoffset: `-${ringPct * CIRCUMFERENCE}` }}
                transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="text-xs text-ink-3 font-semibold">{t.position}</p>
              <motion.span
                className="text-6xl font-black text-ink leading-none"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3, type: "spring" }}
              >
                #{position}
              </motion.span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-[22px] border border-line shadow-1 grid grid-cols-2 divide-x divide-line"
        >
          <div className="p-4">
            <p className="text-xs text-ink-3 font-medium">{t.estimatedWait}</p>
            <p className="text-3xl font-black text-tornoo-green mt-1">{waitMins} min</p>
            <p className="text-xs text-ink-3 mt-0.5">{t.mins}</p>
          </div>
          <div className="p-4">
            <p className="text-xs text-ink-3 font-medium">{t.expectedTime}</p>
            <p className="text-3xl font-black text-ink mt-1">{arrivalTime}</p>
            <p className="text-xs text-ink-3 mt-0.5">{t.today}</p>
          </div>
        </motion.div>

        {/* Establishment */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-[22px] border border-line shadow-1 flex items-center gap-3 p-3"
        >
          <div className="w-20 h-[72px] rounded-2xl overflow-hidden shrink-0">
            <ImageWithFallback
              src={establishment.imageUrl}
              alt={establishment.name}
              width={80}
              height={72}
              className="w-full h-full object-cover"
              fallback={
                <div className="w-full h-full flex items-center justify-center bg-low-bg">
                  <span className="text-2xl font-black text-tornoo-green">{establishment.name.charAt(0)}</span>
                </div>
              }
            />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-black text-lg text-ink truncate">{establishment.name}</h2>
            <p className="text-sm text-ink-3">{establishment.category}</p>
            <p className="text-xs text-ink-3">{establishment.city}</p>
          </div>
          {establishment.phone && (
            <a
              href={`tel:${establishment.phone}`}
              className="w-12 h-12 rounded-full bg-low-bg flex items-center justify-center shrink-0"
              aria-label="Appeler"
            >
              <Phone weight="fill" size={20} className="text-tornoo-green" />
            </a>
          )}
        </motion.div>

        {/* Queue timeline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-[22px] border border-line shadow-1 p-4"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-ink">{t.queue}</h3>
            <p className="text-xs text-ink-3">{t.updatedAgo} 1 min</p>
          </div>
          <div className="space-y-2">
            {timeline.map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.08 }}
                className={`flex items-center gap-3 p-3 rounded-2xl ${row.current ? "bg-low-bg" : ""}`}
              >
                <span
                  className="w-4 h-4 rounded-full shrink-0"
                  style={{
                    background: row.done || row.current ? "#07984a" : "transparent",
                    border: row.done || row.current ? "none" : "1.5px solid #c7cdd6",
                  }}
                />
                <div className="flex-1">
                  <b className={row.current ? "text-tornoo-green text-sm" : "text-ink text-sm"}>{row.label}</b>
                  <p className="text-xs text-ink-3">{row.sub}</p>
                </div>
                {row.current && (
                  <span className="px-2.5 py-1 rounded-full bg-low-bg text-tornoo-green text-xs font-bold border border-low-rim">
                    ~ {waitMins} min
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Alert options */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-[22px] border border-line shadow-1 p-4"
        >
          <h3 className="font-black text-ink">{t.alertMe}</h3>
          <p className="text-xs text-ink-3 mt-0.5 mb-3">{t.alertSub}</p>
          <div className="grid grid-cols-4 gap-2">
            {["15 min", "10 min", "5 min", "Mon tour"].map((label, i) => (
              <button
                key={label}
                onClick={() => handleAlert(label)}
                className={`h-11 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                  i === 2
                    ? "border-2 border-tornoo-green text-tornoo-green bg-low-bg"
                    : "border border-line text-ink-2 bg-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-2 gap-2"
        >
          {[
            { label: t.onMyWay, danger: false },
            { label: t.arrived, icon: CheckCircle, danger: false },
            { label: t.delayTurn, danger: false },
            { label: t.leaveQueue, danger: true },
          ].map(({ label, danger }) => (
            <button
              key={label}
              onClick={danger ? () => cancelMutation.mutate() : () => toast(label, "success")}
              className={`min-h-[68px] rounded-[18px] p-3 flex items-center justify-center text-sm font-bold text-center leading-tight border transition-all active:scale-95 ${
                danger
                  ? "bg-high-bg text-high border-high-rim"
                  : "bg-surface-2 text-ink-2 border-line"
              }`}
            >
              {cancelMutation.isPending && danger ? "..." : label}
            </button>
          ))}
        </motion.div>

        {/* Tip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="p-5 rounded-[22px] bg-grad-navy text-white"
        >
          <p className="font-black text-tornoo-green text-sm">{t.tornooTip}</p>
          <p className="text-sm mt-1.5 text-white/75 leading-relaxed">{t.tornooTipText}</p>
        </motion.div>
      </div>
    </div>
  );
}
