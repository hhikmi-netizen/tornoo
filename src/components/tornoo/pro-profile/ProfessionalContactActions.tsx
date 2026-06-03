"use client";

import { PhoneCall, NavigationArrow, Heart, ShareNetwork } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/Toast";

interface ProfessionalContactActionsProps {
  phone?: string;
  address: string;
  city: string;
  isFav: boolean;
  onFavToggle: () => void;
}

export function ProfessionalContactActions({
  phone,
  address,
  city,
  isFav,
  onFavToggle,
}: ProfessionalContactActionsProps) {
  const { toast } = useToast();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Tornoo", url: window.location.href });
      } catch {}
    } else {
      await navigator.clipboard.writeText(window.location.href).catch(() => {});
      toast("Lien copié !", "success");
    }
  };

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${address}, ${city}`)}`;

  const actions = [
    {
      key: "call",
      icon: <PhoneCall weight="duotone" size={22} className="text-tornoo-green" />,
      label: "Appeler",
      href: phone ? `tel:${phone}` : undefined,
      onClick: undefined as (() => void) | undefined,
    },
    {
      key: "map",
      icon: <NavigationArrow weight="duotone" size={22} className="text-tornoo-green" />,
      label: "Itinéraire",
      href: mapsUrl,
      onClick: undefined as (() => void) | undefined,
    },
    {
      key: "fav",
      icon: (
        <Heart
          size={22}
          weight={isFav ? "fill" : "duotone"}
          className={isFav ? "text-[#EF2B24]" : "text-tornoo-green"}
        />
      ),
      label: "Favoris",
      href: undefined,
      onClick: onFavToggle,
    },
    {
      key: "share",
      icon: <ShareNetwork weight="duotone" size={22} className="text-tornoo-green" />,
      label: "Partager",
      href: undefined,
      onClick: handleShare,
    },
  ];

  return (
    <div className="flex gap-3">
      {actions.map((action) => {
        const inner = (
          <div className="flex flex-col items-center gap-1.5 py-3">
            {action.icon}
            <span className="text-[11px] font-bold text-ink-2">{action.label}</span>
          </div>
        );

        if (action.href) {
          return (
            <a
              key={action.key}
              href={action.href}
              target={action.key === "map" ? "_blank" : undefined}
              rel={action.key === "map" ? "noopener noreferrer" : undefined}
              className="flex-1 bg-white border border-line rounded-2xl flex items-center justify-center active:scale-95 transition-transform shadow-1"
            >
              {inner}
            </a>
          );
        }

        return (
          <motion.button
            key={action.key}
            whileTap={{ scale: 0.95 }}
            onClick={action.onClick}
            className="flex-1 bg-white border border-line rounded-2xl flex items-center justify-center shadow-1"
          >
            {inner}
          </motion.button>
        );
      })}
    </div>
  );
}
