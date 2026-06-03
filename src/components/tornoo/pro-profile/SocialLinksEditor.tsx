"use client";

import { useState } from "react";
import { Plus, X } from "@phosphor-icons/react";
import { SocialIcon } from "./SocialIcon";
import type { SocialLink } from "@/types/professional";

type Platform = SocialLink["platform"];

const PLATFORMS: { value: Platform; label: string }[] = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "tiktok", label: "TikTok" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "website", label: "Site web" },
];

interface SocialLinksEditorProps {
  value: SocialLink[];
  onChange: (v: SocialLink[]) => void;
}

export function SocialLinksEditor({ value, onChange }: SocialLinksEditorProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [pickedPlatform, setPickedPlatform] = useState<Platform>("instagram");
  const [linkValue, setLinkValue] = useState("");

  const remove = (id: string) => {
    onChange(value.filter((l) => l.id !== id));
  };

  const add = () => {
    const trimmed = linkValue.trim();
    if (!trimmed) return;
    onChange([...value, { id: Math.random().toString(36).slice(2), platform: pickedPlatform, value: trimmed }]);
    setLinkValue("");
    setSheetOpen(false);
  };

  return (
    <>
      <div className="space-y-2">
        {value.map((link) => (
          <div
            key={link.id}
            className="flex items-center gap-3 bg-white rounded-[14px] border border-line px-4 h-14"
          >
            <SocialIcon platform={link.platform} />
            <span className="flex-1 text-sm font-semibold text-ink truncate">{link.value}</span>
            <button
              type="button"
              onClick={() => remove(link.id)}
              className="w-7 h-7 rounded-full bg-surface-2 flex items-center justify-center text-ink-3"
              aria-label="Retirer"
            >
              <X weight="bold" size={13} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="w-full flex items-center justify-center gap-2 h-11 rounded-[14px] border-2 border-dashed border-line text-sm font-bold text-ink-3 active:scale-[0.98] transition-transform"
        >
          <Plus weight="bold" size={16} />
          Ajouter un réseau social
        </button>
      </div>

      {sheetOpen && (
        <>
          <div
            className="fixed inset-0 z-[70] bg-black/50"
            onClick={() => setSheetOpen(false)}
          />
          <div className="fixed inset-x-0 bottom-0 z-[70] bg-white rounded-t-[28px] max-h-[85vh] overflow-y-auto">
            <div className="px-4 pt-5 pb-6">
              <div className="w-10 h-1 rounded-full bg-line mx-auto mb-5" />
              <h3 className="text-base font-black text-ink mb-4">Ajouter un réseau social</h3>

              <div className="mb-4">
                <label className="text-xs font-bold text-ink-3 uppercase tracking-wide mb-2 block">
                  Plateforme
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setPickedPlatform(p.value)}
                      className={`flex flex-col items-center gap-1.5 py-3 rounded-[14px] border transition-colors ${
                        pickedPlatform === p.value
                          ? "border-tornoo-green bg-tornoo-green/5"
                          : "border-line bg-white"
                      }`}
                    >
                      <SocialIcon platform={p.value} />
                      <span className="text-xs font-semibold text-ink">{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <label className="text-xs font-bold text-ink-3 uppercase tracking-wide mb-2 block">
                  {pickedPlatform === "whatsapp" ? "Numéro" : pickedPlatform === "website" ? "URL" : "Identifiant"}
                </label>
                <input
                  type="text"
                  value={linkValue}
                  onChange={(e) => setLinkValue(e.target.value)}
                  placeholder={
                    pickedPlatform === "whatsapp"
                      ? "+212 6 00 00 00 00"
                      : pickedPlatform === "website"
                      ? "https://example.com"
                      : "@username"
                  }
                  className="w-full h-[54px] rounded-[14px] bg-surface-2 border border-line px-4 text-sm font-medium text-ink placeholder:text-ink-4 focus:outline-none focus:border-tornoo-green"
                />
              </div>

              <button
                type="button"
                onClick={add}
                className="w-full h-14 rounded-[14px] bg-tornoo-green text-white font-extrabold text-sm"
              >
                Ajouter
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
