import { ProBottomNav } from "@/components/layout/ProBottomNav";
import { PageTransition } from "@/components/layout/PageTransition";

export default function ProLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-[#061819] max-w-lg mx-auto relative">
      <main className="pb-20">
        <PageTransition>{children}</PageTransition>
      </main>
      <ProBottomNav />
    </div>
  );
}
