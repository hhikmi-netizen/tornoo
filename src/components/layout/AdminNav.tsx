"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SquaresFour, Users, Buildings, ChartBar } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Dashboard", icon: SquaresFour, href: "/admin" },
  { label: "Utilisateurs", icon: Users, href: "/admin/users" },
  { label: "Professionnels", icon: Buildings, href: "/admin/professionals" },
  { label: "Rapports", icon: ChartBar, href: "/admin/reports" },
];

export function AdminNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <>
      {/* Sidebar for desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#061819] min-h-svh px-4 py-8">
        <div className="text-white font-black text-xl mb-8 px-3">Tornoo Admin</div>
        <nav className="space-y-1">
          {NAV.map(({ label, icon: Icon, href }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition-colors",
                isActive(href)
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              )}
            >
              <Icon size={18} weight={isActive(href) ? "fill" : "regular"} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-[#061819] border-t border-white/10 flex">
        {NAV.map(({ label, icon: Icon, href }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex-1 flex flex-col items-center gap-1 py-2.5 text-xs font-bold transition-colors",
              isActive(href) ? "text-tornoo-green" : "text-white/50 hover:text-white"
            )}
          >
            <Icon size={20} weight={isActive(href) ? "fill" : "regular"} />
            <span className="text-[10px]">{label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
