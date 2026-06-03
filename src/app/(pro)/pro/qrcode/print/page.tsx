"use client";

import { QRCodePreview } from "@/components/tornoo/qr/QRCodePreview";
import { MOCK_ESTABLISHMENT_QR } from "@/data/mockQr";

export default function QRPrintPage() {
  return (
    <div className="min-h-svh bg-white flex flex-col items-center justify-center p-8 print:p-0">
      <style>{`@media print { body { margin: 0; } button { display: none; } }`}</style>

      <div className="w-full max-w-xs">
        <QRCodePreview establishmentName={MOCK_ESTABLISHMENT_QR.establishmentName} />

        <p className="text-center text-xs text-gray-400 mt-4 print:hidden">
          Utilisez Ctrl+P / Cmd+P pour imprimer
        </p>

        <button
          onClick={() => window.print()}
          className="mt-4 w-full h-12 rounded-2xl bg-[#071A2A] text-white font-bold text-sm print:hidden"
        >
          Imprimer
        </button>
      </div>
    </div>
  );
}
