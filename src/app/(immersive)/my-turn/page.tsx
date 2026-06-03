"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { haptic } from "@/lib/haptic";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { motion, AnimatePresence } from "framer-motion";
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
  Warning,
  Lightbulb,
} from "@phosphor-icons/react";
import { gsap } from "@/lib/gsap";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { api } from "@/services/api";
import { MOCK_ESTABLISHMENTS } from "@/lib/mock-data";
import { WaitDot } from "@/components/tornoo/WaitBadge";
import { useToast } from "@/components/ui/Toast";
import { useI18n } from "@/i18n/context";
import { scheduleLocalNotification } from "@/lib/notifications";

// ─── Position Ring (exact from blueprint) ────────────────────────────────────

interface PositionRingProps {
  position: number;
  total: number;
}

function PositionRing({ position, total }: PositionRingProps) {
  // Compute indicator dot angle dynamically
  // The ring starts at upper-left (~320° from 3 o'clock) and the dot moves clockwise
  const fraction = total <= 1 ? 0 : (position - 1) / (total - 1);
  const startAngleDeg = -130; // upper-left in SVG coords
  const sweepDeg = 260;
  const angleDeg = startAngleDeg + fraction * sweepDeg;
  const angleRad = (angleDeg * Math.PI) / 180;
  const cx = 150, cy = 150, r = 118;
  const dotX = cx + r * Math.cos(angleRad);
  const dotY = cy + r * Math.sin(angleRad);

  return (
    <svg viewBox="0 0 300 300" className="w-full h-full" aria-hidden>
      <defs>
        <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#009B5A" />
          <stop offset="50%"  stopColor="#F5C400" />
          <stop offset="75%"  stopColor="#FF8A00" />
          <stop offset="100%" stopColor="#EF2B24" />
        </linearGradient>
      </defs>
      {/* Background track */}
      <circle cx="150" cy="150" r="118" stroke="#E8ECF1" strokeWidth="20" fill="none" strokeLinecap="round" />
      {/* Green segment */}
      <path d="M58 220A118 118 0 0 1 105 42" stroke="#009B5A" strokeWidth="22" strokeLinecap="round" fill="none" />
      {/* Gradient segment */}
      <path d="M118 37A118 118 0 0 1 230 72" stroke="url(#ringGrad)" strokeWidth="22" strokeLinecap="round" fill="none" />
      {/* Orange segment */}
      <path d="M240 85A118 118 0 0 1 260 132" stroke="#FF8A00" strokeWidth="22" strokeLinecap="round" fill="none" />
      {/* Red segment */}
      <path d="M260 154A118 118 0 0 1 245 207" stroke="#EF2B24" strokeWidth="22" strokeLinecap="round" fill="none" />
      {/* Dynamic indicator dot */}
      <circle cx={dotX} cy={dotY} r="16" fill="#009B5A" />
      <circle cx={dotX} cy={dotY} r="8"  fill="white" />
    </svg>
  );
}

// ─── Wait time update banner ─────────────────────────────────────────────────

interface WaitUpdateBannerProps {
  from: number;
  to: number;
  onDismiss: () => void;
}

function WaitUpdateBanner({ from, to, onDismiss }: WaitUpdateBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="mx-4 mt-3 rounded-[18px] overflow-hidden border border-[#FF9800]/30 shadow-lg"
      style={{ background: "linear-gradient(135deg,#FFF8EC,#FFF3DC)" }}
    >
      <div className="flex items-start gap-3 p-4">
        <div className="w-9 h-9 rounded-xl bg-[#FF9800]/15 flex items-center justify-center shrink-0 mt-0.5">
          <Warning weight="fill" size={18} className="text-[#FF9800]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-[#071A2A]">Mise à jour</p>
          <p className="text-sm font-medium text-[#071A2A] mt-0.5">
            L&apos;attente est passée de{" "}
            <span className="font-black">{from} à {to} minutes.</span>
          </p>
          <p className="text-xs text-[#71645A] mt-1 leading-snug">
            Un service précédent a pris plus de temps que prévu.
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="w-7 h-7 rounded-full bg-[#FF9800]/15 flex items-center justify-center shrink-0"
          aria-label="Fermer"
        >
          <X weight="bold" size={13} className="text-[#FF9800]" />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Smart advice card ────────────────────────────────────────────────────────

function SmartAdviceCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.95 }}
      className="rounded-[22px] overflow-hidden"
      style={{ background: "linear-gradient(135deg,#062E24,#071A2A)" }}
    >
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-[#009B5A]/25 flex items-center justify-center">
            <Lightbulb weight="fill" size={15} className="text-[#4ADE80]" />
          </div>
          <p className="text-[#4ADE80] font-black text-sm">Conseil</p>
        </div>
        <p className="text-white font-bold text-base leading-snug">
          Profitez-en pour faire vos courses.
        </p>
        <p className="text-white/60 text-sm mt-1.5 leading-relaxed">
          Nous vous préviendrons avant votre tour. Vous avez encore un peu de temps.
        </p>
        <div className="mt-3 flex items-center gap-2">
          <Bell weight="fill" size={14} className="text-[#009B5A]" />
          <span className="text-xs text-[#009B5A] font-bold">Alerte automatique activée</span>
        </div>
      </div>
    </motion.div>
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
  const baseWait = ticket?.estimatedWaitMinutes ?? 7;
  const arrivalTime = ticket?.estimatedTime ?? "14:32";

  const [waitMins, setWaitMins] = useState(baseWait);
  const [prevWait, setPrevWait] = useState<number | null>(null);
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);

  // Simulate a real-time wait increase after 4 s
  useEffect(() => {
    const t = setTimeout(() => {
      const next = baseWait + 5;
      setPrevWait(baseWait);
      setWaitMins(next);
      setShowUpdateBanner(true);
    }, 4000);
    return () => clearTimeout(t);
  }, [baseWait]);

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

      {/* Wait time update banner — slides in when delay detected */}
      <AnimatePresence>
        {showUpdateBanner && prevWait !== null && (
          <WaitUpdateBanner
            from={prevWait}
            to={waitMins}
            onDismiss={() => setShowUpdateBanner(false)}
          />
        )}
      </AnimatePresence>

      <div className="px-4 pb-8 max-w-lg mx-auto space-y-4 pt-4">

        {/* ── Position Ring + center text ── */}
        <div className="relative w-72 h-72 mx-auto">
          <PositionRing position={position} total={total} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-slate-500 font-bold text-sm">Votre position</p>
            <motion.div
              className="text-7xl font-black tracking-[-0.06em] text-[#071A2A] leading-none"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3, type: "spring" }}
            >
              #{position}
            </motion.div>
            <div className="mt-2 text-tornoo-green">
              <svg width="38" height="26" viewBox="0 0 38 26" fill="none">
                <circle cx="10" cy="8" r="5" fill="currentColor" />
                <circle cx="28" cy="8" r="5" fill="currentColor" />
                <circle cx="19" cy="6" r="6" fill="currentColor" />
                <path d="M2 25C3 17 6 13 10 13C14 13 17 17 18 25H2Z"   fill="currentColor" />
                <path d="M20 25C21 17 24 13 28 13C32 13 35 17 36 25H20Z" fill="currentColor" />
                <path d="M9 25C10 16 14 12 19 12C24 12 28 16 29 25H9Z"  fill="currentColor" />
              </svg>
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

        {/* Smart advice */}
        <SmartAdviceCard />
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
