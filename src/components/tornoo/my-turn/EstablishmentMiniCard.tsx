import { Storefront, Phone } from "@phosphor-icons/react";

interface Props {
  name: string;
  serviceName: string;
  phone?: string;
  onCall: () => void;
}

export function EstablishmentMiniCard({ name, serviceName, phone, onCall }: Props) {
  return (
    <div className="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3 shadow-sm border border-[#E8ECF0]">
      <div className="w-11 h-11 rounded-xl bg-[#EAF8F0] flex items-center justify-center shrink-0">
        <Storefront weight="duotone" size={22} className="text-[#009B5A]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-[#071A2A] text-sm truncate">{name}</p>
        <p className="text-xs text-[#667085] truncate">{serviceName}</p>
      </div>
      {phone && (
        <button
          onClick={onCall}
          className="w-11 h-11 rounded-full border-2 border-[#009B5A] flex items-center justify-center shrink-0 active:scale-95 transition-transform"
          aria-label={`Appeler ${name}`}
        >
          <Phone weight="fill" size={18} className="text-[#009B5A]" />
        </button>
      )}
    </div>
  );
}
