import type { QRScanResult, EstablishmentQRCode } from "@/types/qr";

export const MOCK_QR_SCAN_RESULT: QRScanResult = {
  id: "qr_001",
  establishmentId: "est_001",
  establishmentName: "Barber Atlas",
  establishmentSlug: "barber-atlas",
  area: "Gauthier",
  city: "Casablanca",
  status: "high",
  estimatedWaitMinutes: 73,
  offer: {
    title: "Offre 1re visite",
    description: "-10% supplémentaires pour votre première visite",
  },
};

export const MOCK_ESTABLISHMENT_QR: EstablishmentQRCode = {
  id: "qrcode_001",
  establishmentId: "est_001",
  establishmentName: "Barber Atlas",
  establishmentSlug: "barber-atlas",
  qrUrl: "https://tornoo.app/barber-atlas",
  isActive: true,
};
