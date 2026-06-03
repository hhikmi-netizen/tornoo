"use client";

import { useEffect, useRef, Suspense } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { haptic } from "@/lib/haptic";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { motion } from "framer-motion";
import {
  CaretLeft,
  ShareNetwork,
  Bell,
  Phone,
  NavigationArrow,
  MapPin,
  X,
  ClockCounterClockwise,
  Star,
} from "@phosphor-icons/react";
import { gsap } from "@/lib/gsap";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { api } from "@/services/api";
import { MOCK_ESTABLISHMENTS } from "@/lib/mock-data";
import { WaitDot } from "@/components/tornoo/WaitBadge";
import { useToast } from "@/components/ui/Toast";
import { useI18n } from "@/i18n/context";
import { scheduleLocalNotification } from "@/lib/notifications";

// ─── Horseshoe Arc ──────────────────────────────────────────────────────────

const ARC_PATH = "M 61 167.5 A 78 78 0 1 1 139 167.5";

interface HorseshoeArcProps {
  position: number;
  total: number;
}

function HorseshoeArc({ position, total }: HorseshoeArcProps) {
  const fraction = total <= 1 ? 0 : (position - 1) / (total - 1);
  // angle: 120° at start (bottom-left), 120 + 300 = 420° = 60° at end (bottom-right)
  // going clockwise through top
  const angleDeg = 120 + fraction * 300;
  const angleRad = (angleDeg * Math.PI) / 180;
  const cx = 100;
  const cy = 100;
  const r = 78;
  const dotX = cx + r * Math.cos(angleRad);
  const dotY = cy + r * Math.sin(angleRad);

  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden>
      <defs>
        <linearGradient
          id="arcGrad"
          gradientUnits="userSpaceOnUse"
          x1="10"
          y1="0"
          x2="190"
          y2="0"
        >
          <stop offset="0%" stopColor="#07984a" />
          <stop offset="40%" stopColor="#f7c400" />
          <stop offset="70%" stopColor="#ff9300" />
          <stop offset="100%" stopColor="#ef2b24" />
        </linearGradient>
      </defs>

      {/* Gray track */}
      <path
        d={ARC_PATH}
        fill="none"
        stroke="#eaedf0"
        strokeWidth="16"
        strokeLinecap="round"
      />

      {/* Colored gradient arc */}
      <path
        d={ARC_PATH}
        fill="none"
        stroke="url(#arcGrad)"
        strokeWidth="16"
        strokeLinecap="round"
      />

      {/* Indicator dot — white circle + green stroke + small green center */}
      <circle cx={dotX} cy={dotY} r="11" fill="white" stroke="#07984a" strokeWidth="3" />
      <circle cx={dotX} cy={dotY} r="4" fill="#07984a" />
    </svg>
  );
}

// ─── Main content ────────────────────────────────────────────────────────────

function MyTurnContent() {
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
      toast(t.leaveQueue, "info");
      router.replace("/home");
    },
  });

  const position = ticket?.position ?? 3;
  const total = 5;
  const waitMins = ticket?.estimatedWaitMinutes ?? 7;
  const arrivalTime = ticket?.estimatedTime ?? "14:32";

  // Queue timeline rows — always exactly 5 rows matching mockup
  const timelineRows = [
    { label: "Client en cours", sub: "En service",    done: true,  current: false, you: false },
    { label: "Client suivant",  sub: "En attente",    done: true,  current: false, you: false },
    { label: "Vous",            sub: `Position #${position}`, done: false, current: false, you: true  },
    { label: "Client suivant",  sub: "En attente",    done: false, current: false, you: false },
    { label: "Client suivant",  sub: "En attente",    done: false, current: false, you: false },
  ];

  const currentDotRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const dot = currentDotRef.current;
    if (!dot) return;
    gsap.to(dot, {
      scale: 1.5,
      opacity: 0.4,
      duration: 0.9,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
    });
    return () => { gsap.killTweensOf(dot); };
  }, []);

  const handleAlert = (label: string) => {
    const delays: Record<string, number> = {
      "15 min": 15 * 60 * 1000,
      "10 min": 10 * 60 * 1000,
      "5 min":  5 * 60 * 1000,
      "Mon tour": 60 * 1000,
    };
    toast(`Alerte programmée : ${label}`, "success");
    scheduleLocalNotification(
      delays[label] ?? 5 * 60 * 1000,
      "C'est bientôt votre tour !",
      `Rappel ${label} chez ${establishment.name}`,
      `/my-turn?from=${establishment.slug}`
    );
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

        {/* ── Horseshoe arc + center text ── */}
        <div className="flex justify-center py-2">
          <div className="relative w-52 h-52">
            <HorseshoeArc position={position} total={total} />
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pb-6">
              <p className="text-xs text-ink-3 font-semibold mb-0.5">Votre position</p>
              <motion.span
                className="text-6xl font-black text-ink leading-none"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3, type: "spring" }}
              >
                #{position}
              </motion.span>
              <span className="text-lg mt-1">👥</span>
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
            <p className="section-eyebrow mb-1">{t.estimatedWait}</p>
            <AnimatedNumber value={waitMins} duration={1.0} delay={0.4} suffix=" min" className="text-3xl font-black text-tornoo-green block" />
          </div>
          <div className="p-4">
            <p className="section-eyebrow mb-1">{t.expectedTime}</p>
            <p className="text-3xl font-black text-ink">{arrivalTime}</p>
          </div>
        </motion.div>

        {/* ── Establishment card ── */}
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
            {/* Star rating */}
            <div className="flex items-center gap-1 mt-0.5">
              <Star size={13} weight="fill" className="text-[#F7C400] shrink-0" />
              <span className="text-xs font-semibold text-ink-2">
                {establishment.rating} ({establishment.reviewCount} avis)
              </span>
            </div>
            {/* Address */}
            {establishment.address && (
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin size={12} weight="duotone" className="text-ink-3 shrink-0" />
                <p className="text-xs text-ink-3 truncate">{establishment.address}</p>
              </div>
            )}
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

        {/* ── Queue timeline ── */}
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

          <div className="relative">
            {/* Vertical connecting line */}
            <div
              className="absolute left-[19px] top-5 bottom-5 w-px bg-line"
              aria-hidden
            />

            <div className="space-y-1">
              {timelineRows.map((row, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.08 }}
                  className={`flex items-center gap-3 p-3 rounded-2xl relative ${row.you ? "bg-low-bg" : ""}`}
                >
                  {/* Dot */}
                  {row.you ? (
                    // Pulsing ring for current user
                    <span className="relative shrink-0 w-10 h-10 flex items-center justify-center">
                      <span
                        ref={currentDotRef}
                        className="absolute inset-0 rounded-full bg-tornoo-green opacity-20"
                        style={{ transformOrigin: "center" }}
                      />
                      <span className="w-4 h-4 rounded-full bg-tornoo-green z-10" />
                    </span>
                  ) : row.done ? (
                    // Green filled dot for done / in-service
                    <span className="w-10 h-10 flex items-center justify-center shrink-0">
                      <span className="w-4 h-4 rounded-full bg-tornoo-green" />
                    </span>
                  ) : (
                    // Empty gray circle for waiting slots
                    <span className="w-10 h-10 flex items-center justify-center shrink-0">
                      <span className="w-4 h-4 rounded-full border-2 border-[#c7cdd6]" />
                    </span>
                  )}

                  {/* Labels */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold ${row.you ? "text-tornoo-green" : "text-ink"}`}>
                      {row.label}
                    </p>
                    <p className="text-xs text-ink-3">{row.sub}</p>
                  </div>

                  {/* Right badge */}
                  {i === 0 && (
                    <span className="px-2.5 py-1 rounded-full bg-tornoo-green text-white text-xs font-bold shrink-0">
                      En cours
                    </span>
                  )}
                  {row.you && (
                    <span className="px-2.5 py-1 rounded-full bg-low-bg text-tornoo-green text-xs font-bold border border-low-rim shrink-0">
                      ~ {waitMins} min
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Alert section ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-[22px] border border-line shadow-1 p-4"
        >
          <h3 className="font-black text-ink">Prévenez-moi</h3>
          <p className="text-xs text-ink-3 mt-0.5 mb-3">Recevoir une alerte selon l&apos;avancement</p>
          <div className="grid grid-cols-4 gap-2">
            {["15 min", "10 min", "5 min", "Mon tour"].map((label, i) => (
              <button
                key={label}
                onClick={() => handleAlert(label)}
                className={`h-11 rounded-xl text-xs font-bold transition-all active:scale-95 flex flex-col items-center justify-center gap-0.5 ${
                  i === 2
                    ? "border-2 border-tornoo-green text-tornoo-green bg-low-bg"
                    : "border border-line text-ink-2 bg-white"
                }`}
              >
                <Bell size={12} weight={i === 2 ? "fill" : "regular"} />
                {label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Action buttons ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-2 gap-2"
        >
          {[
            { label: t.onMyWay,    Icon: NavigationArrow,       color: "#2563eb", bg: "#eff6ff", rim: "#dbeafe", danger: false },
            { label: t.arrived,    Icon: MapPin,                color: "#07984a", bg: "#e4f6ec", rim: "#b6e6c9", danger: false },
            { label: t.delayTurn,  Icon: ClockCounterClockwise, color: "#ff9300", bg: "#fff1de", rim: "#ffd9a6", danger: false },
            { label: t.leaveQueue, Icon: X,                     color: "#ef2b24", bg: "#fde7e6", rim: "#f6c2bf", danger: true  },
          ].map(({ label, Icon, color, bg, rim, danger }) => (
            <button
              key={label}
              onClick={
                danger
                  ? () => { haptic("heavy"); cancelMutation.mutate(); }
                  : () => { haptic("light"); toast(label, "success"); }
              }
              className="min-h-[76px] rounded-[18px] p-3 flex flex-col items-center justify-center gap-1.5 text-xs font-bold text-center leading-tight border transition-all active:scale-95"
              style={{ background: bg, borderColor: rim, color }}
            >
              {cancelMutation.isPending && danger
                ? <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                : <Icon weight="duotone" size={22} />}
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

export default function MyTurnPage() {
  return (
    <Suspense>
      <MyTurnContent />
    </Suspense>
  );
}
