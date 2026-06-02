"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { X, Zap } from "lucide-react";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { MOCK_ESTABLISHMENTS } from "@/lib/mock-data";
import { WaitBadge } from "@/components/tornoo/WaitBadge";

export default function ScanPage() {
  const router = useRouter();
  const e = MOCK_ESTABLISHMENTS[2]; // Simulate scanned establishment

  return (
    <div className="fixed inset-0 bg-[#061819] text-white flex flex-col">
      {/* Controls */}
      <div className="flex justify-between items-center px-6 pt-safe-top pb-4 relative z-10">
        <button
          onClick={() => router.back()}
          className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center"
          aria-label="Fermer"
        >
          <X size={22} />
        </button>
        <button className="px-4 h-10 rounded-full bg-white/10 font-bold text-sm">
          Scanner
        </button>
        <button className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center" aria-label="Flash">
          <Zap size={20} />
        </button>
      </div>

      {/* Instruction */}
      <div className="text-center px-6 mt-10">
        <h1 className="text-2xl font-black">Scannez pour rejoindre la file</h1>
        <p className="text-white/60 mt-2 text-sm">Placez le QR Code dans le cadre</p>
      </div>

      {/* Scanner frame */}
      <div className="flex justify-center mt-8">
        <div
          className="w-64 h-64 bg-white/5 rounded-3xl border-2 border-tornoo-green/60 flex items-center justify-center relative overflow-hidden"
          style={{ boxShadow: "0 0 50px rgba(7,152,74,.2)" }}
        >
          {/* Corner markers */}
          {["top-left", "top-right", "bottom-left", "bottom-right"].map((pos) => (
            <div
              key={pos}
              className={`absolute w-8 h-8 ${pos.includes("top") ? "top-3" : "bottom-3"} ${pos.includes("left") ? "left-3" : "right-3"}`}
              style={{
                borderColor: "#07984a",
                borderStyle: "solid",
                borderTopWidth: pos.includes("top") ? 4 : 0,
                borderBottomWidth: pos.includes("bottom") ? 4 : 0,
                borderLeftWidth: pos.includes("left") ? 4 : 0,
                borderRightWidth: pos.includes("right") ? 4 : 0,
                borderRadius: 4,
              }}
            />
          ))}

          {/* QR placeholder */}
          <div className="grid grid-cols-7 gap-1 w-40 h-40">
            {Array.from({ length: 49 }).map((_, i) => (
              <div
                key={i}
                className="rounded-sm"
                style={{
                  background: [0,1,2,7,14,8,15,16,4,6,11,17,21,28,35,36,37,42,43,44,30,34,40,45,46,48,24,25,26].includes(i)
                    ? "rgba(255,255,255,0.7)"
                    : "transparent",
                }}
              />
            ))}
          </div>

          {/* Scan line */}
          <motion.div
            className="absolute left-4 right-4 h-0.5 rounded-full"
            style={{ background: "linear-gradient(90deg, transparent, #07984a, #07984a, transparent)" }}
            animate={{ top: ["20%", "80%", "20%"] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Scanned establishment card */}
      <div className="absolute bottom-24 left-4 right-4">
        <div className="bg-white text-ink rounded-[22px] p-5 shadow-pop">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full overflow-hidden">
              <ImageWithFallback
                src={e.imageUrl}
                alt={e.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
                fallback={
                  <div className="w-full h-full flex items-center justify-center bg-high-bg">
                    <span className="text-xl font-black text-high">{e.name.charAt(0)}</span>
                  </div>
                }
              />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-black">{e.name}</h2>
              <p className="text-sm text-ink-3">{e.city}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <WaitBadge minutes={e.waitMinutes} level={e.waitLevel} showLabel />
            <span className="px-3 py-1 rounded-full bg-surface-2 border border-line text-sm font-bold text-ink-2">
              ≈ {e.waitMinutes} min
            </span>
          </div>
          <Link
            href={`/confirm?from=${e.slug}`}
            className="flex items-center justify-center h-14 rounded-[15px] bg-tornoo-green text-white font-extrabold mt-4 w-full"
          >
            Rejoindre la file
          </Link>
        </div>
      </div>
    </div>
  );
}
