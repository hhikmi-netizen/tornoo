"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { TornooMark } from "@/components/tornoo/TornooLogo";

function CitySilhouette() {
  return (
    <div className="absolute left-0 right-0 bottom-44 h-44 pointer-events-none opacity-50">
      <svg viewBox="0 0 430 160" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="cityFade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#D8F3E8" />
            <stop offset="50%"  stopColor="#E9EEF5" />
            <stop offset="100%" stopColor="#FFF0E1" />
          </linearGradient>
        </defs>
        <path
          d="M0 150H430V105C415 105 414 78 400 78C387 78 384 110 371 110C358 110 358 82 344 82H332V60H318V110H300V76H286V110H270V50H250V110H232V82H218V110H202V40H180V110H162V70H148V110H130V92H116V110H95V80H82V110H65V90H52V110H35V75H22V110H0V150Z"
          fill="url(#cityFade)"
        />
        <circle cx="84"  cy="40" r="13" fill="#EEF5F1" />
        <rect   x="62"  y="45" width="44" height="14" rx="7" fill="#EEF5F1" />
        <circle cx="340" cy="42" r="13" fill="#EEF5F1" />
        <rect   x="318" y="47" width="44" height="14" rx="7" fill="#EEF5F1" />
      </svg>
    </div>
  );
}

function AnimatedProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-[250px] h-2 rounded-full overflow-hidden" style={{ background: "#e2e8f0" }}>
      <div
        className="h-full rounded-full"
        style={{
          width: `${progress * 100}%`,
          background: "linear-gradient(90deg, #009B5A 0%, #F5C400 45%, #FF8A00 78%, #EF2B24 100%)",
          transition: "width 60ms linear",
        }}
      />
    </div>
  );
}

export default function SplashPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const navigate = useCallback(() => {
    if (done) return;
    setDone(true);
    const auth = localStorage.getItem("tornoo_auth");
    const role = localStorage.getItem("tornoo_role");
    const seen = localStorage.getItem("tornoo_onboarded");
    if (auth) {
      router.replace(role === "pro" ? "/pro" : "/home");
    } else {
      router.replace(seen ? "/login" : "/onboarding");
    }
  }, [done, router]);

  useEffect(() => {
    const duration = 2200;
    const start = Date.now();
    let raf: number;
    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(elapsed / duration, 1);
      setProgress(pct);
      if (pct < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(navigate, 150);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [navigate]);

  return (
    <div
      className="fixed inset-0 bg-white flex flex-col items-center select-none overflow-hidden"
      onClick={navigate}
      role="button"
      aria-label="Passer l'introduction"
    >
      {/* Subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at center, rgba(0,155,90,0.04), transparent 52%)" }} />

      {/* Main content — centered */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 -mt-10">
        <TornooMark size={190} />

        <h1
          className="mt-8 leading-none font-black tracking-[-0.06em] text-[#071A2A]"
          style={{ fontSize: 78 }}
        >
          Tornoo
        </h1>

        <p className="mt-4 leading-none font-extrabold tracking-[-0.035em]" style={{ fontSize: 26 }}>
          <span style={{ color: "#009B5A" }}>L'attente</span>{" "}
          <span style={{ color: "#8BC53F" }}>en</span>{" "}
          <span style={{ color: "#FF8A00" }}>temps</span>{" "}
          <span style={{ color: "#EF2B24" }}>réel</span>
        </p>
      </div>

      {/* City silhouette */}
      <CitySilhouette />

      {/* Progress bar */}
      <div className="absolute bottom-24 left-0 right-0 flex flex-col items-center gap-5 z-10">
        <AnimatedProgressBar progress={progress} />
        <p className="text-[22px] font-semibold text-slate-500">
          {progress < 1 ? "Chargement en cours..." : "Prêt !"}
        </p>
        <p className="text-xs font-medium text-slate-400">Appuyez pour passer</p>
      </div>
    </div>
  );
}
