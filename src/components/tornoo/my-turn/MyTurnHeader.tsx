"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { CaretLeft, Bell } from "@phosphor-icons/react";

export function MyTurnHeader() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between px-5 pt-safe-top pb-4">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-[#009B5A] font-bold text-sm min-w-[72px]"
        aria-label="Retour"
      >
        <CaretLeft weight="bold" size={16} />
        Retour
      </button>

      <span className="text-[#009B5A] font-black text-xl tracking-[0.12em]">TORNOO</span>

      <Link
        href="/notifications"
        className="relative w-10 h-10 flex items-center justify-center min-w-[40px]"
        aria-label="Notifications"
      >
        <Bell weight="regular" size={22} className="text-[#071A2A]" />
        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#009B5A] ring-2 ring-white" />
      </Link>
    </div>
  );
}
