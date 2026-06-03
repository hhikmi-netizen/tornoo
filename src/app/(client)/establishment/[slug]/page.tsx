"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  CaretLeft, ShareNetwork, Heart, MapPin, Star, Clock, Phone, Globe, CheckCircle
} from "@phosphor-icons/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useToast } from "@/components/ui/Toast";
import { api } from "@/services/api";
import { formatWaitTime } from "@/lib/utils";
import { MOCK_USER } from "@/lib/mock-data";
import { useI18n } from "@/i18n/context";

export default function EstablishmentPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { t } = useI18n();
  const { toast } = useToast();

  const [isFav, setIsFav] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);

  const { data: establishment, isLoading } = useQuery({
    queryKey: ["establishment", slug],
    queryFn: () => api.establishments.bySlug(slug),
  });

  useEffect(() => {
    if (establishment) setIsFav(MOCK_USER.favorites.includes(establishment.id));
  }, [establishment]);

  const { data: queues = [] } = useQuery({
    queryKey: ["queues", establishment?.id],
    queryFn: () => api.queues.byEstablishment(establishment!.id),
    enabled: !!establishment,
  });

  /* ── Hero parallax ──────────────────────────────── */
  useEffect(() => {
    if (!heroRef.current || !imgWrapRef.current) return;
    const tween = gsap.to(imgWrapRef.current, {
      yPercent: 20,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "+=300",
        scrub: true,
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="bg-surface-2 min-h-svh">
        <div className="h-64 bg-line animate-pulse" />
        <div className="p-4 space-y-3">
          <div className="h-8 w-48 bg-line rounded-xl animate-pulse" />
          <div className="h-4 w-32 bg-line rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (!establishment) {
    return (
      <div className="min-h-svh flex items-center justify-center">
        <div className="text-center">
          <p className="font-bold text-ink-2">Établissement introuvable</p>
          <Link href="/search" className="mt-3 text-sm font-bold text-tornoo-green block">
            Retour à la recherche
          </Link>
        </div>
      </div>
    );
  }

  const e = establishment;
  const heroBg = e.waitLevel === "low" ? "#e4f6ec" : e.waitLevel === "mod" ? "#fff1de" : "#fde7e6";
  const heroFg = e.waitLevel === "low" ? "#07984a" : e.waitLevel === "mod" ? "#ff9300" : "#ef2b24";

  return (
    <div className="bg-white min-h-svh">
      {/* Hero */}
      <div ref={heroRef} className="relative h-[300px] overflow-hidden">
        <div ref={imgWrapRef} className="absolute inset-[-15%] w-full">
          <ImageWithFallback
            src={e.imageUrl}
            alt={e.name}
            fill
            className="object-cover"
            priority
            fallback={
              <div className="absolute inset-0 flex items-center justify-center" style={{ background: heroBg }}>
                <span className="text-[120px] font-black leading-none opacity-20" style={{ color: heroFg }}>{e.name.charAt(0)}</span>
              </div>
            }
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Back/share/heart */}
        <div className="absolute top-0 left-0 right-0 flex justify-between p-4 pt-safe-top">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow"
            aria-label="Retour"
          >
            <CaretLeft weight="bold" size={20} className="text-ink" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => toast("Lien copié !", "success")}
              className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow"
              aria-label="Partager"
            >
              <ShareNetwork weight="bold" size={18} className="text-ink" />
            </button>
            <motion.button
              whileTap={{ scale: 1.3 }}
              onClick={() => {
                setIsFav((v) => {
                  toast(v ? "Retiré des favoris" : "Ajouté aux favoris", v ? "info" : "success");
                  return !v;
                });
              }}
              className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow"
              aria-label="Favori"
            >
              <Heart
                size={18}
                weight={isFav ? "fill" : "regular"}
                className={isFav ? "text-[#ef2b24]" : "text-ink"}
              />
            </motion.button>
          </div>
        </div>

        {/* Bottom info overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end gap-3">
          <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shrink-0 shadow-lg">
            <ImageWithFallback
              src={e.imageUrl}
              alt=""
              width={80}
              height={80}
              className="w-full h-full object-cover"
              fallback={
                <div className="w-full h-full flex items-center justify-center" style={{ background: heroBg }}>
                  <span className="text-2xl font-black" style={{ color: heroFg }}>{e.name.charAt(0)}</span>
                </div>
              }
            />
          </div>
          <div className="text-white min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h1 className="text-2xl font-black leading-tight truncate">{e.name}</h1>
              {e.verified && <CheckCircle weight="fill" size={18} className="text-tornoo-green shrink-0" />}
            </div>
            <p className="text-sm text-white/80">{e.category}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-sm text-white/90">
                <Star weight="fill" size={13} className="text-[#F7C400]" />
                <span className="font-bold">{e.rating}</span>
                <span className="text-white/70">({e.reviewCount})</span>
              </span>
              <span className="flex items-center gap-1 text-sm text-white/80 min-w-0">
                <MapPin weight="duotone" size={13} className="shrink-0" />
                <span className="truncate">{e.city}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pb-32 max-w-lg mx-auto space-y-4 pt-4">
        {/* Wait card */}
        <div className="bg-white rounded-[22px] p-5 border border-line shadow-1 flex items-center justify-between">
          <div>
            <p className="text-sm text-ink-3 font-medium">{t.currentWait}</p>
            <div className="text-4xl font-black mt-1" style={{ color: e.waitLevel === "low" ? "#07984a" : e.waitLevel === "mod" ? "#ff9300" : "#ef2b24" }}>
              {formatWaitTime(e.waitMinutes)}
            </div>
            <span className="mt-1.5 inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-xs font-black border"
              style={{ background: heroBg, color: heroFg, borderColor: heroFg + "40" }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: heroFg }} />
              {e.waitLevel === "low" ? "Peu d'attente" : e.waitLevel === "mod" ? "Attente modérée" : "Forte attente"}
            </span>
          </div>
          <svg viewBox="0 0 100 100" className="w-24 h-24 -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#eaedf0" strokeWidth="14" />
            <circle
              cx="50" cy="50" r="42" fill="none"
              stroke={e.waitLevel === "low" ? "#07984a" : e.waitLevel === "mod" ? "#ff9300" : "#ef2b24"}
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={`${(1 - Math.min(e.waitMinutes / 60, 1)) * 264} 264`}
            />
          </svg>
        </div>

        {/* Info strip */}
        <div className="bg-surface-2 rounded-[16px] px-4 py-3 flex items-center justify-between border border-line">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Clock weight="duotone" size={15} className="text-ink-3" />
            <span className="text-ink-2">{t.openToday}</span>
          </div>
          <span className="text-sm font-bold text-ink">{e.openHours}</span>
        </div>

        {/* Services */}
        {e.services.length > 0 && (
          <section>
            <div className="mb-3">
              <p className="section-eyebrow mb-0.5">{t.offered}</p>
              <h2 className="text-xl font-black text-ink leading-none">{t.services}</h2>
            </div>
            <div className="bg-white rounded-[22px] border border-line overflow-hidden shadow-1">
              {e.services.map((s, i) => (
                <div
                  key={s.id}
                  className={`px-4 py-4 flex items-center justify-between ${i < e.services.length - 1 ? "border-b border-line" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-low-bg flex items-center justify-center shrink-0">
                      <span className="text-xs font-black text-tornoo-green">{i + 1}</span>
                    </div>
                    <span className="font-bold text-ink">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="flex items-center gap-1 text-xs font-medium text-ink-3">
                      <Clock weight="duotone" size={12} />{s.durationMinutes} min
                    </span>
                    {s.price && (
                      <span className="text-sm font-black text-ink bg-surface-2 px-2.5 py-1 rounded-full">
                        {s.price} {s.currency}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Queues */}
        {queues.length > 0 && (
          <section>
            <div className="mb-3">
              <p className="section-eyebrow mb-0.5">{t.available}</p>
              <h2 className="text-xl font-black text-ink leading-none">{t.queues}</h2>
            </div>
            <div className="space-y-2">
              {queues.map((q) => (
                <div key={q.id} className="bg-white rounded-[18px] px-4 py-3 flex items-center justify-between border border-line">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-navy-bg flex items-center justify-center" style={{ background: "#062e24" }}>
                      <span className="text-white font-black">{q.label}</span>
                    </div>
                    <div>
                      <p className="font-bold text-ink">{q.serviceName}</p>
                      <p className="text-xs text-ink-3">{q.waitingCount} personnes · ~{q.estimatedWaitMinutes} min</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 h-6 px-2.5 rounded-full text-xs font-black"
                    style={{ background: "#e4f6ec", color: "#07984a" }}>
                    ~{q.estimatedWaitMinutes} min
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact */}
        <section>
          <h2 className="text-xl font-black text-ink mb-3">{t.contact}</h2>
          <div className="space-y-2">
            {e.phone && (
              <a href={`tel:${e.phone}`} className="flex items-center gap-3 bg-surface-2 rounded-[16px] px-4 py-3 border border-line">
                <Phone weight="duotone" size={16} className="text-tornoo-green" />
                <span className="font-medium text-ink">{e.phone}</span>
              </a>
            )}
            {e.website && (
              <div className="flex items-center gap-3 bg-surface-2 rounded-[16px] px-4 py-3 border border-line">
                <Globe size={16} weight="duotone" className="text-tornoo-green" />
                <span className="font-medium text-ink">{e.website}</span>
              </div>
            )}
            <div className="flex items-start gap-3 bg-surface-2 rounded-[16px] px-4 py-3 border border-line">
              <MapPin weight="duotone" size={16} className="text-tornoo-green mt-0.5 shrink-0" />
              <span className="font-medium text-ink">{e.address}, {e.city}</span>
            </div>
          </div>
        </section>
      </div>

      {/* CTA bottom */}
      {e.waitLevel !== "high" && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-line/50 px-4 pt-3 pb-safe-bottom max-w-lg mx-auto">
          <Link
            href={`/confirm?from=${e.slug}`}
            className="flex items-center justify-center gap-2 h-14 rounded-[15px] font-extrabold text-white w-full active:scale-[0.98] transition-transform"
            style={{
              background: e.waitLevel === "low"
                ? "linear-gradient(135deg,#07984a,#13b45b)"
                : "linear-gradient(135deg,#ff9300,#ffb000)",
              boxShadow: e.waitLevel === "low"
                ? "0 4px 20px rgba(7,152,74,.35)"
                : "0 4px 20px rgba(255,147,0,.35)"
            }}
          >
            {t.takeTurn}
          </Link>
          <p className="text-center text-xs text-ink-3 mt-2 mb-1">{t.freeCancel}</p>
        </div>
      )}
    </div>
  );
}
