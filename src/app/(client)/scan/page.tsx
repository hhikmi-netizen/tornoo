"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lightning, LightningSlash, WarningCircle } from "@phosphor-icons/react";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { MOCK_ESTABLISHMENTS } from "@/lib/mock-data";
import { useI18n } from "@/i18n/context";

// Simulate parsing a tornoo QR code → establishment slug
function parseQRCode(data: string): string | null {
  // QR format: "tornoo:barber-club-maarif" or full URL "https://tornoo.ma/establishment/barber-club-maarif"
  if (data.startsWith("tornoo:")) return data.slice(7);
  const match = data.match(/\/establishment\/([^/?]+)/);
  if (match) return match[1];
  // For demo: any QR triggers a scan of a random establishment
  return null;
}

export default function ScanPage() {
  const router = useRouter();
  const { t } = useI18n();
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<unknown>(null);
  const [torchOn, setTorchOn] = useState(false);
  const [scanned, setScanned] = useState<typeof MOCK_ESTABLISHMENTS[0] | null>(null);
  const [camError, setCamError] = useState<string | null>(null);
  const [hasCamera, setHasCamera] = useState(false);

  useEffect(() => {
    let destroyed = false;

    (async () => {
      try {
        // Dynamically import to avoid SSR
        const QrScanner = (await import("qr-scanner")).default;

        // Check camera availability
        const cams = await QrScanner.listCameras(false);
        if (cams.length === 0) {
          setCamError("Aucune caméra détectée sur cet appareil.");
          return;
        }

        if (!videoRef.current || destroyed) return;
        setHasCamera(true);

        const scanner = new QrScanner(
          videoRef.current,
          (result) => {
            const slug = parseQRCode(result.data);
            const establishment =
              MOCK_ESTABLISHMENTS.find((e) => e.slug === slug) ??
              // Demo fallback: pick first matching data pattern
              MOCK_ESTABLISHMENTS[Math.floor(Math.random() * MOCK_ESTABLISHMENTS.length)];
            setScanned(establishment);
            scanner.stop();
          },
          {
            preferredCamera: "environment",
            highlightScanRegion: true,
            highlightCodeOutline: true,
            maxScansPerSecond: 5,
          }
        );

        scannerRef.current = scanner;
        await scanner.start();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes("NotAllowed") || msg.includes("Permission")) {
          setCamError("Accès à la caméra refusé. Autorisez l'accès dans les paramètres.");
        } else {
          setCamError("Impossible d'accéder à la caméra.");
        }
      }
    })();

    return () => {
      destroyed = true;
      const s = scannerRef.current as { destroy?: () => void } | null;
      s?.destroy?.();
    };
  }, []);

  const toggleTorch = async () => {
    const s = scannerRef.current as { toggleFlash?: () => Promise<void> } | null;
    await s?.toggleFlash?.();
    setTorchOn((v) => !v);
  };

  const e = scanned;

  return (
    <div className="fixed inset-0 bg-[#061819] text-white flex flex-col overflow-hidden">
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
          onClick={toggleTorch}
          disabled={!hasCamera}
          className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center active:bg-white/20 transition-colors disabled:opacity-30"
          aria-label="Flash"
        >
          {torchOn
            ? <Lightning weight="fill" size={20} className="text-[#f7c400]" />
            : <LightningSlash weight="fill" size={20} className="text-white/70" />
          }
        </button>
      </div>

      {/* Camera error */}
      <AnimatePresence>
        {camError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="mx-6 mt-2 bg-white/10 rounded-2xl p-4 flex gap-3 items-start z-10"
          >
            <WarningCircle weight="fill" size={22} className="text-[#ff9300] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">{camError}</p>
              <p className="text-xs text-white/60 mt-1">
                Sur mobile : autorisez la caméra puis rechargez la page.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instruction */}
      {!scanned && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center px-6 mt-4 z-10"
        >
          <h1 className="text-[22px] font-black tracking-tight">{t.scanInstruction}</h1>
          <p className="text-white/50 mt-1 text-sm font-medium">{t.placeQR}</p>
        </motion.div>
      )}

      {/* Video feed + frame overlay */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: hasCamera ? 1 : 0 }}
          playsInline
          muted
        />

        {/* Dark vignette around scanner area */}
        {!scanned && (
          <div className="absolute inset-0 pointer-events-none"
               style={{ background: "radial-gradient(ellipse 64% 56% at 50% 46%, transparent 45%, rgba(6,24,25,0.82) 70%)" }} />
        )}

        {/* Corner frame */}
        {!scanned && !camError && (
          <div className="relative w-64 h-64 z-10">
            {[
              { pos: "top-0 left-0",   border: "border-t-[3px] border-l-[3px]", rnd: "rounded-tl-2xl" },
              { pos: "top-0 right-0",  border: "border-t-[3px] border-r-[3px]", rnd: "rounded-tr-2xl" },
              { pos: "bottom-0 left-0",  border: "border-b-[3px] border-l-[3px]", rnd: "rounded-bl-2xl" },
              { pos: "bottom-0 right-0", border: "border-b-[3px] border-r-[3px]", rnd: "rounded-br-2xl" },
            ].map(({ pos, border, rnd }) => (
              <div key={pos} className={`absolute w-8 h-8 ${pos} ${border} ${rnd}`} style={{ borderColor: "#07984a" }} />
            ))}
          </div>
        )}

        {/* No camera placeholder */}
        {!hasCamera && !camError && (
          <div className="flex flex-col items-center gap-3 text-white/30 z-10">
            <div className="w-64 h-64 rounded-[26px] border-2 border-white/10 flex items-center justify-center">
              <span className="text-5xl">📷</span>
            </div>
            <p className="text-sm font-medium">Chargement de la caméra…</p>
          </div>
        )}
      </div>

      {/* Scanned result card */}
      <AnimatePresence>
        {e && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="absolute bottom-8 left-4 right-4 z-20"
          >
            <div className="bg-white text-ink rounded-[24px] p-5 shadow-pop">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0">
                  <ImageWithFallback
                    src={e.imageUrl} alt={e.name} width={56} height={56}
                    className="w-full h-full object-cover"
                    fallback={
                      <div className="w-full h-full flex items-center justify-center bg-low-bg">
                        <span className="text-xl font-black text-tornoo-green">{e.name.charAt(0)}</span>
                      </div>
                    }
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-black text-ink truncate">{e.name}</h2>
                  <p className="text-sm text-ink-3">{e.category} · {e.city}</p>
                </div>
                <span
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-sm font-black shrink-0"
                  style={{
                    background: e.waitLevel === "high" ? "#fde7e6" : e.waitLevel === "mod" ? "#fff1de" : "#e4f6ec",
                    color: e.waitLevel === "high" ? "#ef2b24" : e.waitLevel === "mod" ? "#ff9300" : "#07984a",
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: e.waitLevel === "high" ? "#ef2b24" : e.waitLevel === "mod" ? "#ff9300" : "#07984a" }} />
                  {e.waitMinutes} min
                </span>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => { setScanned(null); const s = scannerRef.current as { start?: () => void } | null; s?.start?.(); }}
                  className="h-[52px] px-5 rounded-[14px] font-bold text-ink-2 bg-surface-2 border border-line flex-shrink-0"
                >
                  Rescanner
                </button>
                <Link
                  href={`/confirm?from=${e.slug}`}
                  className="flex-1 flex items-center justify-center h-[52px] rounded-[14px] font-extrabold text-white active:scale-[0.98] transition-transform"
                  style={{ background: "linear-gradient(135deg,#07984a,#13b45b)", boxShadow: "0 4px 20px rgba(7,152,74,.35)" }}
                >
                  {t.joinQueue}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
