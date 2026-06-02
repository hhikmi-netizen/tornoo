import Link from "next/link";
import { LayoutDashboard, Users, Building2, FileBarChart } from "lucide-react";

const NAV = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Utilisateurs", icon: Users, href: "/admin/users" },
  { label: "Professionnels", icon: Building2, href: "/admin/professionals" },
  { label: "Rapports", icon: FileBarChart, href: "/admin/reports" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-surface-2 lg:flex">
      {/* Sidebar for desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#061819] min-h-svh px-4 py-8">
        <div className="text-white font-black text-xl mb-8 px-3">Tornoo Admin</div>
        <nav className="space-y-1">
          {NAV.map(({ label, icon: Icon, href }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors font-bold text-sm"
            >
              <Icon size={18} />
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
            className="flex-1 flex flex-col items-center gap-1 py-2.5 text-white/50 hover:text-white transition-colors text-xs font-bold"
          >
            <Icon size={20} />
            <span className="text-[10px]">{label}</span>
          </Link>
        ))}
      </nav>

      <main className="flex-1 pb-20 lg:pb-0">{children}</main>
    </div>
  );
}
