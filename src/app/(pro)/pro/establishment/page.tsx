"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CaretLeft, MapPin, Phone, Envelope, Globe, Clock, Camera, Plus, FloppyDisk } from "@phosphor-icons/react";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { useToast } from "@/components/ui/Toast";
import { MOCK_ESTABLISHMENTS } from "@/lib/mock-data";

function Field({
  label, value, onChange, type = "text", placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs font-extrabold text-ink-3 uppercase tracking-wide block mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-12 rounded-[13px] border border-line bg-surface-2 px-4 text-sm font-medium text-ink outline-none focus:border-tornoo-green focus:ring-2 focus:ring-tornoo-green/15 transition-all"
      />
    </div>
  );
}

export default function EstablishmentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const e = MOCK_ESTABLISHMENTS[0];

  const [name, setName] = useState(e.name);
  const [category, setCategory] = useState(e.category);
  const [address, setAddress] = useState(e.address ?? "");
  const [city, setCity] = useState(e.city);
  const [phone, setPhone] = useState(e.phone ?? "");
  const [email, setEmail] = useState(e.email ?? "");
  const [website, setWebsite] = useState(e.website ?? "");
  const [hours, setHours] = useState(e.openHours ?? "9h–20h");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setSaving(false);
    toast("Établissement mis à jour", "success");
  };

  return (
    <div className="bg-surface-2 min-h-svh pb-28">

      {/* Header */}
      <div className="bg-white border-b border-line px-4 pt-safe-top pb-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-surface-2 border border-line flex items-center justify-center">
          <CaretLeft weight="bold" size={18} className="text-ink" />
        </button>
        <h1 className="font-black text-lg text-ink flex-1">Mon établissement</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 h-9 px-4 rounded-[12px] bg-tornoo-green text-white font-bold text-sm disabled:opacity-60"
        >
          {saving
            ? <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            : <FloppyDisk size={15} weight="bold" />
          }
          {saving ? "Sauvegarde…" : "Sauvegarder"}
        </button>
      </div>

      <div className="px-4 pt-4 space-y-4 max-w-lg mx-auto">
        {/* Cover photo */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="relative h-44 rounded-[22px] overflow-hidden border border-line">
          <ImageWithFallback
            src={e.imageUrl} alt={e.name} fill className="object-cover"
            fallback={<div className="w-full h-full bg-surface-2 flex items-center justify-center"><span className="text-4xl text-ink-3">🏢</span></div>}
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <button className="flex items-center gap-2 bg-white/90 text-ink font-bold text-sm rounded-full h-10 px-4">
              <Camera size={16} weight="bold" /> Changer la photo
            </button>
          </div>
        </motion.div>

        {/* Basic info */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="bg-white rounded-[22px] border border-line shadow-1 p-4 space-y-4">
          <h2 className="font-black text-ink text-base">Informations générales</h2>
          <Field label="Nom de l'établissement" value={name} onChange={setName} placeholder="Ex: Barber Club Maarif" />
          <Field label="Catégorie" value={category} onChange={setCategory} placeholder="Ex: Coiffure & Barbier" />
          <Field label="Ville" value={city} onChange={setCity} placeholder="Ex: Casablanca" />
          <Field label="Adresse" value={address} onChange={setAddress} placeholder="Ex: 12 Rue des Fleurs, Maarif" />
        </motion.div>

        {/* Contact */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          className="bg-white rounded-[22px] border border-line shadow-1 p-4 space-y-4">
          <h2 className="font-black text-ink text-base">Contact</h2>
          <Field label="Téléphone" value={phone} onChange={setPhone} type="tel" placeholder="+212 6XX XXX XXX" />
          <Field label="Email" value={email} onChange={setEmail} type="email" placeholder="contact@etablissement.ma" />
          <Field label="Site web" value={website} onChange={setWebsite} placeholder="https://monsite.ma" />
        </motion.div>

        {/* Hours */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-[22px] border border-line shadow-1 p-4 space-y-4">
          <h2 className="font-black text-ink text-base">Horaires d'ouverture</h2>
          {[
            "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche",
          ].map((day) => (
            <div key={day} className="flex items-center justify-between">
              <span className="text-sm font-bold text-ink w-24">{day}</span>
              <input
                type="text"
                defaultValue={day === "Dimanche" ? "Fermé" : hours}
                className="flex-1 h-10 rounded-[12px] border border-line bg-surface-2 px-3 text-sm font-medium text-ink outline-none focus:border-tornoo-green transition-all text-right"
              />
            </div>
          ))}
        </motion.div>

        {/* Gallery */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
          className="bg-white rounded-[22px] border border-line shadow-1 p-4">
          <h2 className="font-black text-ink text-base mb-3">Galerie photos</h2>
          <div className="flex gap-3 flex-wrap">
            {[1, 2, 3].map((i) => (
              <ImageWithFallback key={i} src={e.imageUrl} alt="" width={80} height={80}
                className="w-20 h-20 rounded-[14px] object-cover border border-line"
                fallback={<div className="w-20 h-20 rounded-[14px] bg-surface-2 border border-line" />}
              />
            ))}
            <button className="w-20 h-20 rounded-[14px] border-2 border-dashed border-line flex flex-col items-center justify-center gap-1 text-ink-3">
              <Plus size={18} weight="bold" />
              <span className="text-[10px] font-bold">Ajouter</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
