"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "@/lib/gsap";

/* ── Animated Illustrations ── */

function Slide1Illustration({ active }: { active: boolean }) {
  const ringRef    = useRef<SVGCircleElement>(null);
  const dotRef     = useRef<SVGCircleElement>(null);
  const dotHaloRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (!active) return;
    const ring = ringRef.current;
    const dot  = dotRef.current;
    const halo = dotHaloRef.current;
    if (!ring || !dot || !halo) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Ring draw from 0
    const circumference = 2 * Math.PI * 26; // r=26
    gsap.set(ring, { strokeDasharray: circumference, strokeDashoffset: circumference });
    tl.to(ring, { strokeDashoffset: 52, duration: 1.2, ease: "power2.inOut" }, 0.1);

    // Notification dot pulse
    gsap.set([dot, halo], { scale: 0, transformOrigin: "50% 50%" });
    tl.to(dot,  { scale: 1, duration: 0.4, ease: "back.out(2)" }, 0.8);
    tl.to(halo, { scale: 1, opacity: 0.4, duration: 0.5, ease: "power2.out" }, 0.9);

    // Halo loop
    gsap.to(halo, {
      scale: 1.6,
      opacity: 0,
      duration: 1.1,
      ease: "power2.out",
      repeat: -1,
      delay: 1.2,
    });

    return () => { tl.kill(); gsap.killTweensOf([ring, dot, halo]); };
  }, [active]);

  return (
    <svg width="180" height="252" viewBox="0 0 150 210" fill="none">
      <rect x="20" y="10" width="110" height="190" rx="22" fill="#fff" stroke="#b6e6c9" strokeWidth="2"/>
      <circle cx="75" cy="62" r="26" stroke="#e4f6ec" strokeWidth="8"/>
      <circle
        ref={ringRef}
        cx="75" cy="62" r="26"
        stroke="#07984a" strokeWidth="8" strokeLinecap="round"
        strokeDasharray="163" strokeDashoffset="52"
        transform="rotate(-90 75 62)"
      />
      <text x="75" y="60" textAnchor="middle" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="17" fontWeight="800" fill="#0b1220">14</text>
      <text x="75" y="73" textAnchor="middle" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="7" fontWeight="600" fill="#97a1ae">min</text>
      <circle cx="45" cy="120" r="7" fill="#c7cdd6"/>
      <circle cx="65" cy="120" r="7" fill="#97a1ae"/>
      <circle cx="86" cy="120" r="9" fill="#0b1220"/>
      <circle cx="86" cy="120" r="9" fill="none" stroke="#07984a" strokeWidth="3" opacity=".4"/>
      <rect x="40" y="146" width="70" height="9" rx="4.5" fill="#eef1f0"/>
      <rect x="52" y="163" width="46" height="7" rx="3.5" fill="#f3f6f4"/>
      <circle ref={dotRef}  cx="108" cy="30" r="5"  fill="#07984a"/>
      <circle ref={dotHaloRef} cx="108" cy="30" r="9"  fill="none" stroke="#07984a" strokeWidth="2" opacity=".4"/>
    </svg>
  );
}

function Slide2Illustration({ active }: { active: boolean }) {
  const scanLineRef  = useRef<SVGRectElement>(null);
  const checkCircRef = useRef<SVGCircleElement>(null);
  const checkPathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!active) return;
    const scanLine  = scanLineRef.current;
    const checkCirc = checkCircRef.current;
    const checkPath = checkPathRef.current;
    if (!scanLine || !checkCirc || !checkPath) return;

    // Scan line sweep (top → bottom → top, repeat)
    gsap.set(scanLine, { y: 0, opacity: 0.85 });
    gsap.to(scanLine, {
      y: 88,
      duration: 1.4,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
    });

    // Checkmark reveal after brief delay
    const tl = gsap.timeline({ defaults: { ease: "back.out(2)" } });
    gsap.set([checkCirc, checkPath], { scale: 0, transformOrigin: "145px 112px" });
    tl.to(checkCirc, { scale: 1, duration: 0.45 }, 0.6);
    tl.to(checkPath, { scale: 1, duration: 0.35 }, 0.85);

    return () => { tl.kill(); gsap.killTweensOf([scanLine, checkCirc, checkPath]); };
  }, [active]);

  return (
    <svg width="228" height="240" viewBox="0 0 190 200" fill="none">
      <rect x="14" y="40" width="96" height="96" rx="16" fill="#fff" stroke="#eaedf0" strokeWidth="2"/>
      <g fill="#071A2A">
        <rect x="28" y="54" width="22" height="22" rx="4"/>
        <rect x="34" y="60" width="10" height="10" fill="#fff"/>
        <rect x="74" y="54" width="22" height="22" rx="4"/>
        <rect x="80" y="60" width="10" height="10" fill="#fff"/>
        <rect x="28" y="100" width="22" height="22" rx="4"/>
        <rect x="34" y="106" width="10" height="10" fill="#fff"/>
        <rect x="60" y="56" width="6" height="6"/>
        <rect x="60" y="68" width="6" height="6"/>
        <rect x="74" y="86" width="6" height="6"/>
        <rect x="86" y="86" width="6" height="6"/>
        <rect x="62" y="100" width="6" height="6"/>
        <rect x="74" y="108" width="6" height="6"/>
        <rect x="86" y="100" width="6" height="6"/>
        <rect x="62" y="114" width="6" height="6"/>
        <rect x="86" y="114" width="6" height="6"/>
      </g>
      {/* Scan line */}
      <rect ref={scanLineRef} x="14" y="40" width="96" height="4" rx="2" fill="#07984a" opacity=".85"/>
      <rect x="116" y="58" width="58" height="108" rx="14" fill="#07984a"/>
      <rect x="123" y="66" width="44" height="92" rx="8" fill="#e4f6ec"/>
      <circle ref={checkCircRef} cx="145" cy="112" r="13" fill="none" stroke="#07984a" strokeWidth="4"/>
      <path ref={checkPathRef} d="M139 112l4 4 8-9" stroke="#07984a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function Slide3Illustration({ active }: { active: boolean }) {
  const flame1Ref = useRef<SVGPathElement>(null);
  const flame2Ref = useRef<SVGPathElement>(null);
  const cardRef   = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!active) return;
    const flame1 = flame1Ref.current;
    const flame2 = flame2Ref.current;
    const card   = cardRef.current;
    if (!flame1 || !flame2 || !card) return;

    // Flame wave
    gsap.to(flame1, {
      scaleX: 1.06,
      scaleY: 0.95,
      transformOrigin: "83px 110px",
      duration: 0.7,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
    });
    gsap.to(flame2, {
      scaleX: 0.94,
      scaleY: 1.05,
      transformOrigin: "83px 110px",
      duration: 0.9,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
      delay: 0.2,
    });

    // Notification card slide down
    gsap.set(card, { y: -18, opacity: 0 });
    gsap.to(card, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: "back.out(1.8)",
      delay: 0.3,
    });

    return () => { gsap.killTweensOf([flame1, flame2, card]); };
  }, [active]);

  return (
    <svg width="228" height="252" viewBox="0 0 190 210" fill="none">
      <path ref={flame1Ref} d="M52 120h62v26a26 26 0 01-26 26H78a26 26 0 01-26-26z" fill="#ff9300"/>
      <path ref={flame2Ref} d="M114 128h12a14 14 0 010 28h-6" stroke="#ff9300" strokeWidth="8" strokeLinecap="round"/>
      <rect x="46" y="110" width="74" height="12" rx="6" fill="#ffb000"/>
      <path d="M70 96c-6-6 6-12 0-20M88 96c-6-6 6-12 0-20" stroke="#ffd9a6" strokeWidth="4" strokeLinecap="round"/>
      {/* Notification card */}
      <g ref={cardRef}>
        <rect x="92" y="26" width="80" height="46" rx="14" fill="#fff" stroke="#b6e6c9" strokeWidth="2"/>
        <circle cx="108" cy="44" r="9" fill="#07984a"/>
        <path d="M104 44l3 3 5-6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="124" y="38" width="40" height="6" rx="3" fill="#0b1220"/>
        <rect x="124" y="50" width="30" height="5" rx="2.5" fill="#c7cdd6"/>
        <path d="M100 68l-6 10 14-6z" fill="#fff"/>
      </g>
    </svg>
  );
}

/* ── Slide data ── */

const SLIDES = [
  {
    id: 1,
    Illustration: Slide1Illustration,
    title: "Votre tour\nen temps réel",
    sub: "Suivez l'avancement de la file d'attente depuis votre téléphone, à tout moment.",
    accentColor: "#07984a",
  },
  {
    id: 2,
    Illustration: Slide2Illustration,
    title: "Scannez\n& rejoignez",
    sub: "Scannez le QR code à l'entrée de l'établissement pour prendre votre tour en quelques secondes.",
    accentColor: "#07984a",
  },
  {
    id: 3,
    Illustration: Slide3Illustration,
    title: "Restez libre,\npartout",
    sub: "Profitez de votre temps libre. On vous prévient quand votre tour approche.",
    accentColor: "#ff9300",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [slide, setSlide] = useState(0);
  const [dir, setDir]     = useState(1);
  const current = SLIDES[slide];

  const go = (i: number) => {
    setDir(i > slide ? 1 : -1);
    setSlide(i);
  };

  const next = () => {
    if (slide < SLIDES.length - 1) {
      go(slide + 1);
    } else {
      localStorage.setItem("tornoo_onboarded", "1");
      router.replace("/login");
    }
  };

  return (
    <div className="bg-white min-h-svh flex flex-col overflow-hidden">
      {/* Skip */}
      <div className="flex justify-end pt-safe-top px-6 pb-2">
        <button
          onClick={() => { localStorage.setItem("tornoo_onboarded", "1"); router.replace("/login"); }}
          className="text-sm font-bold text-ink-3 active:opacity-60 transition-opacity"
        >
          Passer
        </button>
      </div>

      {/* Illustration area */}
      <div className="flex-1 flex items-center justify-center px-6 pb-6 overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={current.id}
            custom={dir}
            initial={{ x: dir * 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: dir * -80, opacity: 0 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -50 && slide < SLIDES.length - 1) go(slide + 1);
              else if (info.offset.x > 50 && slide > 0) go(slide - 1);
            }}
            className="flex flex-col items-center cursor-grab active:cursor-grabbing"
          >
            <current.Illustration active={true} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Text + dots + CTA */}
      <div className="px-6 pb-safe-bottom pb-10 space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id + "-text"}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28 }}
          >
            <h1 className="text-[30px] font-black text-ink leading-tight whitespace-pre-line">
              {current.title}
            </h1>
            <p className="mt-3 text-sm text-ink-3 leading-relaxed max-w-[300px]">
              {current.sub}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {SLIDES.map((s, i) => (
            <button key={s.id} onClick={() => go(i)} aria-label={`Diapo ${i + 1}`}>
              <motion.div
                animate={{
                  width: i === slide ? 24 : 8,
                  background: i === slide ? current.accentColor : "#c7cdd6",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                style={{ height: 8, borderRadius: 4 }}
              />
            </button>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={next}
          className="w-full h-14 rounded-[15px] font-extrabold text-white text-base active:scale-[0.98] transition-transform"
          style={{
            background: `linear-gradient(135deg, ${current.accentColor}, ${current.accentColor}cc)`,
            boxShadow: `0 4px 20px ${current.accentColor}40`,
          }}
        >
          {slide < SLIDES.length - 1 ? "Suivant" : "Commencer"}
        </button>
      </div>
    </div>
  );
}
