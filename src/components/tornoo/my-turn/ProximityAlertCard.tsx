import { SpeakerHigh, CaretRight } from "@phosphor-icons/react";

export function ProximityAlertCard() {
  return (
    <div className="mt-3 flex items-center gap-3 bg-[#EAF8F0] rounded-2xl px-4 py-3.5">
      <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0">
        <SpeakerHigh weight="duotone" size={18} className="text-[#009B5A]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[#071A2A]">Restez à proximité</p>
        <p className="text-xs text-[#667085] mt-0.5 leading-snug">
          Nous vous préviendrons quand ce sera bientôt votre tour.
        </p>
      </div>
      <CaretRight weight="bold" size={16} className="text-[#009B5A] shrink-0" />
    </div>
  );
}
