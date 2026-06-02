import { AdminNav } from "@/components/layout/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-surface-2 lg:flex">
      <AdminNav />
      <main className="flex-1 pb-20 lg:pb-0">{children}</main>
    </div>
  );
}
