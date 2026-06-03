"use client";

import { useRouter } from "next/navigation";
import { CaretLeft, CaretRight, ChatCircle, Envelope, Phone, FileText, Question } from "@phosphor-icons/react";
import { useToast } from "@/components/ui/Toast";

const FAQ = [
  {
    q: "Comment rejoindre une file d'attente ?",
    a: "Trouvez l'établissement sur la carte ou dans la recherche, puis appuyez sur « Prendre mon tour ».",
  },
  {
    q: "Puis-je annuler mon ticket ?",
    a: "Oui, depuis la page « Mon tour », appuyez sur « Quitter la file » à tout moment.",
  },
  {
    q: "Comment recevoir des alertes ?",
    a: "Activez les notifications dans Paramètres, puis choisissez l'intervalle d'alerte sur votre ticket.",
  },
  {
    q: "L'application fonctionne-t-elle hors ligne ?",
    a: "Votre ticket reste visible hors ligne, mais les mises à jour en temps réel nécessitent une connexion.",
  },
  {
    q: "Comment scanner un QR code d'établissement ?",
    a: "Appuyez sur l'icône centrale (scan) dans la barre de navigation, puis cadrez le QR code affiché à l'entrée.",
  },
];

const CONTACT = [
  { icon: ChatCircle, label: "Chat en direct", sub: "Réponse en moins de 5 min", color: "#07984a", action: "chat" },
  { icon: Envelope,   label: "E-mail support", sub: "support@tornoo.ma",         color: "#5b6472", action: "email" },
  { icon: Phone,      label: "Téléphone",       sub: "+212 522-000-000",          color: "#ff9300", action: "phone" },
];

export default function HelpPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleContact = (action: string) => {
    if (action === "chat") {
      toast("Chat en cours de démarrage…", "info");
      setTimeout(() => toast("Un agent va vous rejoindre dans quelques instants", "success"), 1800);
    } else if (action === "email") {
      window.open("mailto:support@tornoo.ma?subject=Aide Tornoo", "_blank");
    } else if (action === "phone") {
      window.open("tel:+212522000000", "_self");
    }
  };

  return (
    <div className="bg-surface-2 min-h-svh">
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm px-4 pt-safe-top pb-3 border-b border-line flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center"
          aria-label="Retour"
        >
          <CaretLeft weight="bold" size={20} />
        </button>
        <h1 className="text-xl font-black text-ink">Aide & Support</h1>
      </div>

      <div className="px-4 pt-4 pb-8 max-w-lg mx-auto space-y-5">
        {/* Hero */}
        <div className="bg-tornoo-green rounded-[22px] p-6 text-white text-center">
          <Question weight="fill" size={36} className="mx-auto mb-3 opacity-90" />
          <h2 className="text-xl font-black">Comment pouvons-nous vous aider ?</h2>
          <p className="text-sm text-white/75 mt-1">Trouvez des réponses ou contactez notre équipe</p>
        </div>

        {/* FAQ */}
        <section>
          <div className="flex items-center gap-2 px-1 mb-3">
            <FileText weight="duotone" size={15} className="text-ink-3" />
            <h2 className="text-sm font-black text-ink-2 uppercase tracking-wide">Questions fréquentes</h2>
          </div>
          <div className="bg-white rounded-[22px] border border-line shadow-1 overflow-hidden">
            {FAQ.map((item, i) => (
              <details
                key={i}
                className={`group ${i < FAQ.length - 1 ? "border-b border-line" : ""}`}
              >
                <summary className="flex items-center justify-between px-4 py-4 cursor-pointer list-none">
                  <span className="font-bold text-sm text-ink pr-4">{item.q}</span>
                  <CaretRight weight="bold" size={16} className="text-ink-3 shrink-0 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="px-4 pb-4 text-sm text-ink-3 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section>
          <div className="flex items-center gap-2 px-1 mb-3">
            <ChatCircle weight="duotone" size={15} className="text-ink-3" />
            <h2 className="text-sm font-black text-ink-2 uppercase tracking-wide">Nous contacter</h2>
          </div>
          <div className="space-y-2">
            {CONTACT.map(({ icon: Icon, label, sub, color, action }) => (
              <button
                key={label}
                onClick={() => handleContact(action)}
                className="w-full flex items-center gap-3 bg-white rounded-[18px] border border-line shadow-1 px-4 py-3.5 text-left active:scale-[0.98] transition-transform"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}18` }}>
                  <Icon size={18} weight="duotone" style={{ color }} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm text-ink">{label}</p>
                  <p className="text-xs text-ink-3">{sub}</p>
                </div>
                <CaretRight weight="bold" size={15} className="text-ink-4" />
              </button>
            ))}
          </div>
        </section>

        <p className="text-center text-xs text-ink-4 pb-2">Tornoo v1.0.0 · Casablanca, Maroc</p>
      </div>
    </div>
  );
}
