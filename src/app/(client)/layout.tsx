import { BottomNav } from "@/components/layout/BottomNav";
import { PageTransition } from "@/components/layout/PageTransition";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-surface-2 max-w-lg mx-auto relative">
      <main className="pb-20">
        <PageTransition>{children}</PageTransition>
      </main>
      <BottomNav />
    </div>
  );
}
