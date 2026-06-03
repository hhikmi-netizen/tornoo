export interface MyTurnTicket {
  id: string;
  establishmentName: string;
  serviceName: string;
  position: number;
  clientsBefore: number;
  estimatedWaitMinutes: number;
  status: "waiting" | "called" | "in_service" | "completed" | "cancelled";
  updatedAt: string;
  establishmentPhone?: string;
}
