"use client";

import Link from "next/link";
import { MapPin, Star, CheckCircle } from "@phosphor-icons/react";
import { TurnButton } from "./TurnButton";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { cn } from "@/lib/utils";
import type { Establishment } from "@/types";
import { useI18n } from "@/i18n/context";

interface EstablishmentCardProps {
  establishment: Establishment;
  variant?: "row" | "compact";
  className?: string;
}

export function EstablishmentCard({ establishment: e, variant = "row", className }: EstablishmentCardProps) {
  const { t } = useI18n();
  const bgColor = e.waitLevel === "low" ? "#e4f6ec" : e.waitLevel === "mod" ? "#fff1de" : "#fde7e6";
  const fgColor = e.waitLevel === "low" ? "#07984a" : e.waitLevel === "mod" ? "#ff9300" : "#ef2b24";

  if (variant === "compact") {
    return (
      <Link
        href={`/establishment/${e.slug}`}
        className={cn(
          "flex flex-col items-center bg-white rounded-[22px] p-4 w-36 shrink-0 text-center",
          "shadow-[0_2px_6px_rgba(20,24,33,.06),0_18px_40px_-16px_rgba(20,24,33,.20)]",
          "border border-[#eaedf0] active:scale-[0.97] transition-transform",
          className
        )}
      >
        <div className="w-16 h-16 rounded-full overflow-hidden bg-surface-2">
          <ImageWithFallback
            src={e.imageUrl}
            alt={e.name}
            width={64}
            height={64}
            className="w-full h-full object-cover"
            fallback={
              <div className="w-full h-full flex items-center justify-center" style={{ background: bgColor }}>
                <span className="text-2xl font-black" style={{ color: fgColor }}>{e.name.charAt(0)}</span>
              </div>
            }
          />
        </div>
        <h3 className="mt-2 font-extrabold text-sm text-ink leading-tight line-clamp-1">{e.name}</h3>
        <p className="text-xs text-ink-3 mt-0.5 line-clamp-1">{e.city}</p>
        <span
          className="mt-2 inline-flex items-center gap-1 h-6 px-2.5 rounded-full text-xs font-black"
          style={{ background: bgColor, color: fgColor }}
        >
          <span className="w-1 h-1 rounded-full" style={{ background: fgColor }} />
          {e.waitMinutes < 60 ? `${e.waitMinutes} min` : `${Math.floor(e.waitMinutes / 60)}h`}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={`/establishment/${e.slug}`}
      className={cn(
        "flex gap-4 bg-white rounded-[22px] p-3",
        "shadow-[0_2px_6px_rgba(20,24,33,.06),0_18px_40px_-16px_rgba(20,24,33,.20)]",
        "border border-[#eaedf0] active:scale-[0.98] transition-transform",
        className
      )}
    >
      <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-surface-2">
        <ImageWithFallback
          src={e.imageUrl}
          alt={e.name}
          width={96}
          height={96}
          className="w-full h-full object-cover"
          fallback={
            <div className="w-full h-full flex items-center justify-center" style={{ background: bgColor }}>
              <span className="text-3xl font-black" style={{ color: fgColor }}>{e.name.charAt(0)}</span>
            </div>
          }
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <h3 className="text-lg font-black text-ink line-clamp-2 leading-tight min-w-0 flex-1">{e.name}</h3>
          {e.verified && (
            <CheckCircle size={16} weight="fill" className="text-tornoo-green shrink-0" aria-label="Vérifié" />
          )}
        </div>
        <p className="text-sm text-ink-3 mt-0.5">{e.category}</p>
        <div className="flex items-center gap-1 mt-1">
          <MapPin size={12} weight="duotone" className="text-ink-3" />
          <p className="text-xs text-ink-3">
            {e.city}
            {e.distance != null && ` · ${e.distance} km`}
          </p>
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <Star size={13} weight="fill" className="text-[#F7C400]" />
          <span className="text-xs font-bold text-ink-2">{e.rating}</span>
          <span className="text-xs text-ink-3">({e.reviewCount} {t.reviews})</span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-sm font-black shrink-0"
            style={{ background: bgColor, color: fgColor }}
          >
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: fgColor }} />
            {e.waitMinutes < 60 ? `${e.waitMinutes} min` : `${Math.floor(e.waitMinutes / 60)}h${e.waitMinutes % 60 || ""}`}
          </span>
          <TurnButton establishment={e} />
        </div>
      </div>
    </Link>
  );
}
