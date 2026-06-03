"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ImmersiveLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("tornoo_auth");
    if (!auth) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) return null;

  return <>{children}</>;
}
