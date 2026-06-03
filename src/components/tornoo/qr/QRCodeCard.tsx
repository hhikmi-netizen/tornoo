import type { EstablishmentQRCode } from "@/types/qr";
import { QRCodePreview } from "./QRCodePreview";
import { QRInstructionCard } from "./QRInstructionCard";
import { QRCodeActions } from "./QRCodeActions";

interface Props {
  qrCode: EstablishmentQRCode;
  onShare: () => void;
  onPrint: () => void;
  instructionTitle?: string;
  instructionBody?: string;
}

export function QRCodeCard({ qrCode, onShare, onPrint, instructionTitle, instructionBody }: Props) {
  return (
    <div className="space-y-4">
      <QRCodePreview establishmentName={qrCode.establishmentName} />
      <QRInstructionCard title={instructionTitle} body={instructionBody} />
      <QRCodeActions onShare={onShare} onPrint={onPrint} />
    </div>
  );
}
