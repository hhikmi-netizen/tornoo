"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { X, Lightning } from "@phosphor-icons/react";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { MOCK_ESTABLISHMENTS } from "@/lib/mock-data";
import { gsap } from "@/lib/gsap";
import { useI18n } from "@/i18n/context";

/* ── Premium scanner frame ── */
function ScannerFrame() {
  const frameRef  = useRef<HTMLDivElement>(null);
  const lineRef   = useRef<HTMLDivElement>(null);
  const glowRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const line  = lineRef.current;
    const glow  = glowRef.current;
    if (!frame || !line || !glow) return;

    // Scan line — smooth top→bottom loop
    gsap.fromTo(line,
      { top: "12%" },
      { top: "82%", duration: 2.2, ease: "power1.inOut", repeat: -1, yoyo: true }
    );

    // Outer glow pulse
    gsap.to(glow, {
      opacity: 0.55,
      scale: 1.04,
      duration: 1.4,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
    });

    return () => { gsap.killTweensOf([line, glow]); };
  }, []);

  const cornerClass = "absolute w-7 h-7 rounded-sm";

  return (
    <div className="flex justify-center mt-10">
      {/* Outer glow ring */}
      <div
        ref={glowRef}
        className="absolute w-[268px] h-[268px] rounded-[28px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(7,152,74,0.18) 0%, transparent 75%)", opacity: 0.3 }}
      />

      <div
        ref={frameRef}
        className="w-64 h-64 rounded-[26px] relative overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.04)",
          boxShadow: "0 0 0 1.5px rgba(7,152,74,0.35), 0 0 60px rgba(7,152,74,0.15)",
        }}
      >
        {/* Corner markers — premium style */}
        {[
          { pos: "top-3 left-3",   border: "border-t-[3px] border-l-[3px]", rnd: "rounded-tl-md" },
          { pos: "top-3 right-3",  border: "border-t-[3px] border-r-[3px]", rnd: "rounded-tr-md" },
          { pos: "bottom-3 left-3",  border: "border-b-[3px] border-l-[3px]", rnd: "rounded-bl-md" },
          { pos: "bottom-3 right-3", border: "border-b-[3px] border-r-[3px]", rnd: "rounded-br-md" },
        ].map(({ pos, border, rnd }) => (
          <div
            key={pos}
            className={`${cornerClass} ${pos} ${border} ${rnd}`}
            style={{ borderColor: "#07984a" }}
          />
        ))}

        {/* QR placeholder — more refined pattern */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="130" height="130" viewBox="0 0 130 130" fill="none" opacity="0.22">
            {/* TL block */}
            <rect x="8"  y="8"  width="34" height="34" rx="5" stroke="white" strokeWidth="3.5" fill="none"/>
            <rect x="16" y="16" width="18" height="18" rx="2" fill="white"/>
            {/* TR block */}
            <rect x="88" y="8"  width="34" height="34" rx="5" stroke="white" strokeWidth="3.5" fill="none"/>
            <rect x="96" y="16" width="18" height="18" rx="2" fill="white"/>
            {/* BL block */}
            <rect x="8"  y="88" width="34" height="34" rx="5" stroke="white" strokeWidth="3.5" fill="none"/>
            <rect x="16" y="96" width="18" height="18" rx="2" fill="white"/>
            {/* Data dots */}
            {[
              [56,8],[64,8],[72,8],[56,16],[72,16],[56,24],[64,24],
              [8,56],[8,64],[16,56],[24,56],[16,72],[24,64],
              [56,56],[64,64],[72,56],[56,72],[72,72],
              [88,56],[96,64],[104,56],[88,72],
            ].map(([x, y], i) => (
              <rect key={i} x={x} y={y} width="6" height="6" rx="1" fill="white" />
            ))}
          </svg>
        </div>

        {/* Scan line */}
        <div
          ref={lineRef}
          className="absolute left-5 right-5 h-[2px] rounded-full pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(7,152,74,0.4) 15%, #07984a 40%, #13b45b 60%, rgba(7,152,74,0.4) 85%, transparent 100%)",
            boxShadow: "0 0 12px 3px rgba(7,152,74,0.5)",
          }}
        />
      </div>
    </div>
  );
}

export default function ScanPage() {
  const router = useRouter();
  const { t } = useI18n();
  const e = MOCK_ESTABLISHMENTS[2];

  return (
    <div className="fixed inset-0 bg-[#061819] text-white flex flex-col">
      {/* Controls */}
      <div className="flex justify-between items-center px-6 pt-safe-top pb-4 relative z-10">
        <button
          onClick={() => router.back()}
          className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center active:bg-white/20 transition-colors"
          aria-label="Fermer"
        >
          <X weight="bold" size={22} />
        </button>
        <div className="px-5 h-9 rounded-full bg-white/10 flex items-center">
          <span className="font-bold text-sm text-white/80">{t.scan}</span>
        </div>
        <button
          className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center active:bg-white/20 transition-colors"
          aria-label="Flash"
        >
          <Lightning weight="fill" size={20} className="text-white/70" />
        </button>
      </div>

      {/* Instruction */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center px-6 mt-6"
      >
        <h1 className="text-[22px] font-black tracking-tight">{t.scanInstruction}</h1>
        <p className="text-white/50 mt-1.5 text-sm font-medium">{t.placeQR}</p>
      </motion.div>

      {/* Scanner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 24 }}
        className="relative flex justify-center"
      >
        <ScannerFrame />
      </motion.div>

      {/* Scanned establishment card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 280, damping: 24 }}
        className="absolute bottom-8 left-4 right-4"
      >
        <div className="bg-white text-ink rounded-[24px] p-5 shadow-pop">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0">
              <ImageWithFallback
                src={e.imageUrl}
                alt={e.name}
                width={56}
                height={56}
                className="w-full h-full object-cover"
                fallback={
                  <div className="w-full h-full flex items-center justify-center bg-high-bg">
                    <span className="text-xl font-black text-high">{e.name.charAt(0)}</span>
                  </div>
                }
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-black text-ink truncate">{e.name}</h2>
              <p className="text-sm text-ink-3">{e.category} · {e.city}</p>
            </div>
            {/* Inline wait pill */}
            <span
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-sm font-black shrink-0"
              style={{
                background: e.waitLevel === "high" ? "#fde7e6" : e.waitLevel === "mod" ? "#fff1de" : "#e4f6ec",
                color: e.waitLevel === "high" ? "#ef2b24" : e.waitLevel === "mod" ? "#ff9300" : "#07984a",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: e.waitLevel === "high" ? "#ef2b24" : e.waitLevel === "mod" ? "#ff9300" : "#07984a" }}
              />
              {e.waitMinutes} min
            </span>
          </div>

          <Link
            href={`/confirm?from=${e.slug}`}
            className="flex items-center justify-center h-13 mt-4 rounded-[14px] font-extrabold text-white w-full active:scale-[0.98] transition-transform"
            style={{
              background: "linear-gradient(135deg,#07984a,#13b45b)",
              boxShadow: "0 4px 20px rgba(7,152,74,.35)",
              height: 52,
            }}
          >
            {t.joinQueue}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
