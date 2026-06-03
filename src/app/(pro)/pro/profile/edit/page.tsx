"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { CaretLeft, Camera, MapPin, Phone } from "@phosphor-icons/react";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { useToast } from "@/components/ui/Toast";
import { useProfessionalProfile } from "@/hooks/useProfessionalProfile";
import { useUpdateProfessionalProfile } from "@/hooks/useUpdateProfessionalProfile";
import { OpeningHoursEditor } from "@/components/tornoo/pro-profile/OpeningHoursEditor";
import { ServiceTagsEditor } from "@/components/tornoo/pro-profile/ServiceTagsEditor";
import { SocialLinksEditor } from "@/components/tornoo/pro-profile/SocialLinksEditor";
import { PhotoUploader } from "@/components/tornoo/pro-profile/PhotoUploader";
import type { ProfessionalProfile, OpeningHour, SocialLink, ProfessionalPhoto } from "@/types/professional";

const MAX_DESC = 300;

export default function EditProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data, isLoading } = useProfessionalProfile();
  const { update, isLoading: isSaving } = useUpdateProfessionalProfile();
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [businessName, setBusinessName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [openingHours, setOpeningHours] = useState<OpeningHour[]>([]);
  const [services, setServices] = useState<string[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [photos, setPhotos] = useState<ProfessionalPhoto[]>([]);
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!data) return;
    setBusinessName(data.businessName);
    setDescription(data.description);
    setAddress(data.address);
    setPhone(data.phone);
    setOpeningHours(data.openingHours);
    setServices(data.services);
    setSocialLinks(data.socialLinks);
    setPhotos(data.photos);
    setLogoUrl(data.logoUrl);
  }, [data]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast("Image trop grande (max 5 Mo)", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setLogoUrl(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSave = async () => {
    if (!businessName.trim()) {
      toast("Le nom est requis", "error");
      return;
    }
    const payload: Partial<ProfessionalProfile> = {
      businessName: businessName.trim(),
      description,
      address,
      phone,
      openingHours,
      services,
      socialLinks,
      photos,
      logoUrl,
    };
    await update(payload);
    toast("Profil mis à jour avec succès", "success");
    router.back();
  };

  if (isLoading) {
    return (
      <div className="bg-surface-2 min-h-svh">
        <div className="h-14 bg-white border-b border-line animate-pulse" />
        <div className="p-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-line rounded-[20px] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-2 min-h-svh pb-10">
      <div className="sticky top-0 z-20 bg-white border-b border-line">
        <div className="flex items-center justify-between px-4 h-14 pt-safe-top">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full bg-surface-2 flex items-center justify-center"
            aria-label="Retour"
          >
            <CaretLeft weight="bold" size={18} className="text-ink" />
          </button>
          <h1 className="text-base font-extrabold text-ink">Modifier le profil</h1>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="text-sm font-extrabold text-tornoo-green disabled:opacity-50"
          >
            {isSaving ? "..." : "Enregistrer"}
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 space-y-5 pt-5">
        <div className="bg-white rounded-[20px] border border-line shadow-1 p-5 flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md bg-gradient-to-br from-emerald-700 to-emerald-500">
              {logoUrl ? (
                <ImageWithFallback
                  src={logoUrl}
                  alt="Logo"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  fallback={
                    <div className="w-full h-full bg-gradient-to-br from-emerald-700 to-emerald-500 flex items-center justify-center">
                      <span className="text-2xl font-black text-white">
                        {businessName.charAt(0)}
                      </span>
                    </div>
                  }
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-2xl font-black text-white">
                    {businessName.charAt(0) || "?"}
                  </span>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-tornoo-green flex items-center justify-center shadow border-2 border-white"
              aria-label="Changer le logo"
            >
              <Camera weight="fill" size={13} className="text-white" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => logoInputRef.current?.click()}
            className="text-sm font-bold text-tornoo-green"
          >
            Changer le logo
          </button>
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleLogoChange}
          />
        </div>

        <div className="bg-white rounded-[20px] border border-line shadow-1 p-5 space-y-4">
          <h2 className="text-sm font-extrabold text-ink">Informations générales</h2>
          <div>
            <label className="text-xs font-bold text-ink-3 uppercase tracking-wide mb-1.5 block">
              Nom de l&apos;établissement
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full h-[54px] rounded-[14px] bg-surface-2 border border-line px-4 text-sm font-semibold text-ink placeholder:text-ink-4 focus:outline-none focus:border-tornoo-green"
              placeholder="Nom de votre établissement"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-ink-3 uppercase tracking-wide mb-1.5 block">
              Description
              <span className="ml-1 text-ink-4 normal-case">
                ({description.length}/{MAX_DESC})
              </span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, MAX_DESC))}
              rows={4}
              className="w-full rounded-[14px] bg-surface-2 border border-line px-4 py-3 text-sm font-medium text-ink placeholder:text-ink-4 focus:outline-none focus:border-tornoo-green resize-none"
              placeholder="Décrivez votre établissement..."
            />
          </div>
        </div>

        <div className="bg-white rounded-[20px] border border-line shadow-1 p-5 space-y-4">
          <h2 className="text-sm font-extrabold text-ink">Adresse</h2>
          <div className="relative">
            <MapPin
              weight="duotone"
              size={18}
              className="text-tornoo-green absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full h-[54px] rounded-[14px] bg-surface-2 border border-line pl-10 pr-4 text-sm font-semibold text-ink placeholder:text-ink-4 focus:outline-none focus:border-tornoo-green"
              placeholder="Adresse complète"
            />
          </div>
        </div>

        <div className="bg-white rounded-[20px] border border-line shadow-1 p-5 space-y-4">
          <h2 className="text-sm font-extrabold text-ink">Téléphone</h2>
          <div className="relative">
            <Phone
              weight="duotone"
              size={18}
              className="text-tornoo-green absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-[54px] rounded-[14px] bg-surface-2 border border-line pl-10 pr-4 text-sm font-semibold text-ink placeholder:text-ink-4 focus:outline-none focus:border-tornoo-green"
              placeholder="+212 6 00 00 00 00"
            />
          </div>
        </div>

        <div className="bg-white rounded-[20px] border border-line shadow-1 p-5 space-y-4">
          <h2 className="text-sm font-extrabold text-ink">Photos</h2>
          <PhotoUploader value={photos} onChange={setPhotos} />
        </div>

        <div className="bg-white rounded-[20px] border border-line shadow-1 p-5 space-y-4">
          <h2 className="text-sm font-extrabold text-ink">Horaires d&apos;ouverture</h2>
          <OpeningHoursEditor value={openingHours} onChange={setOpeningHours} />
        </div>

        <div className="bg-white rounded-[20px] border border-line shadow-1 p-5 space-y-4">
          <h2 className="text-sm font-extrabold text-ink">Services proposés</h2>
          <ServiceTagsEditor value={services} onChange={setServices} />
        </div>

        <div className="bg-white rounded-[20px] border border-line shadow-1 p-5 space-y-4">
          <h2 className="text-sm font-extrabold text-ink">Réseaux sociaux</h2>
          <SocialLinksEditor value={socialLinks} onChange={setSocialLinks} />
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full h-14 rounded-[15px] bg-tornoo-green text-white font-extrabold text-sm disabled:opacity-50 active:scale-[0.98] transition-transform"
          style={{ boxShadow: "0 4px 20px rgba(7,152,74,.35)" }}
        >
          {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
        </button>
      </div>
    </div>
  );
}
