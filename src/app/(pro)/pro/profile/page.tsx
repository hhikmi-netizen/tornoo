"use client";

import { useRouter } from "next/navigation";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { CaretLeft, QrCode, Users, Plus, ChartBar, MapPin, Phone, Envelope, Globe, Star } from "@phosphor-icons/react";
import { MOCK_ESTABLISHMENTS } from "@/lib/mock-data";

export default function ProProfilePage() {
  const router = useRouter();
  const e = MOCK_ESTABLISHMENTS[0];

  const QUICK_ACTIONS = [
    { icon: QrCode, label: "Scanner" },
    { icon: Users, label: "File" },
    { icon: Plus, label: "Ajouter" },
    { icon: ChartBar, label: "Stats" },
  ];

  const INFO = [
    { label: "Catégorie", value: e.category },
    { label: "Adresse", value: `${e.address}, ${e.city}` },
    { label: "Téléphone", value: e.phone ?? "" },
    { label: "Email", value: e.email ?? "" },
    { label: "Site web", value: e.website ?? "" },
  ];

  return (
    <div className="bg-surface-2 min-h-svh">
      {/* Hero */}
      <div className="relative h-72">
        <ImageWithFallback
          src={e.imageUrl}
          alt={e.name}
          fill
          className="object-cover"
          fallback={
            <div className="absolute inset-0 flex items-center justify-center bg-[#062e24]">
              <span className="text-[140px] font-black leading-none text-white/10">{e.name.charAt(0)}</span>
            </div>
          }
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center"
          aria-label="Retour"
          style={{ top: "max(16px, env(safe-area-inset-top))" }}
        >
          <CaretLeft weight="bold" size={20} className="text-white" />
        </button>

        <div className="absolute bottom-5 left-5 right-5">
          <ImageWithFallback
              src={e.imageUrl}
              alt=""
              width={96}
              height={96}
              className="w-24 h-24 rounded-3xl border-4 border-white object-cover"
              fallback={
                <div className="w-24 h-24 rounded-3xl border-4 border-white flex items-center justify-center bg-[#062e24]">
                  <span className="text-3xl font-black text-white/50">{e.name.charAt(0)}</span>
                </div>
              }
            />
          <h1 className="text-3xl font-black text-white mt-2 leading-tight">{e.name}</h1>
          <p className="text-white/80 text-sm">{e.category} · {e.city}</p>
          <p className="text-white/70 text-sm mt-0.5 flex items-center gap-1.5"><Star size={13} weight="fill" className="text-[#F7C400]" />{e.rating} ({e.reviewCount} avis) · Ouvert {e.openHours}</p>
        </div>
      </div>

      <div className="px-4 pb-8 max-w-lg mx-auto space-y-4">
        {/* Stats strip */}
        <div className="grid grid-cols-3 text-center rounded-[22px] bg-tornoo-green p-5 text-white -mt-2 relative z-10">
          {[["27", "Clients servis"], ["12", "En attente"], ["18 min", "Moy. attente"]].map(([v, l]) => (
            <div key={l}>
              <p className="text-2xl font-black">{v}</p>
              <p className="text-xs text-white/70 mt-0.5">{l}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-4 gap-3">
          {QUICK_ACTIONS.map(({ icon: Icon, label }) => (
            <div key={label} className="bg-white rounded-[18px] p-3 text-center border border-line shadow-1">
              <Icon size={20} weight="duotone" className="mx-auto text-tornoo-green" />
              <p className="text-xs font-bold text-ink-2 mt-2">{label}</p>
            </div>
          ))}
        </div>

        {/* Info */}
        <div>
          <h2 className="text-xl font-black text-ink mb-3">Informations</h2>
          <div className="bg-white rounded-[22px] border border-line shadow-1 overflow-hidden">
            {INFO.filter((i) => i.value).map((item, idx) => (
              <div key={item.label} className={`px-4 py-3.5 ${idx < INFO.filter(i => i.value).length - 1 ? "border-b border-line" : ""}`}>
                <p className="text-xs font-bold text-ink-3 uppercase tracking-wide">{item.label}</p>
                <p className="text-sm font-medium text-ink mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Gallery */}
        <div>
          <h2 className="text-xl font-black text-ink mb-3">Galerie</h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-none">
            {[1, 2, 3].map((i) => (
              <ImageWithFallback
                key={i}
                src={e.imageUrl}
                alt=""
                width={112}
                height={96}
                className="w-28 h-24 rounded-[18px] object-cover shrink-0 border border-line"
                fallback={
                  <div className="w-28 h-24 rounded-[18px] shrink-0 border border-line flex items-center justify-center bg-surface-2">
                    <span className="text-2xl font-black text-ink-3">{e.name.charAt(0)}</span>
                  </div>
                }
              />
            ))}
            <div className="w-24 h-24 rounded-[18px] border-2 border-dashed border-line flex items-center justify-center shrink-0">
              <Plus weight="bold" size={20} className="text-ink-3" />
            </div>
          </div>
        </div>

        {/* Services */}
        <div>
          <h2 className="text-xl font-black text-ink mb-3">Services</h2>
          <div className="bg-white rounded-[22px] border border-line shadow-1 overflow-hidden">
            {e.services.map((s, idx) => (
              <div key={s.id} className={`px-4 py-3.5 flex items-center justify-between ${idx < e.services.length - 1 ? "border-b border-line" : ""}`}>
                <span className="font-bold text-ink">{s.name}</span>
                <div className="flex gap-4 text-sm text-ink-3">
                  <span>{s.durationMinutes} min</span>
                  {s.price && <span className="font-bold text-ink">{s.price} {s.currency}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
