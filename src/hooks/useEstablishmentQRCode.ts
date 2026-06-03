"use client";

import { useState, useCallback } from "react";
import type { EstablishmentQRCode } from "@/types/qr";
import { MOCK_ESTABLISHMENT_QR } from "@/data/mockQr";

interface UseEstablishmentQRCodeResult {
  qrCode: EstablishmentQRCode | null;
  isLoading: boolean;
  error: string | null;
  shareQrCode: () => Promise<void>;
  printQrCode: () => void;
  downloadQrCode: () => void;
}

export function useEstablishmentQRCode(_establishmentId?: string): UseEstablishmentQRCodeResult {
  const [qrCode] = useState<EstablishmentQRCode>(MOCK_ESTABLISHMENT_QR);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  const shareQrCode = useCallback(async () => {
    const url = qrCode?.qrUrl ?? "";
    if (navigator.share) {
      await navigator.share({ title: qrCode?.establishmentName, url }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(url).catch(() => {});
    }
  }, [qrCode]);

  const printQrCode = useCallback(() => {
    window.print();
  }, []);

  const downloadQrCode = useCallback(() => {
    // future: download QR code as PNG
  }, []);

  return { qrCode, isLoading, error, shareQrCode, printQrCode, downloadQrCode };
}
