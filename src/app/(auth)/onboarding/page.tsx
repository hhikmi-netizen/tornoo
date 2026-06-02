"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

/* ── Illustrations from Tornoo Asset Sheet v1.0 ── */

function OnboardingIllustration1() {
  return (
    <svg width="180" height="252" viewBox="0 0 150 210" fill="none">
      <rect x="20" y="10" width="110" height="190" rx="22" fill="#fff" stroke="#b6e6c9" strokeWidth="2"/>
      <circle cx="75" cy="62" r="26" stroke="#e4f6ec" strokeWidth="8"/>
      <circle cx="75" cy="62" r="26" stroke="#07984a" strokeWidth="8" strokeLinecap="round"
        strokeDasharray="163" strokeDashoffset="52" transform="rotate(-90 75 62)"/>
      <text x="75" y="60" textAnchor="middle" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="17" fontWeight="800" fill="#0b1220">14</text>
      <text x="75" y="73" textAnchor="middle" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="7" fontWeight="600" fill="#97a1ae">min</text>
      <circle cx="45" cy="120" r="7" fill="#c7cdd6"/>
      <circle cx="65" cy="120" r="7" fill="#97a1ae"/>
      <circle cx="86" cy="120" r="9" fill="#0b1220"/>
      <circle cx="86" cy="120" r="9" fill="none" stroke="#07984a" strokeWidth="3" opacity=".4"/>
      <rect x="40" y="146" width="70" height="9" rx="4.5" fill="#eef1f0"/>
      <rect x="52" y="163" width="46" height="7" rx="3.5" fill="#f3f6f4"/>
      <circle cx="108" cy="30" r="5" fill="#07984a"/>
      <circle cx="108" cy="30" r="9" fill="none" stroke="#07984a" strokeWidth="2" opacity=".4"/>
    </svg>
  );
}

function OnboardingIllustration2() {
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
      <rect x="14" y="84" width="96" height="4" rx="2" fill="#07984a" opacity=".85"/>
      <rect x="116" y="58" width="58" height="108" rx="14" fill="#07984a"/>
      <rect x="123" y="66" width="44" height="92" rx="8" fill="#e4f6ec"/>
      <circle cx="145" cy="112" r="13" fill="none" stroke="#07984a" strokeWidth="4"/>
      <path d="M139 112l4 4 8-9" stroke="#07984a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function OnboardingIllustration3() {
  return (
    <svg width="228" height="252" viewBox="0 0 190 210" fill="none">
      <path d="M52 120h62v26a26 26 0 01-26 26H78a26 26 0 01-26-26z" fill="#ff9300"/>
      <path d="M114 128h12a14 14 0 010 28h-6" stroke="#ff9300" strokeWidth="8" strokeLinecap="round"/>
      <rect x="46" y="110" width="74" height="12" rx="6" fill="#ffb000"/>
      <path d="M70 96c-6-6 6-12 0-20M88 96c-6-6 6-12 0-20" stroke="#ffd9a6" strokeWidth="4" strokeLinecap="round"/>
      <rect x="92" y="26" width="80" height="46" rx="14" fill="#fff" stroke="#b6e6c9" strokeWidth="2"/>
      <circle cx="108" cy="44" r="9" fill="#07984a"/>
      <path d="M104 44l3 3 5-6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="124" y="38" width="40" height="6" rx="3" fill="#0b1220"/>
      <rect x="124" y="50" width="30" height="5" rx="2.5" fill="#c7cdd6"/>
      <path d="M100 68l-6 10 14-6z" fill="#fff"/>
    </svg>
  );
}

const SLIDES = [
  {
    id: 1,
    illustration: OnboardingIllustration1,
    title: "Votre tour\nen temps réel",
    sub: "Suivez l'avancement de la file d'attente depuis votre téléphone, à tout moment.",
    accentColor: "#07984a",
  },
  {
    id: 2,
    illustration: OnboardingIllustration2,
    title: "Scannez\n& rejoignez",
    sub: "Scannez le QR code à l'entrée de l'établissement pour prendre votre tour en quelques secondes.",
    accentColor: "#07984a",
  },
  {
    id: 3,
    illustration: OnboardingIllustration3,
    title: "Restez libre,\npartout",
    sub: "Profitez de votre temps libre. On vous prévient quand votre tour approche.",
    accentColor: "#ff9300",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [slide, setSlide] = useState(0);
  const [dir, setDir] = useState(1);
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
          className="text-sm font-bold text-ink-3"
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
            className="flex flex-col items-center"
          >
            <current.illustration />
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
            <h1
              className="text-[30px] font-black text-ink leading-tight whitespace-pre-line"
            >
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
            <button
              key={s.id}
              onClick={() => go(i)}
              aria-label={`Diapo ${i + 1}`}
            >
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
