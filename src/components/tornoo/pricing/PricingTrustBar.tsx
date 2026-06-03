import { ShieldCheck, Lock, ArrowsClockwise, Headset } from "@phosphor-icons/react";

const TRUST_ITEMS = [
  { icon: ShieldCheck, title: "Sans engagement", sub: "Résiliez à tout moment" },
  { icon: Lock, title: "Paiement sécurisé", sub: "100% sécurisé" },
  { icon: ArrowsClockwise, title: "Évolutif", sub: "Changez de plan à tout moment" },
  { icon: Headset, title: "Support réactif", sub: "Nous sommes là pour vous" },
];

export function PricingTrustBar() {
  return (
    <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
      {TRUST_ITEMS.map(({ icon: Icon, title, sub }) => (
        <div key={title} className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] flex items-center justify-center shrink-0">
            <Icon weight="duotone" size={20} className="text-[#009B5A]" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#071A2A]">{title}</p>
            <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
