import { TornooMark } from "@/components/tornoo/TornooLogo";
import { QRCodeSVG } from "./QRCodeSVG";

interface Props {
  establishmentName: string;
}

export function QRCodePreview({ establishmentName }: Props) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100">
      {/* Gradient header band */}
      <div
        className="flex items-center gap-3 px-5 py-4"
        style={{ background: "linear-gradient(135deg, #009B5A 0%, #F5C400 55%, #FF8A00 100%)" }}
      >
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
          <TornooMark size={28} dark />
        </div>
        <div>
          <p className="text-white font-black text-base leading-tight">Tornoo</p>
          <p className="text-white/80 text-xs font-medium">L&apos;attente en temps réel</p>
        </div>
      </div>

      {/* QR body */}
      <div className="px-6 pt-5 pb-6 flex flex-col items-center">
        <p className="text-sm font-bold text-[#667085] mb-4">Scannez pour prendre votre tour</p>
        <QRCodeSVG size={220} logoSize={40} className="rounded-xl" />
        <p className="mt-4 font-black text-[#071A2A] text-lg">{establishmentName}</p>
        <div className="mt-2 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#009B5A]" />
          <span className="text-sm font-bold text-[#009B5A]">Sans faire la queue</span>
        </div>
      </div>
    </div>
  );
}
