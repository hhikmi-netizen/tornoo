"use client";

import { useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { haptic } from "@/lib/haptic";
import { motion } from "framer-motion";
import { Ticket, Bell, CaretRight } from "@phosphor-icons/react";
import { MOCK_ESTABLISHMENTS, MOCK_TICKET } from "@/lib/mock-data";
import { useI18n } from "@/i18n/context";
import { gsap } from "@/lib/gsap";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

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
    return () => { gsap.killTweensOf(ring); };
  }, []);
  const establishment = slug
    ? MOCK_ESTABLISHMENTS.find((e) => e.slug === slug) ?? MOCK_ESTABLISHMENTS[0]
    : MOCK_ESTABLISHMENTS[0];

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
        <div className="w-10 h-10 rounded-full bg-low-bg flex items-center justify-center">
          <Bell weight="duotone" size={18} className="text-tornoo-green" />
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
