"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TornooMark } from "@/components/tornoo/TornooLogo";
import { CityBackdrop } from "@/components/tornoo/CityBackdrop";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const seen = typeof window !== "undefined" && localStorage.getItem("tornoo_onboarded");
      router.replace(seen ? "/home" : "/onboarding");
    }, 2200);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center overflow-hidden">
      <CityBackdrop />

      <div className="relative z-10 flex flex-col items-center animate-fade-in">
        <TornooMark size={120} />
        <div className="mt-6 text-center">
          <div
            className="font-black text-[56px] leading-none tracking-[-0.05em]"
            style={{
              background: "linear-gradient(120deg,#07984a 0%,#13b45b 30%,#f7c400 60%,#ff9300 80%,#ef2b24 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Tornoo
          </div>
          <div className="mt-2.5 font-semibold text-[16px] text-ink-3 tracking-[-0.01em]">
            L'attente en temps réel
          </div>
        </div>
      </div>

      <div className="absolute bottom-16 left-0 right-0 flex flex-col items-center gap-3 animate-fade-in">
        <div className="w-48 h-[3px] rounded-full bg-[#eaedf0] overflow-hidden">
          <div
            className="h-full rounded-full animate-progress"
            style={{ background: "linear-gradient(90deg,#07984a 0%,#13b45b 35%,#f7c400 65%,#ff9300 85%,#ef2b24 100%)" }}
          />
        </div>
      </div>
    </div>
  );
}
