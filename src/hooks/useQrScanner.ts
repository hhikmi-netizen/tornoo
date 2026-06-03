"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { QRScanResult, QRScanState } from "@/types/qr";
import { MOCK_QR_SCAN_RESULT } from "@/data/mockQr";

interface UseQrScannerResult {
  scanResult: QRScanResult | null;
  scanState: QRScanState;
  isScanning: boolean;
  isLoading: boolean;
  error: string | null;
  torchOn: boolean;
  toggleTorch: () => void;
  startScanning: () => void;
  stopScanning: () => void;
  simulateScan: () => void;
  joinQueue: () => void;
  reset: () => void;
}

export function useQrScanner(): UseQrScannerResult {
  const router = useRouter();
  const [scanResult, setScanResult] = useState<QRScanResult | null>(null);
  const [scanState, setScanState] = useState<QRScanState>("idle");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState(false);

  const startScanning = useCallback(() => {
    setScanState("scanning");
    setError(null);
  }, []);

  const stopScanning = useCallback(() => {
    setScanState("idle");
  }, []);

  const toggleTorch = useCallback(() => {
    setTorchOn((v) => !v);
  }, []);

  const simulateScan = useCallback(async () => {
    setScanState("scanning");
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setScanResult(MOCK_QR_SCAN_RESULT);
    setScanState("success");
    setIsLoading(false);
  }, []);

  const joinQueue = useCallback(() => {
    if (!scanResult) return;
    router.push(`/establishment/${scanResult.establishmentSlug}`);
  }, [scanResult, router]);

  const reset = useCallback(() => {
    setScanResult(null);
    setScanState("idle");
    setError(null);
  }, []);

  return {
    scanResult,
    scanState,
    isScanning: scanState === "scanning",
    isLoading,
    error,
    torchOn,
    toggleTorch,
    startScanning,
    stopScanning,
    simulateScan,
    joinQueue,
    reset,
  };
}
