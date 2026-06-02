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
          <div className="font-black text-[52px] leading-none tracking-[-0.045em] text-ink">
            Tornoo
          </div>
          <div className="mt-2 font-bold text-[17px]">
            <span className="text-tornoo-green">L'attente</span>{" "}
            <span className="text-tornoo-orange">en temps réel</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-16 left-0 right-0 flex flex-col items-center gap-4 animate-fade-in">
        <div className="w-64 h-1.5 rounded-full bg-[#eaedf0] overflow-hidden">
          <div
            className="h-full rounded-full animate-progress"
            style={{ background: "linear-gradient(90deg,#07984a,#f7c400,#ff9300,#ef2b24)" }}
          />
        </div>
        <p className="text-sm font-semibold text-ink-3">Chargement en cours...</p>
      </div>
    </div>
  );
}
