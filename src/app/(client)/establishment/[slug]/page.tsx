"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft, Share2, Heart, MapPin, Star, Clock, Phone, Globe, CheckCircle
} from "lucide-react";
import { WaitBadge } from "@/components/tornoo/WaitBadge";
import { api } from "@/services/api";
import { formatWaitTime } from "@/lib/utils";

export default function EstablishmentPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const { data: establishment, isLoading } = useQuery({
    queryKey: ["establishment", slug],
    queryFn: () => api.establishments.bySlug(slug),
  });

  const { data: queues = [] } = useQuery({
    queryKey: ["queues", establishment?.id],
    queryFn: () => api.queues.byEstablishment(establishment!.id),
    enabled: !!establishment,
  });

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

  return (
    <div className="bg-white min-h-svh">
      {/* Hero */}
      <div className="relative h-64">
        <Image
          src={e.imageUrl}
          alt={e.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Back/share/heart */}
        <div className="absolute top-0 left-0 right-0 flex justify-between p-4 pt-safe-top">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow"
            aria-label="Retour"
          >
            <ChevronLeft size={20} className="text-ink" />
          </button>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow" aria-label="Partager">
              <Share2 size={18} className="text-ink" />
            </button>
            <button className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow" aria-label="Favori">
              <Heart size={18} className="text-ink" />
            </button>
          </div>
        </div>

        {/* Bottom info overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end gap-3">
          <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shrink-0 shadow-lg">
            <Image src={e.imageUrl} alt="" width={80} height={80} className="w-full h-full object-cover" />
          </div>
          <div className="text-white">
            <div className="flex items-center gap-1.5">
              <h1 className="text-2xl font-black leading-tight">{e.name}</h1>
              {e.verified && <CheckCircle size={18} className="text-tornoo-green" />}
            </div>
            <p className="text-sm text-white/80">{e.category}</p>
            <div className="flex items-center gap-2 mt-1 text-sm text-white/80">
              <Star size={13} className="text-[#F7C400] fill-[#F7C400]" />
              <span className="font-bold">{e.rating}</span>
              <span>({e.reviewCount} avis)</span>
              <span>·</span>
              <MapPin size={13} />
              <span>{e.city}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pb-32 max-w-lg mx-auto space-y-4 pt-4">
        {/* Wait card */}
        <div className="bg-white rounded-[22px] p-5 border border-line shadow-1 flex items-center justify-between">
          <div>
            <p className="text-sm text-ink-3 font-medium">Attente actuelle</p>
            <div className="text-4xl font-black mt-1" style={{ color: e.waitLevel === "low" ? "#07984a" : e.waitLevel === "mod" ? "#ff9300" : "#ef2b24" }}>
              {formatWaitTime(e.waitMinutes)}
            </div>
            <WaitBadge minutes={e.waitMinutes} level={e.waitLevel} showLabel className="mt-1.5" />
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
            <Clock size={15} className="text-ink-3" />
            <span className="text-ink-2">Ouvert aujourd'hui</span>
          </div>
          <span className="text-sm font-bold text-ink">{e.openHours}</span>
        </div>

        {/* Services */}
        {e.services.length > 0 && (
          <section>
            <h2 className="text-xl font-black text-ink mb-3">Services</h2>
            <div className="space-y-2">
              {e.services.map((s) => (
                <div key={s.id} className="bg-white rounded-[18px] px-4 py-3 flex items-center justify-between border border-line">
                  <span className="font-bold text-ink">{s.name}</span>
                  <div className="flex items-center gap-3 text-sm text-ink-3">
                    <span className="flex items-center gap-1"><Clock size={13} />{s.durationMinutes} min</span>
                    {s.price && <span className="font-bold text-ink">{s.price} {s.currency}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Queues */}
        {queues.length > 0 && (
          <section>
            <h2 className="text-xl font-black text-ink mb-3">Files d'attente</h2>
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
                  <WaitBadge minutes={q.estimatedWaitMinutes} size="sm" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact */}
        <section>
          <h2 className="text-xl font-black text-ink mb-3">Contact</h2>
          <div className="space-y-2">
            {e.phone && (
              <a href={`tel:${e.phone}`} className="flex items-center gap-3 bg-surface-2 rounded-[16px] px-4 py-3 border border-line">
                <Phone size={16} className="text-tornoo-green" />
                <span className="font-medium text-ink">{e.phone}</span>
              </a>
            )}
            {e.website && (
              <div className="flex items-center gap-3 bg-surface-2 rounded-[16px] px-4 py-3 border border-line">
                <Globe size={16} className="text-tornoo-green" />
                <span className="font-medium text-ink">{e.website}</span>
              </div>
            )}
            <div className="flex items-start gap-3 bg-surface-2 rounded-[16px] px-4 py-3 border border-line">
              <MapPin size={16} className="text-tornoo-green mt-0.5 shrink-0" />
              <span className="font-medium text-ink">{e.address}, {e.city}</span>
            </div>
          </div>
        </section>
      </div>

      {/* CTA bottom */}
      {e.waitLevel !== "high" && (
        <div className="fixed bottom-20 left-0 right-0 px-4 max-w-lg mx-auto">
          <Link
            href={`/my-turn?from=${e.slug}`}
            className="flex items-center justify-center gap-2 h-14 rounded-[15px] font-extrabold text-white w-full"
            style={{ background: e.waitLevel === "low" ? "#07984a" : "#ff9300", boxShadow: "0 4px 20px rgba(7,152,74,.3)" }}
          >
            Prendre mon tour
          </Link>
          <p className="text-center text-xs text-ink-3 mt-2">Annulation gratuite à tout moment</p>
        </div>
      )}
    </div>
  );
}
