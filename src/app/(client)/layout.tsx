"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/layout/BottomNav";
import { PageTransition } from "@/components/layout/PageTransition";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("tornoo_auth");
    const role = localStorage.getItem("tornoo_role");
    if (!auth) {
      router.replace("/login");
      return;
    }
    if (role === "pro") {
      router.replace("/pro");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) return null;

  return (
    <div className="min-h-svh bg-surface-2 max-w-lg mx-auto relative">
      <main className="pb-20">
        <PageTransition>{children}</PageTransition>
      </main>
      <BottomNav />
    </div>
  );
}
