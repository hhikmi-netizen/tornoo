"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  CaretLeft,
  Star,
  CheckCircle,
  Clock,
} from "@phosphor-icons/react";
import { useToast } from "@/components/ui/Toast";
import { api } from "@/services/api";
import { MOCK_USER } from "@/lib/mock-data";
import { ProfessionalHero } from "@/components/tornoo/pro-profile/ProfessionalHero";
import { ProfessionalContactActions } from "@/components/tornoo/pro-profile/ProfessionalContactActions";
import { ProfessionalAboutSection } from "@/components/tornoo/pro-profile/ProfessionalAboutSection";
import { ProfessionalDetailsList } from "@/components/tornoo/pro-profile/ProfessionalDetailsList";
import { ProfessionalGallery } from "@/components/tornoo/pro-profile/ProfessionalGallery";
import type { OpeningHour, OpeningHourDay, SocialLink, ProfessionalPhoto } from "@/types/professional";

const OPENING_HOURS_FALLBACK: OpeningHour[] = [
  { day: "Lun" as OpeningHourDay, enabled: true, open: "09:00", close: "18:00" },
  { day: "Mar" as OpeningHourDay, enabled: true, open: "09:00", close: "18:00" },
  { day: "Mer" as OpeningHourDay, enabled: true, open: "09:00", close: "18:00" },
  { day: "Jeu" as OpeningHourDay, enabled: true, open: "09:00", close: "18:00" },
  { day: "Ven" as OpeningHourDay, enabled: true, open: "09:00", close: "18:00" },
  { day: "Sam" as OpeningHourDay, enabled: false, open: "09:00", close: "13:00" },
  { day: "Dim" as OpeningHourDay, enabled: false, open: "09:00", close: "13:00" },
];

export default function EstablishmentPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { toast } = useToast();

  const [isFav, setIsFav] = useState(false);

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

  if (isLoading) {
    return (
      <div className="bg-surface-2 min-h-svh">
        <div className="h-56 bg-line animate-pulse" />
        <div className="p-4 space-y-3 mt-10">
          <div className="h-8 w-48 bg-line rounded-xl animate-pulse" />
          <div className="h-4 w-32 bg-line rounded-lg animate-pulse" />
          <div className="h-20 bg-line rounded-[20px] animate-pulse" />
          <div className="h-36 bg-line rounded-[20px] animate-pulse" />
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

  const photos: ProfessionalPhoto[] = [
    { id: "ph1", url: e.imageUrl, alt: e.name },
    { id: "ph2", url: e.imageUrl, alt: e.name },
    { id: "ph3", url: e.imageUrl, alt: e.name },
    { id: "ph4", url: e.imageUrl, alt: e.name },
  ];

  const socialLinks: SocialLink[] = [];
  if (e.website) {
    socialLinks.push({ id: "w1", platform: "website", value: e.website });
  }

  const serviceNames = e.services.map((s) => s.name);
  const waitColor =
    e.waitLevel === "low" ? "#07984a" : e.waitLevel === "mod" ? "#ff9300" : "#ef2b24";
  const waitBg =
    e.waitLevel === "low" ? "#e4f6ec" : e.waitLevel === "mod" ? "#fff1de" : "#fde7e6";

  return (
    <div className="bg-surface-2 min-h-svh">
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center px-4 pt-safe-top py-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow"
            aria-label="Retour"
          >
            <CaretLeft weight="bold" size={20} className="text-ink" />
          </button>
        </div>

        <ProfessionalHero
          coverUrl={e.imageUrl}
          logoUrl={e.logoUrl ?? e.imageUrl}
          name={e.name}
          isVerified={e.verified}
          isOwner={false}
        />
      </div>

      <div className="px-4 pb-32 max-w-lg mx-auto">
        <div className="pt-14 pb-4">
          <div className="flex items-center gap-1.5 mb-1">
            <h1 className="text-2xl font-black text-ink leading-tight">{e.name}</h1>
            {e.verified && (
              <CheckCircle weight="fill" size={20} className="text-tornoo-green shrink-0" />
            )}
          </div>
          <p className="text-sm text-ink-3 mb-2">{e.category}</p>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1">
              <Star weight="fill" size={14} className="text-[#f7c400]" />
              <span className="text-sm font-black text-ink">{e.rating}</span>
              <span className="text-xs text-ink-3">({e.reviewCount} avis)</span>
            </div>
            {e.isOpen && (
              <span className="flex items-center gap-1 h-6 px-2.5 rounded-full text-xs font-bold text-tornoo-green bg-tornoo-green/10">
                <motion.span
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-tornoo-green"
                />
                Ouvert
              </span>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <ProfessionalContactActions
            phone={e.phone}
            address={e.address}
            city={e.city}
            isFav={isFav}
            onFavToggle={() => {
              setIsFav((v) => {
                toast(v ? "Retiré des favoris" : "Ajouté aux favoris", v ? "info" : "success");
                return !v;
              });
            }}
          />

          <ProfessionalAboutSection
            description={
              `${e.category} — ${e.city}. ${e.services.map((s) => s.name).join(", ")}.`
            }
          />

          <ProfessionalDetailsList
            address={e.address}
            city={e.city}
            phone={e.phone ?? ""}
            openingHours={OPENING_HOURS_FALLBACK}
            services={serviceNames}
            socialLinks={socialLinks}
          />

          <ProfessionalGallery photos={photos} />

          {queues.length > 0 && (
            <div className="bg-white rounded-[20px] border border-line shadow-1 overflow-hidden">
              <div className="px-4 py-3 border-b border-line flex items-center justify-between">
                <h2 className="text-base font-black text-ink">Files d&apos;attente</h2>
              </div>
              {queues.map((q, i) => (
                <div
                  key={q.id}
                  className={`px-4 py-3 flex items-center justify-between ${
                    i < queues.length - 1 ? "border-b border-line" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: "#062e24" }}
                    >
                      <span className="text-white font-black">{q.label}</span>
                    </div>
                    <div>
                      <p className="font-bold text-ink text-sm">{q.serviceName}</p>
                      <p className="text-xs text-ink-3">
                        {q.waitingCount} personnes · ~{q.estimatedWaitMinutes} min
                      </p>
                    </div>
                  </div>
                  <span
                    className="inline-flex items-center gap-1 h-7 px-3 rounded-full text-xs font-black"
                    style={{ background: "#e4f6ec", color: "#07984a" }}
                  >
                    <Clock weight="fill" size={11} />
                    ~{q.estimatedWaitMinutes} min
                  </span>
                </div>
              ))}
            </div>
          )}

          {e.services.length > 0 && (
            <div className="bg-white rounded-[20px] border border-line shadow-1 overflow-hidden">
              <div className="px-4 py-3 border-b border-line">
                <h2 className="text-base font-black text-ink">Services</h2>
              </div>
              {e.services.map((s, i) => (
                <div
                  key={s.id}
                  className={`px-4 py-3 flex items-center justify-between ${
                    i < e.services.length - 1 ? "border-b border-line" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-low-bg flex items-center justify-center shrink-0">
                      <span className="text-xs font-black text-tornoo-green">{i + 1}</span>
                    </div>
                    <span className="text-sm font-bold text-ink">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="flex items-center gap-1 text-xs text-ink-3">
                      <Clock weight="duotone" size={11} />
                      {s.durationMinutes} min
                    </span>
                    {s.price && (
                      <span className="text-xs font-black text-ink bg-surface-2 px-2 py-0.5 rounded-full">
                        {s.price} {s.currency}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {e.waitLevel !== "high" && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-line/50 px-4 pt-3 pb-safe-bottom">
          <Link
            href={`/confirm?from=${e.slug}`}
            className="flex items-center justify-center gap-2 h-14 rounded-[15px] font-extrabold text-white w-full active:scale-[0.98] transition-transform"
            style={{
              background:
                e.waitLevel === "low"
                  ? "linear-gradient(135deg,#07984a,#13b45b)"
                  : "linear-gradient(135deg,#ff9300,#ffb000)",
              boxShadow:
                e.waitLevel === "low"
                  ? "0 4px 20px rgba(7,152,74,.35)"
                  : "0 4px 20px rgba(255,147,0,.35)",
            }}
          >
            <span
              className="w-2 h-2 rounded-full mr-1"
              style={{ background: "rgba(255,255,255,0.6)" }}
            />
            Prendre mon tour
            <span
              className="inline-flex items-center gap-1 ml-2 px-2 py-0.5 rounded-full text-xs font-black"
              style={{ background: waitBg, color: waitColor }}
            >
              ~{e.waitMinutes} min
            </span>
          </Link>
          <p className="text-center text-xs text-ink-3 mt-2 mb-1">
            Annulation gratuite
          </p>
        </div>
      )}
    </div>
  );
}
