import { BookmarkSimple } from "@phosphor-icons/react";

interface Props {
  title?: string;
  body?: string;
}

export function QRInstructionCard({
  title = "Gardez cette page ouverte",
  body = "Le code est valable jusqu'à votre passage.",
}: Props) {
  return (
    <div className="flex items-start gap-3 bg-[#F8FAFC] rounded-2xl px-4 py-3.5 border border-gray-100">
      <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
        <BookmarkSimple weight="duotone" size={16} className="text-[#667085]" />
      </div>
      <div>
        <p className="text-sm font-bold text-[#071A2A]">{title}</p>
        <p className="text-xs text-[#667085] mt-0.5 leading-snug">{body}</p>
      </div>
    </div>
  );
}
