import { PositionRing } from "./PositionRing";
import { WaitSummaryCard } from "./WaitSummaryCard";
import { ProximityAlertCard } from "./ProximityAlertCard";
import type { MyTurnTicket } from "@/types/myTurn";

interface Props {
  ticket: MyTurnTicket;
}

export function MyTurnMainCard({ ticket }: Props) {
  return (
    <div className="bg-white rounded-[28px] shadow-md shadow-[#009B5A]/10 border border-[#EAF8F0] p-6">
      <PositionRing position={ticket.position} />
      <WaitSummaryCard
        estimatedWaitMinutes={ticket.estimatedWaitMinutes}
        clientsBefore={ticket.clientsBefore}
      />
      <ProximityAlertCard />
    </div>
  );
}
