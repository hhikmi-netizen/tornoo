export type QueueStatus = "active" | "paused" | "closed";

export type ClientStatus = "waiting" | "called" | "in_service" | "completed" | "cancelled" | "no_show";

export interface QueueClient {
  id: string;
  position: number;
  name: string;
  phone: string;
  serviceName: string;
  status: ClientStatus;
  joinedAt: string;
  calledAt?: string;
  startedAt?: string;
  completedAt?: string;
  estimatedWaitMinutes: number;
}

export interface ProQueue {
  id: string;
  name: string;
  establishmentName: string;
  status: QueueStatus;
  averageWaitMinutes: number;
  waitingCount: number;
  currentClient?: QueueClient;
  clients: QueueClient[];
}

export interface QueueDailyStats {
  servedClients: number;
  cancelledClients: number;
  averageWaitMinutes: number;
  maxWaitMinutes: number;
}

export interface QueueHistoryEvent {
  id: string;
  clientName: string;
  action: "added" | "called" | "started" | "completed" | "cancelled" | "paused" | "resumed";
  time: string;
}
