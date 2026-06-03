"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MyTurnPage } from "@/components/tornoo/my-turn/MyTurnPage";

function MyTurnContent() {
  const searchParams = useSearchParams();
  const ticketId = searchParams.get("ticket") ?? undefined;
  return <MyTurnPage ticketId={ticketId} />;
}

export default function MyTurnRoute() {
  return (
    <Suspense>
      <MyTurnContent />
    </Suspense>
  );
}
