import { BookmarkSimple } from "@phosphor-icons/react";

export function QRInstructionCard() {
  return (
    <div className="flex items-start gap-3 bg-[#F8FAFC] rounded-2xl px-4 py-3.5 border border-gray-100">
      <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
        <BookmarkSimple weight="duotone" size={16} className="text-[#667085]" />
      </div>
      <div>
        <p className="text-sm font-bold text-[#071A2A]">Gardez cette page ouverte</p>
        <p className="text-xs text-[#667085] mt-0.5 leading-snug">
          Le code est valable jusqu&apos;à votre passage.
        </p>
      </div>
    </div>
  );
}
