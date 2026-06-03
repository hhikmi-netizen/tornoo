"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { useQueueManagement } from "@/hooks/useQueueManagement";
import { MOCK_DAILY_STATS, MOCK_HISTORY } from "@/data/mockQueues";

import { QueueSidebar } from "@/components/tornoo/queue-management/QueueSidebar";
import { QueueHeader } from "@/components/tornoo/queue-management/QueueHeader";
import { QueueSummaryCard } from "@/components/tornoo/queue-management/QueueSummaryCard";
import { CurrentClientCard } from "@/components/tornoo/queue-management/CurrentClientCard";
import { WaitingClientList } from "@/components/tornoo/queue-management/WaitingClientList";
import { QuickActionsPanel } from "@/components/tornoo/queue-management/QuickActionsPanel";
import { QueueStatsPanel } from "@/components/tornoo/queue-management/QueueStatsPanel";
import { RecentQueueHistory } from "@/components/tornoo/queue-management/RecentQueueHistory";
import { QueueBottomActionBar } from "@/components/tornoo/queue-management/QueueBottomActionBar";
import { AddClientModal } from "@/components/tornoo/queue-management/AddClientModal";
import { FinishClientDialog } from "@/components/tornoo/queue-management/FinishClientDialog";
import { SuspendQueueDialog } from "@/components/tornoo/queue-management/SuspendQueueDialog";
import { CancelClientDialog } from "@/components/tornoo/queue-management/CancelClientDialog";

export default function ProQueuesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { queue, isLoading, addClient, callNext, finishCurrent, cancelClient, suspendQueue, resumeQueue, closeQueue } = useQueueManagement();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const handleCallNext = async () => {
    await callNext();
    toast("Client suivant appelé", "success");
  };

  const handleFinish = async () => {
    await finishCurrent();
    setShowFinishDialog(false);
    toast("Service terminé avec succès", "success");
  };

  const handleSuspend = async () => {
    await suspendQueue();
    setShowSuspendDialog(false);
    toast("File suspendue", "info");
  };

  const handleResume = async () => {
    await resumeQueue();
    setShowSuspendDialog(false);
    toast("File reprise", "success");
  };

  const handleCancelClient = async () => {
    if (queue.currentClient) {
      await cancelClient(queue.currentClient.id);
      toast(`${queue.currentClient.name} annulé`, "info");
    }
    setShowCancelDialog(false);
  };

  const handleCloseQueue = async () => {
    await closeQueue();
    setShowCancelDialog(false);
    toast("File fermée", "info");
  };

  const handleQRCode = () => {
    router.push(`/pro/queues/${queue.id}/qr`);
  };

  return (
    <>
      <div className="flex min-h-svh">
        <QueueSidebar activeItem="Gestion des files" />

        <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
          <QueueHeader onQRCode={handleQRCode} />

          <div className="flex-1 px-4 lg:px-6 py-5 space-y-5">
            <QueueSummaryCard
              queue={queue}
              onSuspend={() => setShowSuspendDialog(true)}
              onResume={() => setShowSuspendDialog(true)}
            />

            <div className="flex gap-5">
              <div className="flex-1 min-w-0 space-y-5">
                <CurrentClientCard
                  client={queue.currentClient}
                  onCallNext={handleCallNext}
                  isLoading={isLoading}
                />
                <WaitingClientList
                  clients={queue.clients}
                  onCall={async (id) => {
                    await callNext();
                    toast("Client appelé", "success");
                  }}
                  onCancel={async (id) => {
                    await cancelClient(id);
                    toast("Client annulé", "info");
                  }}
                  showAll={showAll}
                  onToggleShowAll={() => setShowAll((v) => !v)}
                />
              </div>

              <div className="hidden lg:flex flex-col w-80 shrink-0 space-y-5">
                <QuickActionsPanel
                  queue={queue}
                  onAdd={() => setShowAddModal(true)}
                  onCallNext={handleCallNext}
                  onFinish={() => setShowFinishDialog(true)}
                  onSuspend={() => setShowSuspendDialog(true)}
                  onResume={() => setShowSuspendDialog(true)}
                  onCancel={() => setShowCancelDialog(true)}
                  isLoading={isLoading}
                />
                <QueueStatsPanel stats={MOCK_DAILY_STATS} />
                <RecentQueueHistory events={MOCK_HISTORY} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <QueueBottomActionBar
        queue={queue}
        onAdd={() => setShowAddModal(true)}
        onCallNext={handleCallNext}
        onFinish={() => setShowFinishDialog(true)}
        onSuspend={() => setShowSuspendDialog(true)}
        onResume={() => setShowSuspendDialog(true)}
        onCancel={() => setShowCancelDialog(true)}
        isLoading={isLoading}
      />

      <AddClientModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={async (client) => {
          await addClient(client);
          toast(`${client.name} ajouté à la file`, "success");
        }}
        isLoading={isLoading}
      />

      <FinishClientDialog
        open={showFinishDialog}
        client={queue.currentClient}
        onClose={() => setShowFinishDialog(false)}
        onFinish={handleFinish}
        isLoading={isLoading}
      />

      <SuspendQueueDialog
        open={showSuspendDialog}
        status={queue.status}
        onClose={() => setShowSuspendDialog(false)}
        onConfirm={queue.status === "paused" ? handleResume : handleSuspend}
        isLoading={isLoading}
      />

      <CancelClientDialog
        open={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onCancelClient={handleCancelClient}
        onCloseQueue={handleCloseQueue}
        isLoading={isLoading}
        clientName={queue.currentClient?.name}
      />
    </>
  );
}
