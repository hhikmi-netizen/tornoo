"use client";

import { QRCodeDisplayPage } from "@/components/tornoo/qr/QRCodeDisplayPage";

export default function ProQRCodeRoute() {
  return (
    <QRCodeDisplayPage
      subtitle="Affichez ce code dans votre établissement"
      instructionTitle="Imprimez ou affichez ce QR code"
      instructionBody="Vos clients le scannent pour rejoindre votre file sans se déplacer."
    />
  );
}
