"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { TornooMark } from "@/components/tornoo/TornooLogo";

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
    const duration = 2000;
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
      className="fixed inset-0 bg-white flex flex-col items-center justify-between overflow-hidden select-none"
      onClick={navigate}
      role="button"
      aria-label="Passer l'introduction"
    >
      {/* Spacer */}
      <div />

      {/* Logo area */}
      <div className="flex flex-col items-center">
        <TornooMark size={148} />

        <div
          className="font-black mt-5 leading-none tracking-[-0.04em]"
          style={{ fontSize: 52, color: "#0b1220" }}
        >
          Tornoo
        </div>

        <div className="mt-2 text-[16px] font-bold">
          <span style={{ color: "#07984A" }}>L'attente</span>{" "}
          <span style={{ color: "#FF9300" }}>en temps réel</span>
        </div>

        {/* City skyline illustration */}
        <div className="mt-14 w-80 h-28 opacity-[0.12]">
          <svg viewBox="0 0 320 112" className="w-full h-full">
            {/* Buildings */}
            <rect x="0"   y="62" width="32" height="50" rx="2" fill="#07984A"/>
            <rect x="6"   y="38" width="20" height="74" rx="2" fill="#07984A"/>
            <rect x="36"  y="72" width="26" height="40" rx="2" fill="#13B45B"/>
            <rect x="66"  y="44" width="36" height="68" rx="2" fill="#07984A"/>
            <rect x="75"  y="20" width="20" height="92" rx="2" fill="#07984A"/>
            <rect x="106" y="60" width="28" height="52" rx="2" fill="#13B45B"/>
            <rect x="138" y="30" width="34" height="82" rx="2" fill="#07984A"/>
            <rect x="146" y="8"  width="20" height="104" rx="2" fill="#07984A"/>
            <rect x="178" y="52" width="26" height="60" rx="2" fill="#13B45B"/>
            <rect x="208" y="28" width="32" height="84" rx="2" fill="#07984A"/>
            <rect x="216" y="6"  width="18" height="106" rx="2" fill="#07984A"/>
            <rect x="245" y="54" width="28" height="58" rx="2" fill="#13B45B"/>
            <rect x="277" y="36" width="30" height="76" rx="2" fill="#07984A"/>
            <rect x="285" y="16" width="18" height="96" rx="2" fill="#07984A"/>
            {/* Trees */}
            <circle cx="50"  cy="66" r="13" fill="#07984A" opacity="0.6"/>
            <rect   x="47"  y="78" width="6" height="14" rx="2" fill="#07984A"/>
            <circle cx="125" cy="68" r="11" fill="#07984A" opacity="0.6"/>
            <rect   x="122" y="78" width="6" height="14" rx="2" fill="#07984A"/>
            <circle cx="200" cy="64" r="12" fill="#07984A" opacity="0.6"/>
            <rect   x="197" y="75" width="6" height="14" rx="2" fill="#07984A"/>
            <circle cx="270" cy="66" r="11" fill="#07984A" opacity="0.6"/>
            <rect   x="267" y="76" width="6" height="14" rx="2" fill="#07984A"/>
          </svg>
        </div>
      </div>

      {/* Bottom: progress + label */}
      <div className="flex flex-col items-center gap-3 mb-16">
        {/* Interactive progress bar — tap anywhere to skip */}
        <div className="w-52 h-[4px] rounded-full overflow-hidden" style={{ background: "#eaedf0" }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${progress * 100}%`,
              background: "linear-gradient(90deg,#07984a 0%,#13b45b 25%,#f7c400 55%,#ff9300 78%,#ef2b24 100%)",
              transition: "width 60ms linear",
            }}
          />
        </div>
        <p className="text-xs font-medium" style={{ color: "#8a9ab5" }}>
          {progress < 1 ? "Chargement en cours…" : "Prêt !"}
        </p>
        <p className="text-[10px] font-medium" style={{ color: "#c4cdd6" }}>
          Appuyez pour passer
        </p>
      </div>
    </div>
  );
}
