"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { QRCodeDisplayPage } from "@/components/tornoo/qr/QRCodeDisplayPage";

function ScanResultContent() {
  const searchParams = useSearchParams();
  const ticketId = searchParams.get("ticket") ?? undefined;
  return <QRCodeDisplayPage establishmentId={ticketId} />;
}

export default function ScanResultRoute() {
  return (
    <Suspense>
      <ScanResultContent />
    </Suspense>
  );
}
