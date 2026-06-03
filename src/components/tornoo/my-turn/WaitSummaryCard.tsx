import { Clock, UsersFour } from "@phosphor-icons/react";

interface Props {
  estimatedWaitMinutes: number;
  clientsBefore: number;
}

export function WaitSummaryCard({ estimatedWaitMinutes, clientsBefore }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 mt-5">
      <div className="bg-[#EAF8F0] rounded-2xl px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0">
          <Clock weight="duotone" size={18} className="text-[#009B5A]" />
        </div>
        <div>
          <p className="text-xs text-[#667085] font-medium leading-tight">Temps d&apos;attente estimé</p>
          <p className="text-lg font-black text-[#009B5A] leading-tight">{estimatedWaitMinutes} min</p>
        </div>
      </div>

      <div className="bg-[#EAF8F0] rounded-2xl px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0">
          <UsersFour weight="duotone" size={18} className="text-[#009B5A]" />
        </div>
        <div>
          <p className="text-xs text-[#667085] font-medium leading-tight">Clients devant vous</p>
          <p className="text-lg font-black text-[#009B5A] leading-tight">{clientsBefore}</p>
        </div>
      </div>
    </div>
  );
}
