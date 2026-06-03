"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MOCK_QUEUE } from "@/data/mockQueues";

export default function ProQueuesPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/pro/queues/${MOCK_QUEUE.id}`);
  }, [router]);

  return (
    <div className="min-h-svh bg-[#F8FAFC] flex items-center justify-center">
      <span className="w-8 h-8 rounded-full border-2 border-[#009B5A] border-t-transparent animate-spin" />
    </div>
  );
}
