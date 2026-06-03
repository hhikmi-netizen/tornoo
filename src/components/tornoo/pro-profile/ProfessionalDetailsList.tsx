"use client";

import { useState } from "react";
import { MapPin, Phone, Clock, Scissors, ShareNetwork, CaretRight, CaretDown } from "@phosphor-icons/react";
import { SocialIcon } from "./SocialIcon";
import type { OpeningHour, SocialLink } from "@/types/professional";

const DAY_LABELS: Record<string, string> = {
  Lun: "Lundi",
  Mar: "Mardi",
  Mer: "Mercredi",
  Jeu: "Jeudi",
  Ven: "Vendredi",
  Sam: "Samedi",
  Dim: "Dimanche",
};

function groupHours(hours: OpeningHour[]) {
  const enabled = hours.filter((h) => h.enabled);
  if (!enabled.length) return [];

  const groups: { days: string[]; open: string; close: string }[] = [];
  for (const h of enabled) {
    const last = groups[groups.length - 1];
    if (last && last.open === h.open && last.close === h.close) {
      last.days.push(h.day);
    } else {
      groups.push({ days: [h.day], open: h.open, close: h.close });
    }
  }
  return groups;
}

interface ProfessionalDetailsListProps {
  address: string;
  city: string;
  phone: string;
  openingHours: OpeningHour[];
  services: string[];
  socialLinks: SocialLink[];
}

export function ProfessionalDetailsList({
  address,
  city,
  phone,
  openingHours,
  services,
  socialLinks,
}: ProfessionalDetailsListProps) {
  const [hoursExpanded, setHoursExpanded] = useState(false);
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${address}, ${city}`)}`;
  const groups = groupHours(openingHours);
  const firstGroup = groups[0];
  const preview = firstGroup
    ? `${firstGroup.days[0]}${firstGroup.days.length > 1 ? ` - ${firstGroup.days[firstGroup.days.length - 1]}` : ""} ${firstGroup.open} - ${firstGroup.close}`
    : "";

  return (
    <div className="bg-white rounded-[20px] border border-line shadow-1 overflow-hidden">
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-start gap-3 px-4 py-4 border-b border-line active:bg-surface-2 transition-colors"
      >
        <MapPin weight="duotone" size={20} className="text-tornoo-green shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-ink">{address}</p>
          <p className="text-xs text-ink-3">{city}</p>
        </div>
        <CaretRight weight="bold" size={16} className="text-ink-4 shrink-0 mt-0.5" />
      </a>

      <div className="flex items-center gap-3 px-4 py-4 border-b border-line">
        <Phone weight="duotone" size={20} className="text-tornoo-green shrink-0" />
        <a href={`tel:${phone}`} className="flex-1 text-sm font-semibold text-ink">
          {phone}
        </a>
        <a
          href={`tel:${phone}`}
          className="shrink-0 h-8 px-3 rounded-full bg-tornoo-green text-white text-xs font-bold flex items-center"
        >
          Appeler
        </a>
      </div>

      <button
        onClick={() => setHoursExpanded((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-4 border-b border-line text-left"
      >
        <Clock weight="duotone" size={20} className="text-tornoo-green shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-ink">{preview}</p>
          <span className="inline-flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-tornoo-green" />
            <span className="text-xs font-bold text-tornoo-green">Ouvert</span>
          </span>
        </div>
        {hoursExpanded ? (
          <CaretDown weight="bold" size={16} className="text-ink-4 shrink-0" />
        ) : (
          <CaretRight weight="bold" size={16} className="text-ink-4 shrink-0" />
        )}
      </button>

      {hoursExpanded && (
        <div className="px-4 pb-3 border-b border-line space-y-1.5 pt-1">
          {openingHours.map((h) => (
            <div key={h.day} className="flex items-center justify-between text-sm">
              <span className="text-ink-2 font-medium w-24">{DAY_LABELS[h.day]}</span>
              {h.enabled ? (
                <span className="text-ink font-semibold">
                  {h.open} - {h.close}
                </span>
              ) : (
                <span className="text-ink-3">Fermé</span>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-start gap-3 px-4 py-4 border-b border-line">
        <Scissors weight="duotone" size={20} className="text-tornoo-green shrink-0 mt-0.5" />
        <p className="text-sm font-semibold text-ink flex-1">
          {services.slice(0, 3).join(", ")}
          {services.length > 3 ? "..." : ""}
        </p>
      </div>

      {socialLinks.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-4">
          <ShareNetwork weight="duotone" size={20} className="text-tornoo-green shrink-0" />
          <div className="flex items-center gap-2 flex-wrap">
            {socialLinks.map((link) => (
              <SocialIcon key={link.id} platform={link.platform} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
