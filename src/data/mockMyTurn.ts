import type { MyTurnTicket } from "@/types/myTurn";

export const mockMyTurnTicket: MyTurnTicket = {
  id: "ticket_001",
  establishmentName: "Barber Club",
  serviceName: "Coupe homme",
  position: 3,
  clientsBefore: 2,
  estimatedWaitMinutes: 15,
  status: "waiting",
  updatedAt: new Date().toISOString(),
  establishmentPhone: "+212612345678",
};
