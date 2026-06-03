"use client";
import Link from "next/link";
import { House, ListBullets, Users, Wrench, UsersFour, ChartBar, Gear, Bell, Question, CaretDown } from "@phosphor-icons/react";
import { TornooMark } from "@/components/tornoo/TornooLogo";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; weight?: "duotone" | "bold" | "fill" | "regular"; className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Tableau de bord", href: "/pro", icon: House },
  { label: "Gestion des files", href: "/pro/queues", icon: ListBullets },
  { label: "Clients", href: "/pro/queues", icon: Users },
  { label: "Services", href: "/pro/services", icon: Wrench },
  { label: "Employés", href: "/pro/team", icon: UsersFour },
  { label: "Statistiques", href: "/pro/analytics", icon: ChartBar },
  { label: "Paramètres", href: "/pro/settings", icon: Gear },
];

interface QueueSidebarProps {
  activeItem: string;
}

export function QueueSidebar({ activeItem }: QueueSidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-40">
      <div className="px-5 py-5 flex items-center gap-2">
        <TornooMark size={32} />
        <span className="text-[#062E24] font-black text-lg tracking-widest">TORNOO</span>
      </div>

      <div className="mx-4 mb-4 p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#062E24] flex items-center justify-center shrink-0">
          <span className="text-white font-black text-sm">BC</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-gray-900 truncate">Barber Club</p>
          <p className="text-xs text-[#009B5A] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#009B5A] inline-block" />
            En ligne
          </p>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = item.label === activeItem;
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#062E24] text-white"
                  : "text-[#667085] hover:bg-gray-50"
              )}
            >
              <Icon size={18} weight="duotone" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-4 space-y-0.5 border-t border-gray-100 pt-3">
        <Link
          href="/notifications"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#667085] hover:bg-gray-50 transition-colors"
        >
          <Bell size={18} weight="duotone" />
          <span className="flex-1">Notifications</span>
          <span className="bg-[#EF2B24] text-white text-[10px] font-black rounded-full px-1.5 py-0.5 min-w-[18px] text-center">3</span>
        </Link>
        <button className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#667085] hover:bg-gray-50 transition-colors">
          <Question size={18} weight="duotone" />
          Aide &amp; support
        </button>
        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="w-8 h-8 rounded-full bg-[#062E24] flex items-center justify-center shrink-0">
            <span className="text-white font-black text-xs">Y</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-gray-900">Youssef</p>
            <p className="text-xs text-gray-500">Propriétaire</p>
          </div>
          <CaretDown size={14} weight="bold" className="text-gray-400" />
        </div>
      </div>
    </aside>
  );
}
