"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProBottomNav } from "@/components/layout/ProBottomNav";
import { PageTransition } from "@/components/layout/PageTransition";

export default function ProLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("tornoo_auth");
    const role = localStorage.getItem("tornoo_role");
    if (!auth) {
      router.replace("/login");
      return;
    }
    if (role === "client") {
      router.replace("/home");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) return null;

  return (
    <div className="min-h-svh bg-[#F8FAFC] max-w-lg mx-auto relative lg:max-w-none">
      <main className="pb-20 lg:pb-0">
        <PageTransition>{children}</PageTransition>
      </main>
      <div className="lg:hidden">
        <ProBottomNav />
      </div>
    </div>
  );
}
