"use client";

import { Camera, CheckCircle } from "@phosphor-icons/react";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";

interface ProfessionalHeroProps {
  coverUrl?: string;
  logoUrl?: string;
  name: string;
  isVerified: boolean;
  isOwner?: boolean;
  onChangeCover?: () => void;
  onChangeLogo?: () => void;
}

export function ProfessionalHero({
  coverUrl,
  logoUrl,
  name,
  isVerified,
  isOwner,
  onChangeCover,
  onChangeLogo,
}: ProfessionalHeroProps) {
  return (
    <div className="relative">
      <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-emerald-800 to-emerald-600">
        {coverUrl && (
          <ImageWithFallback
            src={coverUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority
            fallback={
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 to-emerald-600" />
            }
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {isOwner && (
          <button
            onClick={onChangeCover}
            className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-lg"
            aria-label="Changer la couverture"
          >
            <Camera weight="fill" size={16} className="text-ink" />
          </button>
        )}
      </div>

      <div className="absolute bottom-0 left-4 translate-y-1/2">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow-lg bg-gradient-to-br from-emerald-700 to-emerald-500">
            {logoUrl && (
              <ImageWithFallback
                src={logoUrl}
                alt={name}
                width={80}
                height={80}
                sizes="80px"
                className="w-full h-full object-cover"
                fallback={
                  <div className="w-full h-full bg-gradient-to-br from-emerald-700 to-emerald-500 flex items-center justify-center">
                    <span className="text-2xl font-black text-white">{name.charAt(0)}</span>
                  </div>
                }
              />
            )}
            {!logoUrl && (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-700 to-emerald-500">
                <span className="text-2xl font-black text-white">{name.charAt(0)}</span>
              </div>
            )}
          </div>

          {isVerified && (
            <CheckCircle
              weight="fill"
              size={20}
              className="text-tornoo-green absolute bottom-0 right-0 bg-white rounded-full"
            />
          )}

          {isOwner && (
            <button
              onClick={onChangeLogo}
              className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-tornoo-green flex items-center justify-center shadow border-2 border-white"
              aria-label="Changer le logo"
            >
              <Camera weight="fill" size={10} className="text-white" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
