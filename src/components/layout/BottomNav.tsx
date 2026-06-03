"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, MagnifyingGlass, MapTrifold, User, QrCode } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/context";

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useI18n();

  const NAV_ITEMS = [
    { label: t.home,    icon: House,           href: "/home" },
    { label: t.search,  icon: MagnifyingGlass, href: "/search" },
    { label: "",        icon: QrCode,          href: "/scan", isScan: true },
    { label: t.map,     icon: MapTrifold,      href: "/map" },
    { label: t.account, icon: User,            href: "/profile" },
  ];

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-line safe-bottom"
      style={{ boxShadow: "0 -1px 0 0 #eaedf0, 0 -8px 24px -8px rgba(20,24,33,.08)" }}
      aria-label="Navigation principale"
    >
      <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => {
          if (item.isScan) {
            return (
              <Link
                key="scan"
                href="/scan"
                className="flex flex-col items-center -mt-6"
                aria-label="Scanner QR"
              >
                <div className="w-14 h-14 rounded-full bg-tornoo-green flex items-center justify-center shadow-[0_4px_20px_rgba(7,152,74,.4)]">
                  <QrCode size={26} weight="bold" className="text-white" />
                </div>
              </Link>
            );
          }

          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 min-w-[56px] py-1",
                "text-xs font-bold transition-colors",
                isActive ? "text-tornoo-green" : "text-ink-3"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <div className={cn(
                "w-11 h-7 rounded-full flex items-center justify-center transition-colors",
                isActive && "bg-tornoo-green/12"
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
