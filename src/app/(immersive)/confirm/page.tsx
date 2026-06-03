"use client";

import { useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { haptic } from "@/lib/haptic";
import { motion } from "framer-motion";
import { Ticket, CaretRight } from "@phosphor-icons/react";
import { MOCK_ESTABLISHMENTS, MOCK_TICKET } from "@/lib/mock-data";
import { useI18n } from "@/i18n/context";
import { gsap } from "@/lib/gsap";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { scheduleLocalNotification } from "@/lib/notifications";

const CONFETTI_COLORS = ["#07984a", "#13b45b", "#f7c400", "#ff9300", "#ef2b24", "#3b82f6", "#a855f7"];

function burst(container: HTMLElement) {
  const count = 48;
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    const size = 6 + Math.random() * 8;
    const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    const isRect = Math.random() > 0.5;
    el.style.cssText = `position:absolute;pointer-events:none;width:${size}px;height:${isRect ? size * 0.45 : size}px;background:${color};border-radius:${isRect ? "2px" : "50%"};left:50%;top:50%;z-index:9999;`;
    container.appendChild(el);
    const angle = (i / count) * 360 + Math.random() * 10;
    const distance = 80 + Math.random() * 120;
    const rad = (angle * Math.PI) / 180;
    gsap.fromTo(el,
      { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1 },
      {
        x: Math.cos(rad) * distance,
        y: Math.sin(rad) * distance - 40,
        rotation: Math.random() * 720 - 360,
        opacity: 0,
        scale: 0.3,
        duration: 1.1 + Math.random() * 0.6,
        ease: "power2.out",
        delay: Math.random() * 0.12,
        onComplete: () => el.remove(),
      }
    );
  }
}

function ConfirmContent() {
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const ringRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const slug = searchParams.get("from");

  const establishment = slug
    ? MOCK_ESTABLISHMENTS.find((e) => e.slug === slug) ?? MOCK_ESTABLISHMENTS[0]
    : MOCK_ESTABLISHMENTS[0];

  useEffect(() => {
    const ring = ringRef.current;
    const container = containerRef.current;
    if (!ring) return;
    gsap.to(ring, {
      boxShadow: "0 0 60px rgba(7,152,74,.45), 0 0 120px rgba(7,152,74,.18)",
      duration: 1.2,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
      delay: 0.5,
    });
    if (container) {
      gsap.delayedCall(0.5, () => burst(container));
    }
    // Schedule a demo notification 5 s after confirmation (prod: ~5 min before turn)
    scheduleLocalNotification(
      5000,
      "C'est bientôt votre tour ! 🎉",
      `Plus que 2 personnes avant vous chez ${establishment.name}`,
      slug ? `/my-turn?from=${slug}` : "/my-turn"
    );
    return () => { gsap.killTweensOf(ring); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-svh bg-gradient-to-b from-low-bg to-white flex flex-col px-6 overflow-hidden">
      <div className="flex justify-end pt-safe-top pb-4">
        <Link href="/home" className="text-sm font-bold text-high">{t.cancel}</Link>
      </div>

      {/* Animated check */}
      <div className="flex flex-col items-center mt-20">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
          ref={ringRef}
          className="w-36 h-36 rounded-full border-[14px] border-tornoo-green flex items-center justify-center bg-white shadow-[0_0_40px_rgba(7,152,74,.25)]"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
          >
            <Ticket weight="duotone" size={60} className="text-tornoo-green" />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-[28px] font-black text-ink text-center mt-8 leading-snug"
        >
          {t.inQueue.split("\n")[0]}<br />{t.inQueue.split("\n")[1]}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-ink-3 mt-2"
        >
          {establishment.name} · {establishment.category}
        </motion.p>
      </div>

      {/* Stats card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-[22px] border border-line shadow-1 grid grid-cols-3 divide-x divide-line mt-10"
      >
        <div className="p-4 text-center">
          <p className="section-eyebrow mb-1">{t.yourPosition}</p>
          <AnimatedNumber value={MOCK_TICKET.position} delay={0.5} duration={0.8} className="text-3xl font-black text-ink block" />
        </div>
        <div className="p-4 text-center">
          <p className="section-eyebrow mb-1">{t.estimatedWait}</p>
          <AnimatedNumber value={MOCK_TICKET.estimatedWaitMinutes} delay={0.6} duration={1.0} suffix=" min" className="text-2xl font-black text-tornoo-green block" />
        </div>
        <div className="p-4 text-center">
          <p className="section-eyebrow mb-1">{t.arrival}</p>
          <p className="text-2xl font-black text-ink">{MOCK_TICKET.estimatedTime}</p>
        </div>
      </motion.div>

      {/* Alert reminder */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-[22px] border border-line shadow-1 flex items-center gap-3 p-4 mt-4"
      >
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#e7f5ee" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.122 1.532 5.856L0 24l6.335-1.652A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.817 9.817 0 01-5.01-1.374l-.36-.213-3.732.979.993-3.623-.234-.373A9.78 9.78 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm text-ink">{t.setReminder}</p>
          <p className="text-xs text-ink-3">{t.reminderSub}</p>
        </div>
        <CaretRight weight="bold" size={16} className="text-ink-4" />
      </motion.div>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="mt-6 space-y-3"
      >
        <Link
          href={`/my-turn${slug ? `?from=${slug}` : ""}`}
          onClick={() => haptic("medium")}
          className="flex items-center justify-center h-14 rounded-[15px] bg-tornoo-green text-white font-extrabold w-full shadow-[0_4px_20px_rgba(7,152,74,.3)] active:scale-[0.98] transition-transform"
        >
          {t.viewTicket}
        </Link>
        <Link
          href="/home"
          className="flex items-center justify-center h-12 rounded-[15px] bg-surface-2 text-ink-2 font-bold border border-line w-full text-sm active:scale-[0.98] transition-transform"
        >
          {t.backHome}
        </Link>
      </motion.div>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense>
      <ConfirmContent />
    </Suspense>
  );
}
