import { type Icon as PhosphorIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  up?: boolean;
  icon?: PhosphorIcon;
  color?: string;
  className?: string;
}

export function StatCard({ label, value, change, up, icon: Icon, color = "#07984a", className }: StatCardProps) {
  return (
    <div className={cn("bg-white rounded-[20px] border border-line shadow-1 p-4", className)}>
      <div className="flex items-center justify-between mb-2">
        {Icon && (
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
            <Icon size={17} style={{ color }} />
          </div>
        )}
        {change && (
          <span className={cn("text-xs font-bold ml-auto", up ? "text-tornoo-green" : "text-tornoo-red")}>
            {up ? "▲" : "▼"} {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-black text-ink leading-none">{value}</p>
      <p className="text-xs text-ink-3 mt-1">{label}</p>
    </div>
  );
}
