"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SplashPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress bar
    const start = Date.now();
    const duration = 2000;
    const frame = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(elapsed / duration, 1);
      setProgress(pct);
      if (pct < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);

    const timer = setTimeout(() => {
      const auth = localStorage.getItem("tornoo_auth");
      const role = localStorage.getItem("tornoo_role");
      const seen = localStorage.getItem("tornoo_onboarded");
      if (auth) {
        router.replace(role === "pro" ? "/pro" : "/home");
      } else {
        router.replace(seen ? "/login" : "/onboarding");
      }
    }, 2200);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-between overflow-hidden py-20">
      {/* Main logo area */}
      <div />
      <div className="flex flex-col items-center">
        {/* Colorful Tornoo logo mark */}
        <svg width="140" height="140" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Outer arc segments (queue timer) */}
          <path d="M100 16 A84 84 0 0 1 184 100" stroke="#07984a" strokeWidth="20" strokeLinecap="round" fill="none"/>
          <path d="M184 100 A84 84 0 0 1 143 171" stroke="#f7c400" strokeWidth="20" strokeLinecap="round" fill="none"/>
          <path d="M143 171 A84 84 0 0 1 57 171" stroke="#ff9300" strokeWidth="20" strokeLinecap="round" fill="none"/>
          <path d="M57 171 A84 84 0 0 1 16 100" stroke="#ef2b24" strokeWidth="20" strokeLinecap="round" fill="none"/>
          {/* White center circle */}
          <circle cx="100" cy="100" r="56" fill="white"/>
          {/* Checkmark */}
          <path d="M72 100 L90 118 L130 78" stroke="#07984a" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          {/* People icons */}
          <circle cx="76" cy="138" r="8" fill="#07984a"/>
          <circle cx="100" cy="138" r="8" fill="#f7c400"/>
          <circle cx="124" cy="138" r="8" fill="#ef2b24"/>
          <rect x="62" y="148" width="28" height="14" rx="7" fill="#07984a" opacity="0.7"/>
          <rect x="86" y="148" width="28" height="14" rx="7" fill="#f7c400" opacity="0.7"/>
          <rect x="110" y="148" width="28" height="14" rx="7" fill="#ef2b24" opacity="0.7"/>
        </svg>

        {/* Brand name */}
        <div
          className="font-black text-[52px] leading-none tracking-[-0.04em] mt-4"
          style={{
            background: "linear-gradient(120deg,#061819 0%,#061819 60%,#07984a 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Tornoo
        </div>

        {/* Tagline */}
        <p className="mt-2 font-semibold text-[15px] tracking-[-0.01em]">
          <span className="text-ink-3">L'attente </span>
          <span className="text-tornoo-green font-bold">en temps réel</span>
        </p>

        {/* City illustration placeholder */}
        <div className="mt-12 w-72 h-24 relative opacity-15">
          {/* Simplified city skyline */}
          <svg viewBox="0 0 300 100" className="w-full h-full">
            <rect x="10" y="40" width="30" height="60" rx="2" fill="#07984a"/>
            <rect x="15" y="20" width="20" height="80" rx="2" fill="#07984a"/>
            <rect x="50" y="55" width="25" height="45" rx="2" fill="#13b45b"/>
            <rect x="80" y="30" width="35" height="70" rx="2" fill="#07984a"/>
            <rect x="88" y="10" width="20" height="90" rx="2" fill="#07984a"/>
            <rect x="120" y="50" width="28" height="50" rx="2" fill="#13b45b"/>
            <rect x="155" y="35" width="32" height="65" rx="2" fill="#07984a"/>
            <rect x="160" y="15" width="22" height="85" rx="2" fill="#07984a"/>
            <rect x="195" y="45" width="26" height="55" rx="2" fill="#13b45b"/>
            <rect x="228" y="25" width="30" height="75" rx="2" fill="#07984a"/>
            <rect x="234" y="8" width="18" height="92" rx="2" fill="#07984a"/>
            <rect x="265" y="50" width="25" height="50" rx="2" fill="#13b45b"/>
            {/* Trees */}
            <circle cx="45" cy="50" r="12" fill="#07984a" opacity="0.5"/>
            <circle cx="110" cy="55" r="10" fill="#07984a" opacity="0.5"/>
            <circle cx="190" cy="52" r="11" fill="#07984a" opacity="0.5"/>
            <circle cx="255" cy="50" r="10" fill="#07984a" opacity="0.5"/>
          </svg>
        </div>
      </div>

      {/* Bottom loading indicator */}
      <div className="flex flex-col items-center gap-3">
        {/* Progress bar */}
        <div className="w-48 h-[3px] rounded-full bg-[#eaedf0] overflow-hidden">
          <div
            className="h-full rounded-full transition-none"
            style={{
              width: `${progress * 100}%`,
              background: "linear-gradient(90deg,#07984a 0%,#f7c400 50%,#ff9300 75%,#ef2b24 100%)",
            }}
          />
        </div>
        <p className="text-xs text-ink-4 font-medium">Chargement en cours…</p>
      </div>
    </div>
  );
}
