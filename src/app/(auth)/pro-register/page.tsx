"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { TornooLogo } from "@/components/tornoo/TornooLogo";

const benefits = [
  { title: "Finis les appels et les messages", sub: "Vos clients rejoignent la file depuis leur téléphone." },
  { title: "Moins d'attente, plus de satisfaction", sub: "Réduisez les frustrations et fidélisez votre clientèle." },
  { title: "Plus de temps pour l'essentiel", sub: "Gérez votre file en quelques touches." },
];

function TicketIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a3 3 0 0 0 0 6v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a3 3 0 0 0 0-6z"/>
    </svg>
  );
}

export default function ProRegisterPage() {
  const router = useRouter();

  return (
    <div className="min-h-svh bg-white flex flex-col">
      <div className="px-6 pt-safe-top pb-10 flex-1 overflow-y-auto">
        {/* Logo */}
        <div className="pt-8">
          <TornooLogo compact href="/" />
        </div>

        {/* Hero */}
        <h1 className="text-[34px] font-black mt-10 tracking-[-0.03em] text-[#0b1220] leading-tight">
          Gérez vos files en toute simplicité
        </h1>
        <p className="text-[#667085] mt-3 font-medium text-[15px] leading-relaxed">
          Rejoignez les professionnels qui font confiance à Tornoo.
        </p>

        {/* Benefits */}
        <div className="mt-8 space-y-5">
          {benefits.map(({ title, sub }) => (
            <div key={title} className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-[#f0faf4] text-[#07984a] flex items-center justify-center shrink-0">
                <TicketIcon />
              </div>
              <div>
                <p className="font-black text-[#0b1220] text-[15px]">{title}</p>
                <p className="text-sm text-[#667085] mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats card */}
        <div className="mt-10 p-6 rounded-[28px] bg-gradient-to-br from-[#062E24] to-[#041313] text-white">
          <h2 className="text-[22px] font-black text-center leading-tight">
            Développez votre activité avec Tornoo
          </h2>

          <div className="grid grid-cols-3 gap-3 mt-8 text-center">
            {[
              { value: "+5 000", label: "professionnels" },
              { value: "+500k", label: "clients satisfaits" },
              { value: "4.8/5", label: "note moyenne" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-2xl font-black">{value}</p>
                <p className="text-[11px] text-white/70 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => router.push("/pro-register/form")}
            className="w-full mt-8 h-14 rounded-[16px] font-extrabold text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            style={{ background: "linear-gradient(135deg,#07984a,#13b45b)", boxShadow: "0 4px 16px rgba(7,152,74,0.3)" }}
          >
            Créer mon compte professionnel
          </button>

          <p className="text-center mt-4 text-sm text-white/70">
            Déjà un compte ?{" "}
            <Link href="/login" className="text-[#34d399] font-bold">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
