"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminNav } from "@/components/layout/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("tornoo_auth");
    const role = localStorage.getItem("tornoo_role");
    // Allow access if authenticated as pro (demo) or explicit admin role
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
    <div className="min-h-svh bg-surface-2 lg:flex">
      <AdminNav />
      <main className="flex-1 pb-28 lg:pb-0">{children}</main>
    </div>
  );
}
