import type { ProQueue, QueueDailyStats, QueueHistoryEvent } from "@/types/queue";

export const MOCK_QUEUE: ProQueue = {
  id: "q1",
  name: "File principale",
  establishmentName: "Barber Club",
  status: "active",
  averageWaitMinutes: 18,
  waitingCount: 7,
  currentClient: {
    id: "c1", position: 3, name: "Karim El Amrani", phone: "+212 6 12 34 56 78",
    serviceName: "Coupe homme", status: "in_service",
    joinedAt: "14:28", startedAt: "14:28", estimatedWaitMinutes: 0,
  },
  clients: [
    { id: "c2", position: 4, name: "Yassine Belkacem", phone: "+212 6 98 76 54 32", serviceName: "Coupe + barbe", status: "waiting", joinedAt: "14:27", estimatedWaitMinutes: 16 },
    { id: "c3", position: 5, name: "Imane Zahraoui", phone: "+212 7 11 22 33 44", serviceName: "Coupe femme", status: "waiting", joinedAt: "14:20", estimatedWaitMinutes: 24 },
    { id: "c4", position: 6, name: "Mehdi Benali", phone: "+212 6 67 89 01 23", serviceName: "Coupe homme", status: "waiting", joinedAt: "14:15", estimatedWaitMinutes: 32 },
    { id: "c5", position: 7, name: "Sara El Idrissi", phone: "+212 6 55 66 77 88", serviceName: "Coloration", status: "waiting", joinedAt: "14:10", estimatedWaitMinutes: 41 },
    { id: "c6", position: 8, name: "Omar Tahiri", phone: "+212 6 44 33 22 11", serviceName: "Coupe homme", status: "waiting", joinedAt: "14:05", estimatedWaitMinutes: 53 },
    { id: "c7", position: 9, name: "Hicham Ait Said", phone: "+212 6 77 88 99 00", serviceName: "Coupe + barbe", status: "waiting", joinedAt: "14:00", estimatedWaitMinutes: 62 },
    { id: "c8", position: 10, name: "Lina Benjelloun", phone: "+212 6 22 11 00 99", serviceName: "Soin capillaire", status: "waiting", joinedAt: "13:55", estimatedWaitMinutes: 71 },
  ],
};

export const MOCK_DAILY_STATS: QueueDailyStats = {
  servedClients: 23,
  cancelledClients: 2,
  averageWaitMinutes: 18,
  maxWaitMinutes: 65,
};

export const MOCK_HISTORY: QueueHistoryEvent[] = [
  { id: "h1", clientName: "Karim El Amrani", action: "started", time: "14:28" },
  { id: "h2", clientName: "Yassine Belkacem", action: "added", time: "14:27" },
  { id: "h3", clientName: "Imane Zahraoui", action: "added", time: "14:20" },
];
