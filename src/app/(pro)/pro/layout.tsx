import { ProBottomNav } from "@/components/layout/ProBottomNav";

export default function ProLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-[#061819] max-w-lg mx-auto relative">
      <main className="pb-20">{children}</main>
      <ProBottomNav />
    </div>
  );
}
