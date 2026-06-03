export type QRWaitStatus = "low" | "medium" | "high" | "closed";

export interface QRScanResult {
  id: string;
  establishmentId: string;
  establishmentName: string;
  establishmentSlug: string;
  establishmentLogo?: string;
  area: string;
  city: string;
  status: QRWaitStatus;
  estimatedWaitMinutes: number;
  offer?: {
    title: string;
    description: string;
  };
}

export interface EstablishmentQRCode {
  id: string;
  establishmentId: string;
  establishmentName: string;
  establishmentSlug: string;
  qrUrl: string;
  qrImageUrl?: string;
  isActive: boolean;
}

export type QRScanState =
  | "idle"
  | "scanning"
  | "success"
  | "error"
  | "invalid"
  | "closed"
  | "full";
