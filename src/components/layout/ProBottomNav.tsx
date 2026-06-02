"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SquaresFour, Users, ChartBar, User, Plus } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Accueil", icon: SquaresFour, href: "/pro" },
  { label: "Files", icon: Users, href: "/pro/queues" },
  { label: "", icon: Plus, href: "/pro/queues/new", isAction: true },
  { label: "Stats", icon: ChartBar, href: "/pro/statistics" },
  { label: "Profil", icon: User, href: "/pro/profile" },
];

export function ProBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 bg-[#061819]/95 backdrop-blur-md border-t border-white/10 safe-bottom"
      style={{ boxShadow: "0 -8px 24px -8px rgba(0,0,0,.4)" }}
      aria-label="Navigation professionnelle"
    >
      <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => {
          if (item.isAction) {
            return (
              <Link
                key="action"
                href={item.href}
                className="flex flex-col items-center gap-1 -mt-6"
                aria-label="Nouveau ticket"
              >
                <div className="w-14 h-14 rounded-full bg-tornoo-green flex items-center justify-center shadow-[0_4px_20px_rgba(7,152,74,.5)]">
                  <Plus size={28} className="text-white" />
                </div>
                <span className="text-[10px] font-bold text-tornoo-green">Nouveau</span>
              </Link>
            );
          }

          const isActive = pathname === item.href || (item.href !== "/pro" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 min-w-[56px] py-1",
                "text-xs font-bold transition-colors",
                isActive ? "text-tornoo-green" : "text-white/40"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <div className={cn(
                "w-11 h-7 rounded-full flex items-center justify-center transition-colors",
                isActive && "bg-white/12"
              )}>
                <Icon size={22} weight={isActive ? "fill" : "regular"} />
              </div>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
