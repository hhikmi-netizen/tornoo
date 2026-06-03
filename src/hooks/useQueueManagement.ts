"use client";
import { useState, useCallback } from "react";
import type { ProQueue, QueueClient } from "@/types/queue";
import { MOCK_QUEUE } from "@/data/mockQueues";

export function useQueueManagement(initialQueue: ProQueue = MOCK_QUEUE) {
  const [queue, setQueue] = useState<ProQueue>(initialQueue);
  const [isLoading, setIsLoading] = useState(false);

  const simulate = async (fn: () => void) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    fn();
    setIsLoading(false);
  };

  const addClient = useCallback(async (client: Omit<QueueClient, "id" | "position" | "status" | "joinedAt" | "estimatedWaitMinutes">) => {
    await simulate(() => {
      setQueue((q) => {
        const now = new Date().toTimeString().slice(0, 5);
        const pos = (q.clients[q.clients.length - 1]?.position ?? q.currentClient?.position ?? 0) + 1;
        const newClient: QueueClient = {
          ...client, id: `c${Date.now()}`, position: pos, status: "waiting",
          joinedAt: now, estimatedWaitMinutes: pos * q.averageWaitMinutes,
        };
        return { ...q, clients: [...q.clients, newClient], waitingCount: q.waitingCount + 1 };
      });
    });
  }, []);

  const callNext = useCallback(async () => {
    await simulate(() => {
      setQueue((q) => {
        const next = q.clients.find((c) => c.status === "waiting");
        if (!next) return q;
        const updated = q.clients.map((c) => c.id === next.id ? { ...c, status: "in_service" as const, calledAt: new Date().toTimeString().slice(0, 5) } : c);
        return { ...q, currentClient: { ...next, status: "in_service" }, clients: updated.filter((c) => c.id !== next.id), waitingCount: Math.max(0, q.waitingCount - 1) };
      });
    });
  }, []);

  const finishCurrent = useCallback(async () => {
    await simulate(() => {
      setQueue((q) => ({ ...q, currentClient: undefined }));
    });
  }, []);

  const cancelClient = useCallback(async (clientId: string) => {
    await simulate(() => {
      setQueue((q) => {
        if (q.currentClient?.id === clientId) return { ...q, currentClient: undefined };
        return { ...q, clients: q.clients.filter((c) => c.id !== clientId), waitingCount: Math.max(0, q.waitingCount - 1) };
      });
    });
  }, []);

  const suspendQueue = useCallback(async () => {
    await simulate(() => setQueue((q) => ({ ...q, status: "paused" })));
  }, []);

  const resumeQueue = useCallback(async () => {
    await simulate(() => setQueue((q) => ({ ...q, status: "active" })));
  }, []);

  const closeQueue = useCallback(async () => {
    await simulate(() => setQueue((q) => ({ ...q, status: "closed" })));
  }, []);

  return { queue, isLoading, addClient, callNext, finishCurrent, cancelClient, suspendQueue, resumeQueue, closeQueue };
}
