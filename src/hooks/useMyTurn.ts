"use client";

import { useState, useCallback } from "react";
import type { MyTurnTicket } from "@/types/myTurn";
import { mockMyTurnTicket } from "@/data/mockMyTurn";

interface UseMyTurnResult {
  ticket: MyTurnTicket | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
  leaveQueue: () => Promise<void>;
  callEstablishment: () => void;
}

export function useMyTurn(_ticketId?: string): UseMyTurnResult {
  const [ticket] = useState<MyTurnTicket>(mockMyTurnTicket);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  const refresh = useCallback(() => {
    // future: refetch from backend
  }, []);

  const leaveQueue = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 600));
    // future: call API to cancel ticket
  }, []);

  const callEstablishment = useCallback(() => {
    if (ticket?.establishmentPhone) {
      window.location.href = `tel:${ticket.establishmentPhone}`;
    }
  }, [ticket]);

  return { ticket, isLoading, error, refresh, leaveQueue, callEstablishment };
}
