"use client";

import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import type { ProfessionalPhoto } from "@/types/professional";

interface ProfessionalGalleryProps {
  photos: ProfessionalPhoto[];
  onViewAll?: () => void;
}

export function ProfessionalGallery({ photos, onViewAll }: ProfessionalGalleryProps) {
  const shown = photos.slice(0, 4);

  if (!shown.length) return null;

  return (
    <div className="bg-white rounded-[20px] border border-line shadow-1 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-black text-ink">Galerie</h2>
        {onViewAll && photos.length > 4 && (
          <button onClick={onViewAll} className="text-sm font-bold text-tornoo-green">
            Voir tout
          </button>
        )}
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {shown.map((photo) => (
          <div
            key={photo.id}
            className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-surface-2"
          >
            <ImageWithFallback
              src={photo.url}
              alt={photo.alt ?? ""}
              width={80}
              height={80}
              className="w-full h-full object-cover"
              fallback={<div className="w-full h-full bg-line" />}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
