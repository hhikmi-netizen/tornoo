"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CaretLeft, User, Envelope, Lock, Phone, Eye, EyeSlash, Buildings, MapPin, Globe, CheckCircle } from "@phosphor-icons/react";
import { TornooMark } from "@/components/tornoo/TornooLogo";
import { useToast } from "@/components/ui/Toast";

const STEPS = ["Informations", "Établissement", "Vérification", "Finalisation"] as const;

function GoogleG() {
  return (
    <svg width={20} height={20} viewBox="0 0 48 48" style={{ display: "block" }}>
      <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.8c-.5 2.7-2 5-4.4 6.6v5.5h7.1c4.1-3.8 6.6-9.4 6.6-16.1z"/>
      <path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.3l-7.1-5.5c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.5-3.8-12.2-9H4.5v5.7C8.1 41.1 15.4 46 24 46z"/>
      <path fill="#FBBC05" d="M11.8 28.3c-.4-1.3-.7-2.7-.7-4.3s.3-3 .7-4.3v-5.7H4.5C3 17.1 2.1 20.4 2.1 24s.9 6.9 2.4 10l7.3-5.7z"/>
      <path fill="#EA4335" d="M24 10.8c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.9 4.1 29.9 2 24 2 15.4 2 8.1 6.9 4.5 14l7.3 5.7c1.7-5.2 6.5-9 12.2-9z"/>
    </svg>
  );
}

function Field({
  icon: Icon, type = "text", value, onChange, placeholder, label, right,
}: {
  icon: React.ElementType; type?: string; value: string;
  onChange: (v: string) => void; placeholder: string; label: string;
  right?: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[11px] font-bold text-[#667085] mb-1.5 uppercase tracking-wide">{label}</p>
      <div className="flex items-center gap-3 bg-[#f7f9fc] rounded-[14px] px-4 h-[54px] border border-[#e0e5ed] focus-within:border-[#07984a] focus-within:bg-white transition-all">
        <Icon size={17} weight="duotone" className="text-[#9aa8bd] shrink-0" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm font-medium text-[#0b1220] outline-none placeholder:text-[#b0bac9]"
        />
        {right}
      </div>
    </div>
  );
}

function Select({
  icon: Icon, value, onChange, label, options,
}: {
  icon: React.ElementType; value: string; onChange: (v: string) => void;
  label: string; options: string[];
}) {
  return (
    <div>
      <p className="text-[11px] font-bold text-[#667085] mb-1.5 uppercase tracking-wide">{label}</p>
      <div className="flex items-center gap-3 bg-[#f7f9fc] rounded-[14px] px-4 h-[54px] border border-[#e0e5ed] focus-within:border-[#07984a] transition-all">
        <Icon size={17} weight="duotone" className="text-[#9aa8bd] shrink-0" />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent text-sm font-medium text-[#0b1220] outline-none appearance-none"
        >
          <option value="">Sélectionner...</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    </div>
  );
}

function StepDots({ current }: { current: number }) {
  return (
    <div className="flex justify-between items-start mt-8">
      {STEPS.map((label, i) => (
        <div key={label} className="flex-1 flex flex-col items-center relative">
          {i < STEPS.length - 1 && (
            <div className={`absolute top-4 left-1/2 w-full h-0.5 ${i < current ? "bg-[#07984a]" : "bg-[#e0e5ed]"}`} />
          )}
          <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${
            i < current ? "bg-[#07984a] text-white" :
            i === current ? "bg-[#07984a] text-white" :
            "bg-[#f0f2f5] text-[#9aa8bd]"
          }`}>
            {i < current ? "✓" : i + 1}
          </div>
          <p className={`text-[10px] mt-2 font-bold text-center ${i <= current ? "text-[#07984a]" : "text-[#9aa8bd]"}`}>
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}

// Step 1 — Personal info
function StepInfo({ data, setData }: { data: Record<string, string>; setData: (d: Record<string, string>) => void }) {
  const [show, setShow] = useState(false);
  const set = (k: string) => (v: string) => setData({ ...data, [k]: v });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field icon={User} value={data.firstName ?? ""} onChange={set("firstName")} placeholder="Ahmed" label="Prénom" />
        <Field icon={User} value={data.lastName ?? ""} onChange={set("lastName")} placeholder="Benali" label="Nom" />
      </div>
      <Field icon={Envelope} type="email" value={data.email ?? ""} onChange={set("email")} placeholder="ahmed@example.com" label="Email professionnel" />
      <Field icon={Phone} type="tel" value={data.phone ?? ""} onChange={set("phone")} placeholder="+212 6 12 34 56 78" label="Numéro de téléphone" />
      <Field
        icon={Lock} type={show ? "text" : "password"} value={data.password ?? ""} onChange={set("password")}
        placeholder="8 caractères minimum" label="Mot de passe"
        right={
          <button type="button" onClick={() => setShow((s) => !s)} className="p-1">
            {show
              ? <EyeSlash size={18} className="text-[#9aa8bd]" />
              : <Eye size={18} className="text-[#9aa8bd]" />}
          </button>
        }
      />
    </div>
  );
}

// Step 2 — Establishment info
function StepEtab({ data, setData }: { data: Record<string, string>; setData: (d: Record<string, string>) => void }) {
  const set = (k: string) => (v: string) => setData({ ...data, [k]: v });

  const categories = [
    "Coiffure & Barbier", "Bien-être & Spa", "Santé & Médecine", "Cliniques",
    "Dentistes", "Laboratoires", "Pharmacie", "Restauration",
    "Banque & Finances", "Administration", "Sport & Fitness",
    "Garages", "Lavage auto", "Autre",
  ];

  return (
    <div className="space-y-4">
      <Field icon={Buildings} value={data.estabName ?? ""} onChange={set("estabName")} placeholder="Barber Club Mâarif" label="Nom de l'établissement" />
      <Select icon={Buildings} value={data.category ?? ""} onChange={set("category")} label="Catégorie" options={categories} />
      <Field icon={MapPin} value={data.address ?? ""} onChange={set("address")} placeholder="45 Bd Zerktouni" label="Adresse" />
      <Field icon={MapPin} value={data.city ?? ""} onChange={set("city")} placeholder="Casablanca" label="Ville" />
      <Field icon={Phone} type="tel" value={data.estabPhone ?? ""} onChange={set("estabPhone")} placeholder="+212 5 22 12 34 56" label="Téléphone établissement" />
      <Field icon={Globe} value={data.website ?? ""} onChange={set("website")} placeholder="barberclub.ma" label="Site web (optionnel)" />
    </div>
  );
}

// Step 3 — Verification
function StepVerif({ data, setData }: { data: Record<string, string>; setData: (d: Record<string, string>) => void }) {
  const set = (k: string) => (v: string) => setData({ ...data, [k]: v });
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <div className="bg-[#f0faf4] rounded-[18px] p-4 border border-[#b8e8cc]">
        <p className="text-sm font-bold text-[#07984a]">Code envoyé</p>
        <p className="text-xs text-[#667085] mt-0.5">
          Un code à 6 chiffres a été envoyé à {data.email || "votre email"}.
        </p>
      </div>
      <div>
        <p className="text-[11px] font-bold text-[#667085] mb-1.5 uppercase tracking-wide">Code de vérification</p>
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={data.code ?? ""}
          onChange={(e) => set("code")(e.target.value.replace(/\D/g, ""))}
          placeholder="• • • • • •"
          className="w-full h-[54px] text-center text-2xl font-black tracking-[0.5em] bg-[#f7f9fc] rounded-[14px] border border-[#e0e5ed] focus:border-[#07984a] focus:outline-none transition-all text-[#0b1220]"
        />
      </div>
      <button
        onClick={() => toast("Nouveau code envoyé", "success")}
        className="text-sm font-bold text-[#07984a] text-center w-full"
      >
        Renvoyer le code
      </button>
    </div>
  );
}

// Step 4 — Finalization
function StepFinal({ data }: { data: Record<string, string> }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col items-center py-4">
        <div className="w-16 h-16 rounded-full bg-[#f0faf4] flex items-center justify-center">
          <CheckCircle size={40} weight="fill" className="text-[#07984a]" />
        </div>
        <p className="mt-3 text-lg font-black text-[#0b1220]">Compte créé avec succès !</p>
        <p className="text-sm text-[#667085] text-center mt-1 max-w-[260px]">
          Bienvenue sur Tornoo Pro. Votre profil est en cours de vérification.
        </p>
      </div>

      <div className="bg-[#f7f9fc] rounded-[18px] divide-y divide-[#e0e5ed] border border-[#e0e5ed]">
        {[
          { label: "Nom", value: `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim() || "—" },
          { label: "Email", value: data.email || "—" },
          { label: "Établissement", value: data.estabName || "—" },
          { label: "Ville", value: data.city || "—" },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between px-4 py-3">
            <span className="text-xs text-[#667085] font-bold">{label}</span>
            <span className="text-xs font-black text-[#0b1220] max-w-[180px] text-right truncate">{value}</span>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-[#062E24] to-[#041313] text-white rounded-[18px] p-5">
        <p className="font-black text-[#34d399] text-sm">Prochaines étapes</p>
        <ul className="mt-3 space-y-2 text-sm text-white/80">
          <li className="flex gap-2 items-start"><span className="text-[#07984a] font-black mt-0.5">1.</span> Configurez votre première file d'attente</li>
          <li className="flex gap-2 items-start"><span className="text-[#07984a] font-black mt-0.5">2.</span> Partagez votre QR code avec vos clients</li>
          <li className="flex gap-2 items-start"><span className="text-[#07984a] font-black mt-0.5">3.</span> Gérez votre activité depuis le tableau de bord</li>
        </ul>
      </div>
    </div>
  );
}

export default function ProFormPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const isStepValid = () => {
    if (step === 0) return (data.firstName?.length ?? 0) > 0 && (data.email?.includes("@") ?? false) && (data.password?.length ?? 0) >= 8;
    if (step === 1) return (data.estabName?.length ?? 0) > 0 && (data.category?.length ?? 0) > 0 && (data.city?.length ?? 0) > 0;
    if (step === 2) return (data.code?.length ?? 0) === 6;
    return true;
  };

  const handleNext = async () => {
    if (step < 3) {
      setStep((s) => s + 1);
    } else {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 1000));
      localStorage.setItem("tornoo_auth", "1");
      localStorage.setItem("tornoo_role", "pro");
      localStorage.setItem("tornoo_user", JSON.stringify({
        name: `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim() || "Ahmed Benali Pro",
        email: data.email ?? "pro@tornoo.ma",
      }));
      router.replace("/pro");
    }
  };

  const slideVariants = {
    enter: { opacity: 0, x: 32 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -32 },
  };

  const ctaLabel = step === 0 ? "Continuer" : step === 1 ? "Continuer" : step === 2 ? "Vérifier" : "Accéder au tableau de bord";

  return (
    <div className="min-h-svh bg-white flex flex-col">
      <div className="px-6 pt-safe-top pb-10 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => step > 0 ? setStep((s) => s - 1) : router.back()}
            className="w-10 h-10 rounded-full bg-[#f0f2f5] flex items-center justify-center"
          >
            <CaretLeft weight="bold" size={18} className="text-[#0b1220]" />
          </button>
          <button
            onClick={() => window.open("mailto:support@tornoo.ma?subject=Aide inscription Tornoo Pro", "_blank")}
            className="text-sm font-bold text-[#07984a]"
          >
            Besoin d&apos;aide ?
          </button>
        </div>

        {/* Icon + Title */}
        <div className="flex flex-col items-center text-center mt-8">
          <div className="w-20 h-20 rounded-full bg-[#f0faf4] flex items-center justify-center">
            {step === 3
              ? <CheckCircle size={44} weight="fill" className="text-[#07984a]" />
              : <TornooMark size={52} />}
          </div>
          <h1 className="text-[26px] font-black mt-4 tracking-[-0.02em] text-[#0b1220]">
            {step === 3 ? "Félicitations !" : "Créer mon compte professionnel"}
          </h1>
          {step < 3 && (
            <p className="text-[#667085] text-sm mt-1.5 max-w-[280px] leading-relaxed">
              Rejoignez Tornoo et commencez à gérer vos files en quelques minutes.
            </p>
          )}
        </div>

        {/* Step dots */}
        <StepDots current={step} />

        {/* Step content */}
        <div className="mt-8 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {step === 0 && <StepInfo data={data} setData={setData} />}
              {step === 1 && <StepEtab data={data} setData={setData} />}
              {step === 2 && <StepVerif data={data} setData={setData} />}
              {step === 3 && <StepFinal data={data} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* CTA */}
        <div className="mt-6 space-y-3">
          <button
            onClick={handleNext}
            disabled={!isStepValid() || loading}
            className="w-full h-14 rounded-[16px] font-extrabold text-white flex items-center justify-center gap-2 disabled:opacity-40 active:scale-[0.98] transition-transform"
            style={{ background: "linear-gradient(135deg,#07984a,#13b45b)", boxShadow: "0 4px 16px rgba(7,152,74,0.28)" }}
          >
            {loading
              ? <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              : ctaLabel}
          </button>

          {step === 0 && (
            <>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-[#e0e5ed]" />
                <span className="text-[11px] font-extrabold text-[#9aa8bd] tracking-widest uppercase">ou</span>
                <div className="flex-1 h-px bg-[#e0e5ed]" />
              </div>

              <button
                onClick={() => {
                  localStorage.setItem("tornoo_auth", "1");
                  localStorage.setItem("tornoo_role", "pro");
                  localStorage.setItem("tornoo_user", JSON.stringify({ name: "Ahmed Benali Pro", email: "ahmed@barberclub.ma" }));
                  router.replace("/pro");
                }}
                className="w-full h-14 rounded-[16px] font-bold bg-white border border-[#e0e5ed] flex items-center justify-center gap-3 shadow-sm active:scale-[0.98] transition-transform"
              >
                <GoogleG />
                <span className="text-sm text-[#0b1220]">Continuer avec Google</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
